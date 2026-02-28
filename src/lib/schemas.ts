import { z } from "zod";

// ── Shared enums ────────────────────────────────────────────────────────────

export const OptionTypeEnum = z.enum([
  "EVENT_FRIENDLY_RENTAL",
  "PRIVATE_ESTATE_VENUE",
  "RETREAT_CENTER",
  "RESORT_PACKAGE",
  "BOUTIQUE_VENUE",
  "RESTAURANT_BUYOUT",
  "BEACH_PERMIT_PLUS_RECEPTION",
  "PARK_GARDEN_PERMIT_PLUS_RECEPTION",
  "BOAT_BUYOUT",
  "ALL_INCLUSIVE_PLANNER_PACKAGE",
  "TWO_LOCATION_CEREMONY_RECEPTION",
]);

export const StatusEnum = z.enum([
  "RESEARCHING",
  "SHORTLISTED",
  "ELIMINATED",
  "FINALIST",
]);

export const TriStateEnum = z.enum(["yes", "no", "unknown"]);
export const NoiseLevelEnum = z.enum(["low", "med", "high", "unknown"]);
export const CostConfidenceEnum = z.enum(["low", "med", "high"]);
export const BarStyleEnum = z.enum(["none", "beer_wine", "full"]);
export const RentalLevelEnum = z.enum(["minimal", "standard", "full"]);

// ── Image ───────────────────────────────────────────────────────────────────

export const ImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  caption: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  credit: z.string().optional(),
});

// ── Option ──────────────────────────────────────────────────────────────────

export const OptionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: OptionTypeEnum,
  location: z.string().default(""),
  area: z.string().default(""),
  addressText: z.string().optional(),
  mapsUrl: z.string().url().optional().or(z.literal("")),
  sourceLinks: z.array(z.string()).default([]),

  guestCapacitySeated: z.number().int().positive().optional(),
  guestCapacityStanding: z.number().int().positive().optional(),

  ceremonyOnSite: TriStateEnum.default("unknown"),
  receptionOnSite: TriStateEnum.default("unknown"),

  curfewTime: z.string().optional(),
  noiseRisk: NoiseLevelEnum.default("unknown"),
  parkingNotes: z.string().optional(),

  costRangeLow: z.number().nonnegative().optional(),
  costRangeHigh: z.number().nonnegative().optional(),
  costConfidence: CostConfidenceEnum.default("low"),
  costNotes: z.string().optional(),

  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  questionsToAsk: z.array(z.string()).default([]),

  tags: z.array(z.string()).default([]),
  images: z.array(ImageSchema).default([]),

  photoRating: z.number().int().min(1).max(5).optional(),

  status: StatusEnum.default("RESEARCHING"),
  notes: z.string().optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating — id and timestamps auto-generated
export const OptionCreateSchema = OptionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ── Budget Assumptions ──────────────────────────────────────────────────────

export const BudgetAssumptionsSchema = z.object({
  guestCount: z.number().int().positive().default(60),
  barStyle: BarStyleEnum.default("beer_wine"),
  rentalsLevel: RentalLevelEnum.default("standard"),
  planner: z.boolean().default(false),
  targetBudget: z.number().nonnegative().optional(),
});

// ── Compare Board ───────────────────────────────────────────────────────────

export const CompareBoardSchema = z.object({
  pinnedOptionIds: z.array(z.string()).max(4).default([]),
});

// ── Export bundle ───────────────────────────────────────────────────────────

export const LegacyOptionSchema = OptionSchema.omit({ location: true }).extend({
  island: z.string().default(""),
});

export const ExportBundleSchema = z.object({
  version: z.literal(2),
  exportedAt: z.string().datetime(),
  options: z.array(OptionSchema),
  budget: BudgetAssumptionsSchema,
  compare: CompareBoardSchema,
});
