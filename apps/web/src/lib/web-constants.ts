import type { StatusKey, NoiseLevel } from "@wedding/shared";

export const STATUS_COLORS: Record<StatusKey, string> = {
  RESEARCHING: "bg-blue-100 text-blue-800",
  SHORTLISTED: "bg-amber-100 text-amber-800",
  ELIMINATED: "bg-gray-100 text-gray-500",
  FINALIST: "bg-green-100 text-green-800",
};

export const NOISE_COLORS: Record<NoiseLevel, string> = {
  low: "text-green-600",
  med: "text-amber-600",
  high: "text-red-600",
  unknown: "text-gray-400",
};
