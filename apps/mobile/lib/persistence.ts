import * as SQLite from "expo-sqlite";
import type { PersistenceAdapter, WeddingOption, BudgetAssumptions, CompareBoard } from "@wedding/shared";

const DB_NAME = "wedding-research-engine.db";

let db: SQLite.SQLiteDatabase | null = null;

async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS options (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS budget (
        key TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS compare_board (
        key TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
    `);
  }
  return db;
}

export function createMobilePersistenceAdapter(): PersistenceAdapter {
  return {
    async loadOptions() {
      const database = await getDB();
      const rows = await database.getAllAsync<{ data: string }>(
        "SELECT data FROM options"
      );
      return rows.map((r) => JSON.parse(r.data) as WeddingOption);
    },

    async saveOption(option) {
      const database = await getDB();
      await database.runAsync(
        "INSERT OR REPLACE INTO options (id, data) VALUES (?, ?)",
        [option.id, JSON.stringify(option)]
      );
    },

    async deleteOption(id) {
      const database = await getDB();
      await database.runAsync("DELETE FROM options WHERE id = ?", [id]);
    },

    async saveAllOptions(options) {
      const database = await getDB();
      await database.withTransactionAsync(async () => {
        await database.runAsync("DELETE FROM options");
        for (const opt of options) {
          await database.runAsync(
            "INSERT INTO options (id, data) VALUES (?, ?)",
            [opt.id, JSON.stringify(opt)]
          );
        }
      });
    },

    async loadBudget() {
      const database = await getDB();
      const row = await database.getFirstAsync<{ data: string }>(
        "SELECT data FROM budget WHERE key = 'singleton'"
      );
      return row ? (JSON.parse(row.data) as BudgetAssumptions) : null;
    },

    async saveBudget(budget) {
      const database = await getDB();
      await database.runAsync(
        "INSERT OR REPLACE INTO budget (key, data) VALUES ('singleton', ?)",
        [JSON.stringify(budget)]
      );
    },

    async loadCompare() {
      const database = await getDB();
      const row = await database.getFirstAsync<{ data: string }>(
        "SELECT data FROM compare_board WHERE key = 'singleton'"
      );
      return row ? (JSON.parse(row.data) as CompareBoard) : null;
    },

    async saveCompare(compare) {
      const database = await getDB();
      await database.runAsync(
        "INSERT OR REPLACE INTO compare_board (key, data) VALUES ('singleton', ?)",
        [JSON.stringify(compare)]
      );
    },

    async clearAll() {
      const database = await getDB();
      await database.withTransactionAsync(async () => {
        await database.runAsync("DELETE FROM options");
        await database.runAsync("DELETE FROM budget");
        await database.runAsync("DELETE FROM compare_board");
      });
    },
  };
}
