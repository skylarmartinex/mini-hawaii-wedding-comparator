"use client";

import Link from "next/link";
import { OPTION_TYPES, formatCostRange, computeFitLabel, triStateLabel, triStateIcon, capacityMeetsGuests } from "@wedding/shared";
import type { OptionTypeKey, NoiseLevel, WeddingOption, BudgetAssumptions } from "@wedding/shared";
import { cn } from "@/lib/web-utils";
import { Rating } from "@/components/ui/Rating";
import { StatusBadge, RiskBadge, FitBadge, ConfidenceBadge } from "@/components/ui/SpecificBadges";

interface CompareTableProps {
    options: WeddingOption[];
    budget: BudgetAssumptions;
    onRemove: (id: string) => void;
}

export function CompareTable({ options, budget, onRemove }: CompareTableProps) {
    const cols = options.length;

    if (cols === 0) return null;

    // Render a CSS grid where the first column is the sticky label column (hidden on mobile if we prefer, but let's make it visible and sticky).
    // Actually, standardizing on a grid with (cols + 1) columns is easiest.

    return (
        <div className="relative overflow-x-auto overflow-y-hidden rounded-xl border border-slate-200 bg-white shadow-sm custom-scrollbar">
            <div
                className="min-w-max grid"
                style={{ gridTemplateColumns: `minmax(180px, 200px) repeat(${cols}, minmax(280px, 1fr))` }}
            >

                {/* Row 1: Headers (Sticky Top) */}
                <div className="sticky top-0 left-0 z-20 bg-slate-50 border-b border-r border-slate-200 p-4 font-semibold text-slate-700 shadow-[1px_1px_0_0_#e2e8f0]">
                    Compare Options
                </div>

                {options.map((opt) => (
                    <div key={`header-${opt.id}`} className="sticky top-0 z-10 bg-slate-50 border-b border-r border-slate-200 p-4 last:border-r-0 shadow-[0_1px_0_0_#e2e8f0]">
                        <div className="flex justify-between items-start gap-2 mb-2">
                            <Link
                                href={`/option/${opt.id}`}
                                className="font-bold text-lg text-slate-900 hover:text-teal-600 transition-colors line-clamp-2"
                            >
                                {opt.name}
                            </Link>
                            <button
                                onClick={() => onRemove(opt.id)}
                                className="shrink-0 text-slate-400 hover:text-red-600 transition-colors bg-white rounded-full p-1 border border-slate-200 hover:border-red-200"
                                title="Remove from comparison"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <StatusBadge status={opt.status} />
                            {opt.photoRating != null && <Rating value={opt.photoRating} size="sm" />}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                            {OPTION_TYPES[opt.type as OptionTypeKey]}{opt.location ? ` · ${opt.location}` : ""}
                        </p>
                    </div>
                ))}

                {/* Row 2: Photo */}
                <RowLabel>Photo</RowLabel>
                {options.map((opt) => (
                    <Cell key={`photo-${opt.id}`}>
                        {opt.images[0] ? (
                            <img
                                src={opt.images[0].url}
                                alt={opt.name}
                                className="aspect-[16/10] w-full rounded-lg object-cover"
                            />
                        ) : (
                            <div className="flex aspect-[16/10] items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                                No image
                            </div>
                        )}
                    </Cell>
                ))}

                {/* Row 3: Cost */}
                <RowLabel>Cost</RowLabel>
                {options.map((opt) => {
                    const fit = computeFitLabel(opt, budget);
                    const fitScoreMap: Record<typeof fit, number> = {
                        under: 95,
                        within: 75,
                        over: 40,
                        unknown: 0
                    };
                    return (
                        <Cell key={`cost-${opt.id}`}>
                            <p className="font-bold text-lg text-slate-900">{formatCostRange(opt)}</p>
                            <div className="mt-2 space-y-2">
                                <div><ConfidenceBadge level={opt.costConfidence} /></div>
                                {fit !== "unknown" && <div><FitBadge score={fitScoreMap[fit]} /></div>}
                            </div>
                        </Cell>
                    );
                })}

                {/* Row 4: Capacity */}
                <RowLabel>Capacity</RowLabel>
                {options.map((opt) => {
                    const fits = capacityMeetsGuests(opt, budget.guestCount);
                    return (
                        <Cell key={`cap-${opt.id}`}>
                            <div className="space-y-1 text-sm text-slate-700">
                                {opt.guestCapacitySeated != null && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Seated</span>
                                        <span className="font-medium">{opt.guestCapacitySeated}</span>
                                    </div>
                                )}
                                {opt.guestCapacityStanding != null && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Standing</span>
                                        <span className="font-medium">{opt.guestCapacityStanding}</span>
                                    </div>
                                )}
                                {opt.guestCapacitySeated == null && opt.guestCapacityStanding == null && (
                                    <p className="text-slate-500 italic">Unknown</p>
                                )}
                            </div>
                            {fits !== null && (
                                <div className={cn("mt-3 text-xs font-medium px-2 py-1 rounded bg-slate-50 inline-block", fits ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50")}>
                                    {fits ? `✓ Fits ${budget.guestCount}` : `✗ May not fit ${budget.guestCount}`}
                                </div>
                            )}
                        </Cell>
                    );
                })}

                {/* Row 5: Logistics */}
                <RowLabel>Logistics</RowLabel>
                {options.map((opt) => (
                    <Cell key={`logistics-${opt.id}`}>
                        <div className="space-y-3 text-sm text-slate-700">
                            <div>
                                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Ceremony</span>
                                <span className="flex items-center gap-1 font-medium text-slate-900">
                                    {triStateIcon(opt.ceremonyOnSite)} {triStateLabel(opt.ceremonyOnSite)}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Reception</span>
                                <span className="flex items-center gap-1 font-medium text-slate-900">
                                    {triStateIcon(opt.receptionOnSite)} {triStateLabel(opt.receptionOnSite)}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Noise Risk</span>
                                <RiskBadge level={opt.noiseRisk} />
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Curfew</span>
                                <span className="font-medium text-slate-900">{opt.curfewTime || "N/A"}</span>
                            </div>
                        </div>
                    </Cell>
                ))}

                {/* Row 6: Pros and Cons */}
                <RowLabel>Pros & Cons</RowLabel>
                {options.map((opt) => (
                    <Cell key={`proscons-${opt.id}`} className="align-top">
                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Pros</span>
                                {opt.pros.length > 0 ? (
                                    <ul className="space-y-1">
                                        {opt.pros.map((p, i) => (
                                            <li key={i} className="text-sm text-slate-700 flex items-start">
                                                <span className="text-emerald-500 mr-1.5 leading-tight">+</span>
                                                <span className="leading-tight">{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <span className="text-xs text-slate-400 italic">None listed</span>}
                            </div>
                            <div className="pt-3 border-t border-slate-100">
                                <span className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Cons</span>
                                {opt.cons.length > 0 ? (
                                    <ul className="space-y-1">
                                        {opt.cons.map((c, i) => (
                                            <li key={i} className="text-sm text-slate-700 flex items-start">
                                                <span className="text-red-500 mr-1.5 leading-tight">-</span>
                                                <span className="leading-tight">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <span className="text-xs text-slate-400 italic">None listed</span>}
                            </div>
                        </div>
                    </Cell>
                ))}
            </div>
        </div>
    );
}

function RowLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="sticky left-0 z-10 bg-slate-50 border-b border-r border-slate-200 p-4 font-semibold text-slate-700 flex items-center shadow-[1px_0_0_0_#e2e8f0]">
            {children}
        </div>
    );
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("border-b border-r border-slate-200 bg-white p-5 last:border-r-0 hover:bg-slate-50/50 transition-colors", className)}>
            {children}
        </div>
    );
}
