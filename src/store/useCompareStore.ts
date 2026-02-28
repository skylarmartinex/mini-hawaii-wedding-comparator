import { create } from "zustand";
import type { CompareBoard } from "@/lib/types";
import { CompareBoardSchema } from "@/lib/schemas";
import { loadCompare, saveCompare } from "@/lib/persistence";

interface CompareStore {
  board: CompareBoard;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  pinOption: (id: string) => Promise<void>;
  unpinOption: (id: string) => Promise<void>;
  clearBoard: () => Promise<void>;
  isPinned: (id: string) => boolean;
  canPin: () => boolean;
}

const DEFAULT_BOARD: CompareBoard = { pinnedOptionIds: [] };

export const useCompareStore = create<CompareStore>((set, get) => ({
  board: { ...DEFAULT_BOARD },
  hydrated: false,

  hydrate: async () => {
    const saved = await loadCompare();
    if (saved) {
      const parsed = CompareBoardSchema.safeParse(saved);
      set({
        board: parsed.success ? parsed.data : { ...DEFAULT_BOARD },
        hydrated: true,
      });
    } else {
      set({ hydrated: true });
    }
  },

  pinOption: async (id) => {
    const { board } = get();
    if (board.pinnedOptionIds.includes(id)) return;
    if (board.pinnedOptionIds.length >= 4) return;
    const updated = {
      pinnedOptionIds: [...board.pinnedOptionIds, id],
    };
    await saveCompare(updated);
    set({ board: updated });
  },

  unpinOption: async (id) => {
    const { board } = get();
    const updated = {
      pinnedOptionIds: board.pinnedOptionIds.filter((pid) => pid !== id),
    };
    await saveCompare(updated);
    set({ board: updated });
  },

  clearBoard: async () => {
    await saveCompare({ ...DEFAULT_BOARD });
    set({ board: { ...DEFAULT_BOARD } });
  },

  isPinned: (id) => get().board.pinnedOptionIds.includes(id),
  canPin: () => get().board.pinnedOptionIds.length < 4,
}));
