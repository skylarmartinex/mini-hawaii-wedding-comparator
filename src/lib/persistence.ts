import { openDB, type IDBPDatabase } from "idb";
import {
  DB_NAME,
  DB_VERSION,
  STORE_OPTIONS,
  STORE_BUDGET,
  STORE_COMPARE,
  LS_PREFIX,
} from "./constants";
import type { WeddingOption, BudgetAssumptions, CompareBoard } from "./types";

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

// ── Options persistence ─────────────────────────────────────────────────────

export async function loadOptions(): Promise<WeddingOption[]> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      return await db.getAll(STORE_OPTIONS);
    } catch {
      // fall through to localStorage
    }
  }
  const raw = localStorage.getItem(`${LS_PREFIX}options`);
  return raw ? JSON.parse(raw) : [];
}

export async function saveOption(option: WeddingOption): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.put(STORE_OPTIONS, option);
      return;
    } catch {
      // fall through
    }
  }
  const all = await loadOptions();
  const idx = all.findIndex((o) => o.id === option.id);
  if (idx >= 0) all[idx] = option;
  else all.push(option);
  localStorage.setItem(`${LS_PREFIX}options`, JSON.stringify(all));
}

export async function deleteOption(id: string): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.delete(STORE_OPTIONS, id);
      return;
    } catch {
      // fall through
    }
  }
  const all = await loadOptions();
  localStorage.setItem(
    `${LS_PREFIX}options`,
    JSON.stringify(all.filter((o) => o.id !== id))
  );
}

export async function saveAllOptions(options: WeddingOption[]): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_OPTIONS, "readwrite");
      await tx.store.clear();
      for (const o of options) {
        await tx.store.put(o);
      }
      await tx.done;
      return;
    } catch {
      // fall through
    }
  }
  localStorage.setItem(`${LS_PREFIX}options`, JSON.stringify(options));
}

// ── Budget persistence ──────────────────────────────────────────────────────

const BUDGET_KEY = "singleton";

export async function loadBudget(): Promise<BudgetAssumptions | null> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      return (await db.get(STORE_BUDGET, BUDGET_KEY)) ?? null;
    } catch {
      // fall through
    }
  }
  const raw = localStorage.getItem(`${LS_PREFIX}budget`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveBudget(budget: BudgetAssumptions): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.put(STORE_BUDGET, budget, BUDGET_KEY);
      return;
    } catch {
      // fall through
    }
  }
  localStorage.setItem(`${LS_PREFIX}budget`, JSON.stringify(budget));
}

// ── Compare persistence ─────────────────────────────────────────────────────

const COMPARE_KEY = "singleton";

export async function loadCompare(): Promise<CompareBoard | null> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      return (await db.get(STORE_COMPARE, COMPARE_KEY)) ?? null;
    } catch {
      // fall through
    }
  }
  const raw = localStorage.getItem(`${LS_PREFIX}compare`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveCompare(compare: CompareBoard): Promise<void> {
  if (isIDBAvailable()) {
    try {
      const db = await getDB();
      await db.put(STORE_COMPARE, compare, COMPARE_KEY);
      return;
    } catch {
      // fall through
    }
  }
  localStorage.setItem(`${LS_PREFIX}compare`, JSON.stringify(compare));
}

// ── Clear all ───────────────────────────────────────────────────────────────

export async function clearAll(): Promise<void> {
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
    } catch {
      // fall through
    }
  }
  localStorage.removeItem(`${LS_PREFIX}options`);
  localStorage.removeItem(`${LS_PREFIX}budget`);
  localStorage.removeItem(`${LS_PREFIX}compare`);
}
