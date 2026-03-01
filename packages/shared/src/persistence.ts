import type { WeddingOption, BudgetAssumptions, CompareBoard } from "./types";

/**
 * Platform-agnostic persistence interface.
 * Web implements with IndexedDB, mobile with expo-sqlite.
 */
export interface PersistenceAdapter {
  // Options
  loadOptions(): Promise<WeddingOption[]>;
  saveOption(option: WeddingOption): Promise<void>;
  deleteOption(id: string): Promise<void>;
  saveAllOptions(options: WeddingOption[]): Promise<void>;

  // Budget
  loadBudget(): Promise<BudgetAssumptions | null>;
  saveBudget(budget: BudgetAssumptions): Promise<void>;

  // Compare
  loadCompare(): Promise<CompareBoard | null>;
  saveCompare(compare: CompareBoard): Promise<void>;

  // Lifecycle
  clearAll(): Promise<void>;
  migrateIfNeeded?(): Promise<void>;
}
