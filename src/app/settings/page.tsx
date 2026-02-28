"use client";

import { useRef, useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useOptionStore } from "@/store/useOptionStore";
import { useCompareStore } from "@/store/useCompareStore";
import { BAR_STYLE_LABELS, RENTAL_LEVEL_LABELS, BAR_STYLES, RENTAL_LEVELS } from "@/lib/constants";
import { ExportBundleSchema, LegacyOptionSchema } from "@/lib/schemas";
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
      version: 2,
      exportedAt: new Date().toISOString(),
      options,
      budget,
      compare: board,
    };
    downloadJson(bundle, `wre-export-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const raw = JSON.parse(text);

      // Try parsing as v2 first
      const v2Result = ExportBundleSchema.safeParse(raw);
      if (v2Result.success) {
        await importOptions(v2Result.data.options);
        await updateBudget(v2Result.data.budget);
        for (const id of v2Result.data.compare.pinnedOptionIds) {
          await useCompareStore.getState().pinOption(id);
        }
        setImportSuccess(true);
      } else if (raw.version === 1) {
        // Legacy v1 import: rename island → location on each option
        const migratedOptions = (raw.options ?? []).map((opt: unknown) => {
          const legacyResult = LegacyOptionSchema.safeParse(opt);
          if (!legacyResult.success) return opt;
          const { island, ...rest } = legacyResult.data;
          return { ...rest, location: island ?? "" };
        });
        const migratedBundle = { ...raw, version: 2, options: migratedOptions };
        const result = ExportBundleSchema.safeParse(migratedBundle);
        if (!result.success) {
          setImportError("Legacy import failed: " + result.error.issues[0]?.message);
          return;
        }
        await importOptions(result.data.options);
        await updateBudget(result.data.budget);
        for (const id of result.data.compare.pinnedOptionIds) {
          await useCompareStore.getState().pinOption(id);
        }
        setImportSuccess(true);
      } else {
        setImportError("Invalid export file format: " + v2Result.error.issues[0]?.message);
      }
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
    <div className="mx-auto max-w-3xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your budgeting assumptions and data.</p>
      </div>

      {/* Budget Assumptions */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Budget Assumptions</h2>
          <p className="mt-1 text-sm text-slate-500">
            These defaults are used to calculate the "fit" and confidence warnings across options.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
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
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors sm:col-span-2">
            <input
              type="checkbox"
              checked={budget.planner}
              onChange={(e) => updateBudget({ planner: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Includes hiring a Wedding Planner
          </label>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Data Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Import existing data, export a backup, or load sample options.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-none justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Backup
          </Button>
          <div className="flex-1 sm:flex-none">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import Data
            </Button>
          </div>
          <Button variant="secondary" onClick={handleLoadSeed} className="flex-1 sm:flex-none justify-center bg-teal-50 text-teal-700 hover:bg-teal-100 border-transparent">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Load Sample Data
          </Button>
        </div>

        {importError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100 flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <span>{importError}</span>
          </div>
        )}
        {importSuccess && (
          <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-100 flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>Data imported successfully.</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-700">
            <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 rounded-full w-6 h-6 mr-2 text-xs">{options.length}</span>
            Option{options.length !== 1 ? "s" : ""} stored locally
          </p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 rounded-2xl border border-red-200 bg-red-50/30 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        <div>
          <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
          <p className="mt-1 text-sm text-red-600/80">
            This permanently removes all options, budget settings, and compare board data.
          </p>
        </div>
        <Button variant="danger" onClick={handleClearAll} className="w-full sm:w-auto mt-2">
          Delete All Data
        </Button>
      </section>
    </div>
  );
}
