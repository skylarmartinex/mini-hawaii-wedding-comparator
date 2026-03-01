// ── Enums & Labels ──────────────────────────────────────────────────────────

export const OPTION_TYPES = {
  EVENT_FRIENDLY_RENTAL: "Event-Friendly Rental",
  PRIVATE_ESTATE_VENUE: "Private Estate / Venue",
  RETREAT_CENTER: "Retreat Center",
  RESORT_PACKAGE: "Resort Package",
  BOUTIQUE_VENUE: "Boutique Venue",
  RESTAURANT_BUYOUT: "Restaurant Buyout",
  BEACH_PERMIT_PLUS_RECEPTION: "Beach Permit + Reception",
  PARK_GARDEN_PERMIT_PLUS_RECEPTION: "Park / Garden Permit + Reception",
  BOAT_BUYOUT: "Boat Buyout",
  ALL_INCLUSIVE_PLANNER_PACKAGE: "All-Inclusive Planner Package",
  TWO_LOCATION_CEREMONY_RECEPTION: "Two-Location (Ceremony + Reception)",
} as const;

export type OptionTypeKey = keyof typeof OPTION_TYPES;

export const STATUSES = {
  RESEARCHING: "Researching",
  SHORTLISTED: "Shortlisted",
  ELIMINATED: "Eliminated",
  FINALIST: "Finalist",
} as const;

export type StatusKey = keyof typeof STATUSES;

export const TRI_STATE = ["yes", "no", "unknown"] as const;
export type TriState = (typeof TRI_STATE)[number];

export const NOISE_LEVELS = ["low", "med", "high", "unknown"] as const;
export type NoiseLevel = (typeof NOISE_LEVELS)[number];

export const COST_CONFIDENCE = ["low", "med", "high"] as const;
export type CostConfidence = (typeof COST_CONFIDENCE)[number];

export const BAR_STYLES = ["none", "beer_wine", "full"] as const;
export type BarStyle = (typeof BAR_STYLES)[number];

export const RENTAL_LEVELS = ["minimal", "standard", "full"] as const;
export type RentalLevel = (typeof RENTAL_LEVELS)[number];

// ── Display labels (no CSS / Tailwind) ──────────────────────────────────────

export const BAR_STYLE_LABELS: Record<BarStyle, string> = {
  none: "No Bar",
  beer_wine: "Beer & Wine",
  full: "Full Open Bar",
};

export const RENTAL_LEVEL_LABELS: Record<RentalLevel, string> = {
  minimal: "Minimal",
  standard: "Standard",
  full: "Full Production",
};

// ── Database / Storage Constants ────────────────────────────────────────────

export const DB_NAME = "wedding-research-engine" as const;
export const DB_VERSION = 2;
export const STORE_OPTIONS = "options" as const;
export const STORE_BUDGET = "budget" as const;
export const STORE_COMPARE = "compare" as const;
export const LS_PREFIX = "wre_" as const;

export const LEGACY_DB_NAME = "mini-hawaii-wedding" as const;
export const LEGACY_LS_PREFIX = "mhw_" as const;
