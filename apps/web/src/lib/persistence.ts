import { openDB, type IDBPDatabase } from "idb";
import type { PersistenceAdapter, WeddingOption, BudgetAssumptions, CompareBoard } from "@wedding/shared";
import {
  DB_NAME,
  DB_VERSION,
  STORE_OPTIONS,
  STORE_BUDGET,
  STORE_COMPARE,
  LS_PREFIX,
  LEGACY_DB_NAME,
  LEGACY_LS_PREFIX,
} from "@wedding/shared";

// ── IndexedDB ───────────────────────────────────────────────────────────────

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_OPTIONS)) {
          db.createObjectStore(STORE_OPTIONS, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_BUDGET)) {
          db.createObjectStore(STORE_BUDGET);
        }
        if (!db.objectStoreNames.contains(STORE_COMPARE)) {
          db.createObjectStore(STORE_COMPARE);
        }
      },
    });
  }
  return dbPromise;
}

function isIDBAvailable(): boolean {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
}

// ── Legacy migration ─────────────────────────────────────────────────────────

async function migrateFromLegacyDB(): Promise<void> {
  try {
    if (localStorage.getItem("wre_migrated_v1") === "true") return;

    let legacyOptions: WeddingOption[] = [];
    let legacyBudget: BudgetAssumptions | null = null;
    let legacyCompare: CompareBoard | null = null;

    if (isIDBAvailable()) {
      try {
        const legacyDb = await openDB(LEGACY_DB_NAME, 1);
        const storeNames = Array.from(legacyDb.objectStoreNames);

        if (storeNames.includes(STORE_OPTIONS)) {
          const raw = await legacyDb.getAll(STORE_OPTIONS);
          legacyOptions = raw.map((o: Record<string, unknown>) => {
            const transformed = { ...o };
            if ("island" in transformed) {
              transformed.location = transformed.island;
              delete transformed.island;
            }
            return transformed as WeddingOption;
          });
        }

        if (storeNames.includes(STORE_BUDGET)) {
          legacyBudget =
            ((await legacyDb.get(STORE_BUDGET, "singleton")) as BudgetAssumptions | undefined) ??
            null;
        }

        if (storeNames.includes(STORE_COMPARE)) {
          legacyCompare =
            ((await legacyDb.get(STORE_COMPARE, "singleton")) as CompareBoard | undefined) ?? null;
        }

        legacyDb.close();
      } catch {
        // Old DB may not exist
      }
    }

    const lsOptions = localStorage.getItem(`${LEGACY_LS_PREFIX}options`);
    if (lsOptions) {
      try {
        const parsed: Array<Record<string, unknown>> = JSON.parse(lsOptions);
        legacyOptions = parsed.map((o) => {
          const transformed = { ...o };
          if ("island" in transformed) {
            transformed.location = transformed.island;
            delete transformed.island;
          }
          return transformed as WeddingOption;
        });
      } catch {
        // ignore malformed
      }
    }

    const lsBudget = localStorage.getItem(`${LEGACY_LS_PREFIX}budget`);
    if (lsBudget) {
      try { legacyBudget = JSON.parse(lsBudget) as BudgetAssumptions; } catch { /* ignore */ }
    }

    const lsCompare = localStorage.getItem(`${LEGACY_LS_PREFIX}compare`);
    if (lsCompare) {
      try { legacyCompare = JSON.parse(lsCompare) as CompareBoard; } catch { /* ignore */ }
    }

    if (legacyOptions.length > 0 || legacyBudget || legacyCompare) {
      const newDb = await getDB();
      if (legacyOptions.length > 0) {
        const tx = newDb.transaction(STORE_OPTIONS, "readwrite");
        await tx.store.clear();
        for (const o of legacyOptions) await tx.store.put(o);
        await tx.done;
      }
      if (legacyBudget) await newDb.put(STORE_BUDGET, legacyBudget, "singleton");
      if (legacyCompare) await newDb.put(STORE_COMPARE, legacyCompare, "singleton");
    }

    localStorage.setItem("wre_migrated_v1", "true");
    localStorage.removeItem(`${LEGACY_LS_PREFIX}options`);
    localStorage.removeItem(`${LEGACY_LS_PREFIX}budget`);
    localStorage.removeItem(`${LEGACY_LS_PREFIX}compare`);

    try { indexedDB.deleteDatabase(LEGACY_DB_NAME); } catch { /* non-blocking */ }
  } catch (err) {
    console.error("[migrateFromLegacyDB] Migration failed, skipping:", err);
  }
}

