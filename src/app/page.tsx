"use client";

import { useState } from "react";
import { useOptionStore } from "@/store/useOptionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { OptionCard } from "@/components/options/OptionCard";
import { OptionFilters } from "@/components/options/OptionFilters";
import { OptionForm } from "@/components/options/OptionForm";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { WeddingOption } from "@/lib/types";

export default function OptionListPage() {
  const filteredOptions = useOptionStore((s) => s.filteredOptions);
  const guestCount = useBudgetStore((s) => s.budget.guestCount);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WeddingOption | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const options = filteredOptions(guestCount);

  const openAdd = () => {
    setEditTarget(undefined);
    setFormOpen(true);
  };

  const handleEdit = (option: WeddingOption) => {
    setEditTarget(option);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Wedding Options</h1>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("rounded-md px-3 py-1 text-sm font-medium transition-colors", viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900")}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn("rounded-md px-3 py-1 text-sm font-medium transition-colors", viewMode === "table" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900")}
            >
              Table
            </button>
          </div>
          <Button onClick={openAdd}>+ Add Option</Button>
        </div>
      </div>

      <OptionFilters />

      {options.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-16 text-center bg-white">
          <p className="text-sm text-slate-500">
            No options yet. Add your first one or load sample data from Settings.
          </p>
        </div>
      ) : (
        <div className={cn(
          "gap-4",
          viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col space-y-3"
        )}>
          {options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              viewMode={viewMode}
              onEdit={() => handleEdit(option)}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400">
        {options.length} option{options.length !== 1 ? "s" : ""} shown
      </p>

      <OptionForm open={formOpen} onClose={() => setFormOpen(false)} editOption={editTarget} />
    </div>
  );
}
