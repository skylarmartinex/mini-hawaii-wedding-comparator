import { z } from "zod";
import {
  OptionSchema,
  OptionCreateSchema,
  ImageSchema,
  BudgetAssumptionsSchema,
  CompareBoardSchema,
  ExportBundleSchema,
} from "./schemas";

export type WeddingOption = z.infer<typeof OptionSchema>;
export type OptionCreate = z.infer<typeof OptionCreateSchema>;
export type OptionImage = z.infer<typeof ImageSchema>;
export type BudgetAssumptions = z.infer<typeof BudgetAssumptionsSchema>;
export type CompareBoard = z.infer<typeof CompareBoardSchema>;
export type ExportBundle = z.infer<typeof ExportBundleSchema>;

export type SortField =
  | "updatedAt"
  | "costLow"
  | "costHigh"
  | "photoRating"
  | "name";
export type SortDirection = "asc" | "desc";

export interface FilterState {
  location: string | null;
  type: string | null;
  status: string | null;
  receptionOnSite: string | null;
  capacityMeetsGuests: boolean;
  costMax: number | null;
  tags: string[];
  searchQuery: string;
}
