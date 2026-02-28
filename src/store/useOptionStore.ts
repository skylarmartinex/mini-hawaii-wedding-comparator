import { create } from "zustand";
import { SEED_OPTIONS } from "@/data/seed";
import { nanoid } from "nanoid";
import type {
  WeddingOption,
  OptionCreate,
  FilterState,
  SortField,
  SortDirection,
} from "@/lib/types";
import { OptionSchema } from "@/lib/schemas";
import {
  loadOptions,
  saveOption,
  deleteOption as deleteOptionDB,
  saveAllOptions,
  migrateFromLegacyDB,
} from "@/lib/persistence";

interface OptionStore {
  options: WeddingOption[];
  hydrated: boolean;

  // filters
  filters: FilterState;
  sortField: SortField;
  sortDir: SortDirection;

  // actions
  hydrate: () => Promise<void>;
  addOption: (data: OptionCreate) => Promise<WeddingOption>;
  updateOption: (id: string, patch: Partial<WeddingOption>) => Promise<void>;
  removeOption: (id: string) => Promise<void>;
  setStatus: (id: string, status: WeddingOption["status"]) => Promise<void>;
  importOptions: (options: WeddingOption[]) => Promise<void>;

  // filter actions
  setFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
  setSort: (field: SortField, dir: SortDirection) => void;

  // derived
  filteredOptions: (guestCount: number) => WeddingOption[];
  getOption: (id: string) => WeddingOption | undefined;
  allTags: () => string[];
  allLocations: () => string[];
}

const DEFAULT_FILTERS: FilterState = {
  location: null,
  type: null,
  status: null,
  receptionOnSite: null,
  capacityMeetsGuests: false,
  costMax: null,
  tags: [],
  searchQuery: "",
};

export const useOptionStore = create<OptionStore>((set, get) => ({
  options: [],
  hydrated: false,
  filters: { ...DEFAULT_FILTERS },
  sortField: "updatedAt",
  sortDir: "desc",

  hydrate: async () => {
    await migrateFromLegacyDB();
    let options = await loadOptions();
    // Auto-load seed data on first visit
    if (options.length === 0) {
      await saveAllOptions(SEED_OPTIONS);
      options = SEED_OPTIONS;
    }
    set({ options, hydrated: true });
  },

  addOption: async (data) => {
    const now = new Date().toISOString();
    const raw = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    const option = OptionSchema.parse(raw);
    await saveOption(option);
    set((s) => ({ options: [...s.options, option] }));
    return option;
  },

  updateOption: async (id, patch) => {
    const existing = get().options.find((o) => o.id === id);
    if (!existing) return;
    const updated = OptionSchema.parse({
      ...existing,
      ...patch,
      id,
      updatedAt: new Date().toISOString(),
    });
    await saveOption(updated);
    set((s) => ({
      options: s.options.map((o) => (o.id === id ? updated : o)),
    }));
  },

  removeOption: async (id) => {
    await deleteOptionDB(id);
    set((s) => ({ options: s.options.filter((o) => o.id !== id) }));
  },

  setStatus: async (id, status) => {
    await get().updateOption(id, { status });
  },

  importOptions: async (options) => {
    const validated = options.map((o) => OptionSchema.parse(o));
    await saveAllOptions(validated);
    set({ options: validated });
  },

  setFilter: (key, value) => {
    set((s) => ({ filters: { ...s.filters, [key]: value } }));
  },

  resetFilters: () => {
    set({ filters: { ...DEFAULT_FILTERS } });
  },

  setSort: (field, dir) => {
    set({ sortField: field, sortDir: dir });
  },

  filteredOptions: (guestCount) => {
    const { options, filters, sortField, sortDir } = get();

    let result = [...options];

    // Search
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.area.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filters
    if (filters.location) {
      result = result.filter((o) => o.location === filters.location);
    }
    if (filters.type) {
      result = result.filter((o) => o.type === filters.type);
    }
    if (filters.status) {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters.receptionOnSite) {
      result = result.filter(
        (o) => o.receptionOnSite === filters.receptionOnSite
      );
    }
    if (filters.capacityMeetsGuests) {
      result = result.filter((o) => {
        const cap = o.guestCapacitySeated ?? o.guestCapacityStanding;
        return cap != null && cap >= guestCount;
      });
    }
    if (filters.costMax != null) {
      result = result.filter((o) => {
        if (o.costRangeLow == null) return true; // include unknowns
        return o.costRangeLow <= filters.costMax!;
      });
    }
    if (filters.tags.length > 0) {
      result = result.filter((o) =>
        filters.tags.every((t) => o.tags.includes(t))
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "updatedAt":
          cmp = a.updatedAt.localeCompare(b.updatedAt);
          break;
        case "costLow":
          cmp = (a.costRangeLow ?? Infinity) - (b.costRangeLow ?? Infinity);
          break;
        case "costHigh":
          cmp = (a.costRangeHigh ?? Infinity) - (b.costRangeHigh ?? Infinity);
          break;
        case "photoRating":
          cmp = (a.photoRating ?? 0) - (b.photoRating ?? 0);
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  },

  getOption: (id) => get().options.find((o) => o.id === id),

  allTags: () => {
    const tags = new Set<string>();
    for (const o of get().options) {
      for (const t of o.tags) tags.add(t);
    }
    return Array.from(tags).sort();
  },

  allLocations: () => {
    const locs = new Set<string>();
    for (const o of get().options) {
      if (o.location) locs.add(o.location);
    }
    return Array.from(locs).sort();
  },
}));
