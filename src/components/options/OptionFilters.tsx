"use client";

import { useOptionStore } from "@/store/useOptionStore";
import { OPTION_TYPES, ISLANDS, STATUSES, TRI_STATE, type OptionTypeKey, type StatusKey } from "@/lib/constants";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { SortField, SortDirection } from "@/lib/types";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "updatedAt:desc", label: "Recently Updated" },
  { value: "updatedAt:asc", label: "Oldest Updated" },
  { value: "costLow:asc", label: "Cost: Low to High" },
  { value: "costLow:desc", label: "Cost: High to Low" },
  { value: "photoRating:desc", label: "Photo Rating: High to Low" },
  { value: "name:asc", label: "Name: A-Z" },
];

export function OptionFilters() {
  const { filters, setFilter, resetFilters, setSort, sortField, sortDir } =
    useOptionStore();

  const currentSort = `${sortField}:${sortDir}`;

  return (
    <div className="space-y-3">
      {/* Search */}
      <Input
        placeholder="Search options..."
        value={filters.searchQuery}
        onChange={(e) => setFilter("searchQuery", e.target.value)}
        className="max-w-sm"
      />

      <div className="flex flex-wrap items-end gap-3">
        <Select
          id="filter-island"
          label="Island"
          placeholder="All Islands"
          value={filters.island ?? ""}
          onChange={(e) => setFilter("island", e.target.value || null)}
          options={ISLANDS.map((i) => ({ value: i, label: i }))}
        />

        <Select
          id="filter-type"
          label="Type"
          placeholder="All Types"
          value={filters.type ?? ""}
          onChange={(e) => setFilter("type", e.target.value || null)}
          options={Object.entries(OPTION_TYPES).map(([k, v]) => ({
            value: k,
            label: v,
          }))}
        />

        <Select
          id="filter-status"
          label="Status"
          placeholder="All Statuses"
          value={filters.status ?? ""}
          onChange={(e) => setFilter("status", e.target.value || null)}
          options={Object.entries(STATUSES).map(([k, v]) => ({
            value: k,
            label: v,
          }))}
        />

        <Select
          id="filter-reception"
          label="Reception On-Site"
          placeholder="Any"
          value={filters.receptionOnSite ?? ""}
          onChange={(e) => setFilter("receptionOnSite", e.target.value || null)}
          options={TRI_STATE.map((v) => ({
            value: v,
            label: v === "yes" ? "Yes" : v === "no" ? "No" : "Unknown",
          }))}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Capacity Fits
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.capacityMeetsGuests}
              onChange={(e) =>
                setFilter("capacityMeetsGuests", e.target.checked)
              }
              className="rounded border-gray-300"
            />
            Meets guest count
          </label>
        </div>

        <div className="w-32">
          <Input
            id="filter-cost-max"
            label="Max Cost"
            type="number"
            placeholder="$"
            value={filters.costMax ?? ""}
            onChange={(e) =>
              setFilter(
                "costMax",
                e.target.value ? Number(e.target.value) : null
              )
            }
          />
        </div>

        <Select
          id="sort"
          label="Sort"
          value={currentSort}
          onChange={(e) => {
            const [field, dir] = e.target.value.split(":") as [SortField, SortDirection];
            setSort(field, dir);
          }}
          options={SORT_OPTIONS}
        />

        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
