"use client";

import Link from "next/link";
import { useOptionStore } from "@/store/useOptionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useCompareStore } from "@/store/useCompareStore";
import { OPTION_TYPES, NOISE_COLORS, type OptionTypeKey, type NoiseLevel } from "@/lib/constants";
import {
  formatCostRange,
  computeFitLabel,
  FIT_BADGE_STYLES,
  FIT_BADGE_TEXT,
  triStateLabel,
  triStateIcon,
  cn,
  formatCurrency,
  capacityMeetsGuests,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import type { WeddingOption } from "@/lib/types";

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `repeat(var(--cols), 1fr)` }}>
        {children}
      </div>
    </>
  );
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-r border-gray-100 px-4 py-3 text-sm last:border-r-0", className)}>
      {children}
    </div>
  );
}

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
        <h1 className="text-xl font-bold text-gray-900">Compare Board</h1>
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-sm text-gray-500">
            No options pinned. Go to the{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              options list
            </Link>{" "}
            and pin 2–4 options to compare.
          </p>
        </div>
      </div>
    );
  }

  const cols = pinnedOptions.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Compare Board ({cols})
        </h1>
        <Button variant="ghost" size="sm" onClick={clearBoard}>
          Clear Board
        </Button>
      </div>

      {budget.targetBudget && (
        <p className="text-sm text-gray-500">
          Target budget: {formatCurrency(budget.targetBudget)} &middot; {budget.guestCount} guests
        </p>
      )}

      <div
        className="overflow-x-auto rounded-xl border border-gray-200 bg-white"
        style={{ ["--cols" as string]: cols }}
      >
        {/* Hero images */}
        <CompareRow label="Photo">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              {opt.images[0] ? (
                <img
                  src={opt.images[0].url}
                  alt={opt.name}
                  className="aspect-[16/10] w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                  No image
                </div>
              )}
            </Cell>
          ))}
        </CompareRow>

        {/* Name + Type */}
        <CompareRow label="Venue">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              <Link
                href={`/option/${opt.id}`}
                className="font-semibold text-gray-900 hover:underline"
              >
                {opt.name}
              </Link>
              <p className="text-xs text-gray-500">
                {OPTION_TYPES[opt.type as OptionTypeKey]}
              </p>
              <p className="text-xs text-gray-500">
                {opt.island}{opt.area ? `, ${opt.area}` : ""}
              </p>
              <button
                onClick={() => unpinOption(opt.id)}
                className="mt-1 text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </Cell>
          ))}
        </CompareRow>

        {/* Cost */}
        <CompareRow label="Cost">
          {pinnedOptions.map((opt) => {
            const fit = computeFitLabel(opt, budget);
            return (
              <Cell key={opt.id}>
                <p className="font-semibold">{formatCostRange(opt)}</p>
                <p className="text-xs text-gray-500">
                  Confidence: {opt.costConfidence}
                </p>
                <Badge className={cn("mt-1", FIT_BADGE_STYLES[fit])}>
                  {FIT_BADGE_TEXT[fit]}
                </Badge>
              </Cell>
            );
          })}
        </CompareRow>

        {/* Capacity */}
        <CompareRow label="Capacity">
          {pinnedOptions.map((opt) => {
            const fits = capacityMeetsGuests(opt, budget.guestCount);
            return (
              <Cell key={opt.id}>
                {opt.guestCapacitySeated != null && (
                  <p>Seated: {opt.guestCapacitySeated}</p>
                )}
                {opt.guestCapacityStanding != null && (
                  <p>Standing: {opt.guestCapacityStanding}</p>
                )}
                {opt.guestCapacitySeated == null &&
                  opt.guestCapacityStanding == null && (
                    <p className="text-gray-400">Unknown</p>
                  )}
                {fits !== null && (
                  <p className={cn("text-xs mt-1", fits ? "text-green-600" : "text-red-600")}>
                    {fits ? `Fits ${budget.guestCount} guests` : `May not fit ${budget.guestCount}`}
                  </p>
                )}
              </Cell>
            );
          })}
        </CompareRow>

        {/* Ceremony / Reception */}
        <CompareRow label="Ceremony & Reception">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              <p>
                Ceremony: {triStateIcon(opt.ceremonyOnSite)}{" "}
                {triStateLabel(opt.ceremonyOnSite)}
              </p>
              <p>
                Reception: {triStateIcon(opt.receptionOnSite)}{" "}
                {triStateLabel(opt.receptionOnSite)}
              </p>
            </Cell>
          ))}
        </CompareRow>

        {/* Curfew / Noise / Parking */}
        <CompareRow label="Logistics">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              <p>Curfew: {opt.curfewTime || "N/A"}</p>
              <p>
                Noise:{" "}
                <span className={NOISE_COLORS[opt.noiseRisk as NoiseLevel]}>
                  {opt.noiseRisk}
                </span>
              </p>
              <p>Parking: {opt.parkingNotes || "N/A"}</p>
            </Cell>
          ))}
        </CompareRow>

        {/* Photo Rating */}
        <CompareRow label="Photo Potential">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              <Rating value={opt.photoRating} size="sm" />
            </Cell>
          ))}
        </CompareRow>

        {/* Pros */}
        <CompareRow label="Pros">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              {opt.pros.length > 0 ? (
                <ul className="space-y-0.5">
                  {opt.pros.map((p, i) => (
                    <li key={i} className="text-xs text-green-700">+ {p}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-400">None listed</span>
              )}
            </Cell>
          ))}
        </CompareRow>

        {/* Cons */}
        <CompareRow label="Cons">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              {opt.cons.length > 0 ? (
                <ul className="space-y-0.5">
                  {opt.cons.map((c, i) => (
                    <li key={i} className="text-xs text-red-700">- {c}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-400">None listed</span>
              )}
            </Cell>
          ))}
        </CompareRow>

        {/* Questions */}
        <CompareRow label="Questions">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              {opt.questionsToAsk.length > 0 ? (
                <ul className="space-y-0.5">
                  {opt.questionsToAsk.map((q, i) => (
                    <li key={i} className="flex items-start gap-1 text-xs">
                      <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                      {q}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-400">None</span>
              )}
            </Cell>
          ))}
        </CompareRow>

        {/* Links */}
        <CompareRow label="Links">
          {pinnedOptions.map((opt) => (
            <Cell key={opt.id}>
              {opt.sourceLinks.length > 0 ? (
                <ul className="space-y-0.5">
                  {opt.sourceLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs text-blue-600 hover:underline"
                      >
                        {new URL(link).hostname}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-400">None</span>
              )}
            </Cell>
          ))}
        </CompareRow>
      </div>
    </div>
  );
}
