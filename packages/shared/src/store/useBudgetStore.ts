import { create } from "zustand";
import type { BudgetAssumptions } from "../types";
import { BudgetAssumptionsSchema } from "../schemas";
import { getAdapter } from "./persistence-context";

interface BudgetStore {
  budget: BudgetAssumptions;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  update: (patch: Partial<BudgetAssumptions>) => Promise<void>;
}

const DEFAULT_BUDGET: BudgetAssumptions = {
  guestCount: 60,
  barStyle: "beer_wine",
  rentalsLevel: "standard",
  planner: false,
  targetBudget: undefined,
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budget: { ...DEFAULT_BUDGET },
  hydrated: false,

  hydrate: async () => {
    const adapter = getAdapter();
    const saved = await adapter.loadBudget();
    if (saved) {
      const parsed = BudgetAssumptionsSchema.safeParse(saved);
      set({ budget: parsed.success ? parsed.data : { ...DEFAULT_BUDGET }, hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  update: async (patch) => {
    const adapter = getAdapter();
    const updated = BudgetAssumptionsSchema.parse({
      ...get().budget,
      ...patch,
    });
    await adapter.saveBudget(updated);
    set({ budget: updated });
  },
}));
