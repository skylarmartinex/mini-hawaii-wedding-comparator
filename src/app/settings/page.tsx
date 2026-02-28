"use client";

import { useRef, useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useOptionStore } from "@/store/useOptionStore";
import { useCompareStore } from "@/store/useCompareStore";
import { BAR_STYLE_LABELS, RENTAL_LEVEL_LABELS, BAR_STYLES, RENTAL_LEVELS } from "@/lib/constants";
import { ExportBundleSchema } from "@/lib/schemas";
import { downloadJson } from "@/lib/utils";
import { clearAll } from "@/lib/persistence";
import { SEED_OPTIONS } from "@/data/seed";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ExportBundle } from "@/lib/types";

export default function SettingsPage() {
  const { budget, update: updateBudget } = useBudgetStore();
  const { options, importOptions } = useOptionStore();
  const { board } = useCompareStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = () => {
    const bundle: ExportBundle = {
      version: 1,
      exportedAt: new Date().toISOString(),
      options,
      budget,
      compare: board,
    };
    downloadJson(bundle, `minihawaii-export-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const result = ExportBundleSchema.safeParse(raw);
      if (!result.success) {
        setImportError("Invalid export file format: " + result.error.issues[0]?.message);
        return;
      }
      await importOptions(result.data.options);
      await updateBudget(result.data.budget);
      // Compare board: reload from imported data
      for (const id of result.data.compare.pinnedOptionIds) {
        await useCompareStore.getState().pinOption(id);
      }
      setImportSuccess(true);
    } catch {
      setImportError("Failed to parse file. Make sure it's a valid JSON export.");
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLoadSeed = async () => {
    if (options.length > 0 && !confirm("This will replace all current options with sample data. Continue?")) {
      return;
    }
    await importOptions(SEED_OPTIONS);
  };

  const handleClearAll = async () => {
    if (!confirm("This will permanently delete all data. Are you sure?")) return;
    await clearAll();
    // Reload to reset stores
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      {/* Budget Assumptions */}
      <section className="space-y-4 rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900">Budget Assumptions</h2>
        <p className="text-sm text-gray-500">
          These defaults are used for filtering and &quot;fit&quot; labels on the compare board.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="guestCount"
            label="Guest Count"
            type="number"
            value={budget.guestCount}
            onChange={(e) => updateBudget({ guestCount: Number(e.target.value) || 60 })}
          />
          <Input
            id="targetBudget"
            label="Target Budget ($)"
            type="number"
            placeholder="e.g. 25000"
            value={budget.targetBudget ?? ""}
            onChange={(e) =>
              updateBudget({
                targetBudget: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Select
            id="barStyle"
            label="Bar Style"
            value={budget.barStyle}
            onChange={(e) => updateBudget({ barStyle: e.target.value as typeof budget.barStyle })}
            options={BAR_STYLES.map((v) => ({
              value: v,
              label: BAR_STYLE_LABELS[v],
            }))}
          />
          <Select
            id="rentalsLevel"
            label="Rentals Level"
            value={budget.rentalsLevel}
            onChange={(e) =>
              updateBudget({ rentalsLevel: e.target.value as typeof budget.rentalsLevel })
            }
            options={RENTAL_LEVELS.map((v) => ({
              value: v,
              label: RENTAL_LEVEL_LABELS[v],
            }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={budget.planner}
              onChange={(e) => updateBudget({ planner: e.target.checked })}
              className="rounded border-gray-300"
            />
            Hiring a Wedding Planner
          </label>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-4 rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900">Data Management</h2>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>
            Export JSON
          </Button>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Import JSON
            </Button>
          </div>
          <Button variant="secondary" onClick={handleLoadSeed}>
            Load Sample Data
          </Button>
        </div>

        {importError && (
          <p className="text-sm text-red-600">{importError}</p>
        )}
        {importSuccess && (
          <p className="text-sm text-green-600">Data imported successfully.</p>
        )}

        <p className="text-xs text-gray-400">
          {options.length} option{options.length !== 1 ? "s" : ""} stored locally
        </p>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 rounded-xl border border-red-200 p-6">
        <h2 className="text-base font-semibold text-red-700">Danger Zone</h2>
        <Button variant="danger" onClick={handleClearAll}>
          Delete All Data
        </Button>
        <p className="text-xs text-gray-500">
          This permanently removes all options, budget settings, and compare board data.
        </p>
      </section>
    </div>
  );
}