// ── Options ─────────────────────────────────────────────────────────────────

async function loadOptions(): Promise<WeddingOption[]> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      return await db.getAll(STORE_OPTIONS);
    } catch { /* fall through */ }
  }
  const raw = localStorage.getItem(`${LS_PREFIX}options`);
  return raw ? JSON.parse(raw) : [];
}

async function saveOption(option: WeddingOption): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.put(STORE_OPTIONS, option);
      return;
    } catch { /* fall through */ }
  }
  const all = await loadOptions();
  const idx = all.findIndex((o) => o.id === option.id);
  if (idx >= 0) all[idx] = option;
  else all.push(option);
  localStorage.setItem(`${LS_PREFIX}options`, JSON.stringify(all));
}

async function deleteOption(id: string): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.delete(STORE_OPTIONS, id);
      return;
    } catch { /* fall through */ }
  }
  const all = await loadOptions();
  localStorage.setItem(`${LS_PREFIX}options`, JSON.stringify(all.filter((o) => o.id !== id)));
}

async function saveAllOptions(options: WeddingOption[]): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_OPTIONS, "readwrite");
      await tx.store.clear();
      for (const o of options) await tx.store.put(o);
      await tx.done;
      return;
    } catch { /* fall through */ }
  }
  localStorage.setItem(`${LS_PREFIX}options`, JSON.stringify(options));
}

// ── Budget ──────────────────────────────────────────────────────────────────

async function loadBudget(): Promise<BudgetAssumptions | null> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      return (await db.get(STORE_BUDGET, "singleton")) ?? null;
    } catch { /* fall through */ }
  }
  const raw = localStorage.getItem(`${LS_PREFIX}budget`);
  return raw ? JSON.parse(raw) : null;
}

async function saveBudget(budget: BudgetAssumptions): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.put(STORE_BUDGET, budget, "singleton");
      return;
    } catch { /* fall through */ }
  }
  localStorage.setItem(`${LS_PREFIX}budget`, JSON.stringify(budget));
}

// ── Compare ─────────────────────────────────────────────────────────────────

async function loadCompare(): Promise<CompareBoard | null> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      return (await db.get(STORE_COMPARE, "singleton")) ?? null;
    } catch { /* fall through */ }
  }
  const raw = localStorage.getItem(`${LS_PREFIX}compare`);
  return raw ? JSON.parse(raw) : null;
}

async function saveCompare(compare: CompareBoard): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.put(STORE_COMPARE, compare, "singleton");
      return;
    } catch { /* fall through */ }
  }
  localStorage.setItem(`${LS_PREFIX}compare`, JSON.stringify(compare));
}

// ── Clear all ───────────────────────────────────────────────────────────────

async function clearAll(): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      const tx1 = db.transaction(STORE_OPTIONS, "readwrite");
      await tx1.store.clear();
      await tx1.done;
      const tx2 = db.transaction(STORE_BUDGET, "readwrite");
      await tx2.store.clear();
      await tx2.done;
      const tx3 = db.transaction(STORE_COMPARE, "readwrite");
      await tx3.store.clear();
      await tx3.done;
    } catch { /* fall through */ }
  }
  localStorage.removeItem(`${LS_PREFIX}options`);
  localStorage.removeItem(`${LS_PREFIX}budget`);
  localStorage.removeItem(`${LS_PREFIX}compare`);
}

// ── Adapter factory ─────────────────────────────────────────────────────────

export function createWebPersistenceAdapter(): PersistenceAdapter {
  return {
    loadOptions,
    saveOption,
    deleteOption,
    saveAllOptions,
    loadBudget,
    saveBudget,
    loadCompare,
    saveCompare,
    clearAll,
    migrateIfNeeded: migrateFromLegacyDB,
  };
}
