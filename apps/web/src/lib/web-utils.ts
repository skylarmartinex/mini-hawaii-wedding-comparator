import type { FitLabel } from "@wedding/shared";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const FIT_BADGE_STYLES: Record<FitLabel, string> = {
  under: "bg-green-100 text-green-700",
  within: "bg-blue-100 text-blue-700",
  over: "bg-red-100 text-red-700",
  unknown: "bg-gray-100 text-gray-500",
};

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
