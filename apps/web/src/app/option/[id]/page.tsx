"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOptionStore, useBudgetStore, useCompareStore, OPTION_TYPES, formatCostRange, computeFitLabel, triStateLabel } from "@wedding/shared";
import type { OptionTypeKey, StatusKey, WeddingOption } from "@wedding/shared";
import { cn } from "@/lib/web-utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { OptionForm } from "@/components/options/OptionForm";
import { StatusBadge, RiskBadge, ConfidenceBadge, FitBadge } from "@/components/ui/SpecificBadges";
import { ImageGallery } from "@/components/options/ImageGallery";

export default function OptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const option = useOptionStore((s) => s.getOption(id));
  const removeOption = useOptionStore((s) => s.removeOption);
  const setStatus = useOptionStore((s) => s.setStatus);
  const budget = useBudgetStore((s) => s.budget);
  const { isPinned, pinOption, unpinOption, canPin } = useCompareStore();
  const [editOpen, setEditOpen] = useState(false);

  if (!option) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Option not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/")}>
          Back to list
        </Button>
      </div>
    );
  }

  const fit = computeFitLabel(option, budget);
  const pinned = isPinned(option.id);

  // Derive a fit score just for the badge
  const fitScoreMap: Record<typeof fit, number> = {
    under: 95,
    within: 75,
    over: 40,
    unknown: 0
  };

  const handleDelete = async () => {
    if (!confirm("Delete this option?")) return;
    await removeOption(option.id);
    router.push("/");
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Back + Actions */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          &larr; Back
        </Button>
        <div className="flex-1" />
        <Button
          variant={pinned ? "primary" : "outline"}
          size="sm"
          onClick={() => (pinned ? unpinOption(option.id) : pinOption(option.id))}
          disabled={!pinned && !canPin()}
        >
          {pinned ? "Unpin from Compare" : "Pin to Compare"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{option.name}</h1>
          <StatusBadge status={option.status} />
          {fit !== "unknown" && <FitBadge score={fitScoreMap[fit]} />}
        </div>
        <p className="mt-2 text-base text-slate-500">
          {OPTION_TYPES[option.type as OptionTypeKey]}{option.location ? ` · ${option.location}` : ""}{option.area ? `, ${option.area}` : ""}
        </p>
      </div>

      {/* Status quick-change */}
      <div className="flex gap-2">
        {((["RESEARCHING", "SHORTLISTED", "FINALIST", "ELIMINATED"] as const)).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatus(option.id, s)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors border",
                option.status === s
                  ? "bg-slate-900 text-white border-transparent"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
              )}
            >
              Mark {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
            </button>
          )
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Images & Main Content */}
        <div className="lg:col-span-2 space-y-8">

          <ImageGallery images={option.images} title={option.name} />

          {/* Notes */}
          {option.notes && (
            <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Overall Notes</h3>
              <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                {option.notes}
              </p>
            </div>
          )}

          {/* Pros / Cons */}
          <div className="grid gap-6 sm:grid-cols-2">
            {option.pros.length > 0 && (
              <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-5">
                <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Pros
                </h3>
                <ul className="space-y-2">
                  {option.pros.map((p, i) => (
                    <li key={i} className="text-sm text-emerald-900 flex items-start">
                      <span className="mr-2 mt-0.5 text-emerald-500 text-xs">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {option.cons.length > 0 && (
              <div className="rounded-xl bg-red-50/50 border border-red-100 p-5">
                <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  Cons
                </h3>
                <ul className="space-y-2">
                  {option.cons.map((c, i) => (
                    <li key={i} className="text-sm text-red-900 flex items-start">
                      <span className="mr-2 mt-0.5 text-red-500 text-xs">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Questions */}
          {option.questionsToAsk.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Questions to Ask</h3>
              <ul className="space-y-3">
                {option.questionsToAsk.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Details sidebar */}
        <div className="space-y-5">
          {/* Cost */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">Estimated Cost</h3>
            <p className="text-2xl font-bold text-slate-900 mb-2">
              {formatCostRange(option)}
            </p>
            <div className="mb-3">
              <ConfidenceBadge level={option.costConfidence} />
            </div>
            {option.costNotes && (
              <p className="text-sm text-slate-600 border-t border-slate-100 pt-3">{option.costNotes}</p>
            )}
          </div>

          {/* Capacity */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Capacity</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Seated</span>
                <span className="font-medium">{option.guestCapacitySeated ?? "Not specified"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Standing</span>
                <span className="font-medium">{option.guestCapacityStanding ?? "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Feasibility */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Feasibility</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ceremony On-Site</span>
                <span className="font-medium">{triStateLabel(option.ceremonyOnSite)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Reception On-Site</span>
                <span className="font-medium">{triStateLabel(option.receptionOnSite)}</span>
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Logistics</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Curfew</span>
                <span className="font-medium">{option.curfewTime ?? "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Noise Risk</span>
                <RiskBadge level={option.noiseRisk} />
              </div>
              {option.parkingNotes && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-slate-500 block mb-1">Parking</span>
                  <span className="font-medium text-slate-900">{option.parkingNotes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Photo Rating */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Aesthetics</h3>
            <Rating
              label="Photo / Visibility Rating"
              value={option.photoRating}
              size="md"
            />
          </div>

          {/* Address / Map */}
          {(option.addressText || option.mapsUrl) && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Location</h3>
              {option.addressText && (
                <p className="text-sm text-slate-700 mb-3">{option.addressText}</p>
              )}
              {option.mapsUrl && (
                <a
                  href={option.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  View on Map
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              )}
            </div>
          )}

          {/* Source Links */}
          {option.sourceLinks.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Source Links</h3>
              <ul className="space-y-2">
                {option.sourceLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm text-blue-600 hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {option.tags.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {option.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-slate-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <OptionForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editOption={option}
      />
    </div>
  );
}
