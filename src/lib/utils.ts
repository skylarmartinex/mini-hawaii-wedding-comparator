import type { WeddingOption, BudgetAssumptions } from "./types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCostRange(option: WeddingOption): string {
  const { costRangeLow, costRangeHigh } = option;
  if (costRangeLow != null && costRangeHigh != null) {
    return `${formatCurrency(costRangeLow)} – ${formatCurrency(costRangeHigh)}`;
  }
  if (costRangeLow != null) return `From ${formatCurrency(costRangeLow)}`;
  if (costRangeHigh != null) return `Up to ${formatCurrency(costRangeHigh)}`;
  return "Unknown";
}

export type FitLabel = "under" | "within" | "over" | "unknown";

export function computeFitLabel(
  option: WeddingOption,
  budget: BudgetAssumptions
): FitLabel {
  if (!budget.targetBudget) return "unknown";
  const target = budget.targetBudget;
  const low = option.costRangeLow;
  const high = option.costRangeHigh;

  if (low == null && high == null) return "unknown";

  // Use midpoint if both exist, otherwise the available value
  const representative = low != null && high != null
    ? (low + high) / 2
    : (low ?? high)!;

  if (representative < target * 0.8) return "under";
  if (representative <= target * 1.2) return "within";
  return "over";
}

export const FIT_BADGE_STYLES: Record<FitLabel, string> = {
  under: "bg-green-100 text-green-700",
  within: "bg-blue-100 text-blue-700",
  over: "bg-red-100 text-red-700",
  unknown: "bg-gray-100 text-gray-500",
};

export const FIT_BADGE_TEXT: Record<FitLabel, string> = {
  under: "Under Budget",
  within: "Within Budget",
  over: "Over Budget",
  unknown: "No Budget Set",
};

export function capacityMeetsGuests(
  option: WeddingOption,
  guestCount: number
): boolean | null {
  const seated = option.guestCapacitySeated;
  const standing = option.guestCapacityStanding;
  if (seated == null && standing == null) return null;
  // If seated capacity exists, use that (more conservative for wedding)
  if (seated != null) return seated >= guestCount;
  if (standing != null) return standing >= guestCount;
  return null;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function triStateLabel(val: "yes" | "no" | "unknown"): string {
  return val === "yes" ? "Yes" : val === "no" ? "No" : "Unknown";
}

export function triStateIcon(val: "yes" | "no" | "unknown"): string {
  return val === "yes" ? "\u2713" : val === "no" ? "\u2717" : "?";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
