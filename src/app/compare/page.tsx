"use client";

import Link from "next/link";
import { useOptionStore } from "@/store/useOptionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useCompareStore } from "@/store/useCompareStore";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CompareTable } from "@/components/compare/CompareTable";
import type { WeddingOption } from "@/lib/types";

export default function ComparePage() {
  const { board, unpinOption, clearBoard } = useCompareStore();
  const getOption = useOptionStore((s) => s.getOption);
  const budget = useBudgetStore((s) => s.budget);

  const pinnedOptions = board.pinnedOptionIds
    .map((id) => getOption(id))
    .filter(Boolean) as WeddingOption[];

  if (pinnedOptions.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Compare Board</h1>
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">
            No options pinned. Go to the{" "}
            <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
              options list
            </Link>{" "}
            and pin 2–4 options to compare.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Compare Board ({pinnedOptions.length})
          </h1>
          {budget.targetBudget ? (
            <p className="mt-1 text-sm text-slate-500">
              Target budget: <span className="font-medium text-slate-700">{formatCurrency(budget.targetBudget)}</span> &middot; {budget.guestCount} guests
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">
              No target budget set &middot; {budget.guestCount} guests
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={clearBoard} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-200">
            Clear Board
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700 hover:shadow transition-all"
          >
            Add More Options
          </Link>
        </div>
      </div>

      <CompareTable
        options={pinnedOptions}
        budget={budget}
        onRemove={unpinOption}
      />
    </div>
  );
}
