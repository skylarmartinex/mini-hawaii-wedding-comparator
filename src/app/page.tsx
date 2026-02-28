"use client";

import { useState } from "react";
import { useOptionStore } from "@/store/useOptionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { OptionCard } from "@/components/options/OptionCard";
import { OptionFilters } from "@/components/options/OptionFilters";
import { OptionForm } from "@/components/options/OptionForm";
import { Button } from "@/components/ui/Button";
import type { WeddingOption } from "@/lib/types";

export default function OptionListPage() {
  const filteredOptions = useOptionStore((s) => s.filteredOptions);
  const guestCount = useBudgetStore((s) => s.budget.guestCount);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WeddingOption | undefined>();

  const options = filteredOptions(guestCount);

  const openAdd = () => {
    setEditTarget(undefined);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Wedding Options</h1>
        <Button onClick={openAdd}>+ Add Option</Button>
      </div>

      <OptionFilters />

      {options.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-500">
            No options yet. Add your first one or load sample data from Settings.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {options.map((option) => (
            <OptionCard key={option.id} option={option} />
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {options.length} option{options.length !== 1 ? "s" : ""} shown
      </p>

      <OptionForm open={formOpen} onClose={() => setFormOpen(false)} editOption={editTarget} />
    </div>
  );
}
