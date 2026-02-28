"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOptionStore } from "@/store/useOptionStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useCompareStore } from "@/store/useCompareStore";
import { OPTION_TYPES, STATUS_COLORS, NOISE_COLORS, type OptionTypeKey, type StatusKey, type NoiseLevel } from "@/lib/constants";
import {
  formatCostRange,
  computeFitLabel,
  FIT_BADGE_STYLES,
  FIT_BADGE_TEXT,
  triStateLabel,
  cn,
} from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { OptionForm } from "@/components/options/OptionForm";

export default function OptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const option = useOptionStore((s) => s.getOption(id));
  const removeOption = useOptionStore((s) => s.removeOption);
  const setStatus = useOptionStore((s) => s.setStatus);
  const budget = useBudgetStore((s) => s.budget);
  const { isPinned, pinOption, unpinOption, canPin } = useCompareStore();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!option) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Option not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/")}>
          Back to list
        </Button>
      </div>
    );
  }

  const fit = computeFitLabel(option, budget);
  const pinned = isPinned(option.id);

  const handleDelete = async () => {
    if (!confirm("Delete this option?")) return;
    await removeOption(option.id);
    router.push("/");
  };

  return (
    <div className="space-y-8">
      {/* Back + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          &larr; Back
        </Button>
        <div className="flex-1" />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => (pinned ? unpinOption(option.id) : pinOption(option.id))}
          disabled={!pinned && !canPin()}
        >
          {pinned ? "Unpin from Compare" : "Pin to Compare"}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{option.name}</h1>
          <Badge className={STATUS_COLORS[option.status as StatusKey]}>
            {option.status}
          </Badge>
          <Badge className={FIT_BADGE_STYLES[fit]}>{FIT_BADGE_TEXT[fit]}</Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {OPTION_TYPES[option.type as OptionTypeKey]} &middot; {option.island}
          {option.area ? `, ${option.area}` : ""}
        </p>
      </div>

      {/* Status quick-change */}
      <div className="flex gap-2">
        {(["RESEARCHING", "SHORTLISTED", "FINALIST", "ELIMINATED"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatus(option.id, s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                option.status === s
                  ? STATUS_COLORS[s]
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              )}
            >
              {s}
            </button>
          )
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Images */}
        <div className="lg:col-span-2 space-y-4">
          {option.images.length > 0 ? (
            <>
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={option.images[selectedImage]?.url}
                  alt={option.images[selectedImage]?.caption ?? option.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {option.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {option.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                        i === selectedImage
                          ? "border-gray-900"
                          : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      <img
                        src={img.url}
                        alt={img.caption ?? ""}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              No images added yet
            </div>
          )}

          {/* Notes */}
          {option.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                {option.notes}
              </p>
            </div>
          )}

          {/* Pros / Cons */}
          <div className="grid gap-4 sm:grid-cols-2">
            {option.pros.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-700">Pros</h3>
                <ul className="mt-1 space-y-1">
                  {option.pros.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      <span className="text-green-600">+</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {option.cons.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-700">Cons</h3>
                <ul className="mt-1 space-y-1">
                  {option.cons.map((c, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      <span className="text-red-600">-</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Questions */}
          {option.questionsToAsk.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Questions to Ask</h3>
              <ul className="mt-1 space-y-1">
                {option.questionsToAsk.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Details sidebar */}
        <div className="space-y-6">
          {/* Cost */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Cost</h3>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {formatCostRange(option)}
            </p>
            <p className="text-xs text-gray-500">
              Confidence: {option.costConfidence}
            </p>
            {option.costNotes && (
              <p className="mt-2 text-xs text-gray-600">{option.costNotes}</p>
            )}
          </div>

          {/* Capacity */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Capacity</h3>
            <div className="mt-1 space-y-1 text-sm text-gray-700">
              {option.guestCapacitySeated != null && (
                <p>Seated: {option.guestCapacitySeated}</p>
              )}
              {option.guestCapacityStanding != null && (
                <p>Standing: {option.guestCapacityStanding}</p>
              )}
              {option.guestCapacitySeated == null &&
                option.guestCapacityStanding == null && (
                  <p className="text-gray-400">Not specified</p>
                )}
            </div>
          </div>

          {/* Ceremony / Reception */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Feasibility</h3>
            <div className="mt-1 space-y-1 text-sm text-gray-700">
              <p>Ceremony on-site: {triStateLabel(option.ceremonyOnSite)}</p>
              <p>Reception on-site: {triStateLabel(option.receptionOnSite)}</p>
            </div>
          </div>

          {/* Logistics */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Logistics</h3>
            <div className="mt-1 space-y-1 text-sm text-gray-700">
              {option.curfewTime && <p>Curfew: {option.curfewTime}</p>}
              <p>
                Noise risk:{" "}
                <span className={NOISE_COLORS[option.noiseRisk as NoiseLevel]}>
                  {option.noiseRisk}
                </span>
              </p>
              {option.parkingNotes && <p>Parking: {option.parkingNotes}</p>}
            </div>
          </div>

          {/* Photo Rating */}
          <div className="rounded-xl border border-gray-200 p-4">
            <Rating
              label="Photo / Visibility Rating"
              value={option.photoRating}
              size="md"
            />
          </div>

          {/* Address / Map */}
          {(option.addressText || option.mapsUrl) && (
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900">Location</h3>
              {option.addressText && (
                <p className="mt-1 text-sm text-gray-700">{option.addressText}</p>
              )}
              {option.mapsUrl && (
                <a
                  href={option.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                >
                  View on Map &rarr;
                </a>
              )}
            </div>
          )}

          {/* Source Links */}
          {option.sourceLinks.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900">Links</h3>
              <ul className="mt-1 space-y-1">
                {option.sourceLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-blue-600 hover:underline"
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
            <div className="flex flex-wrap gap-1">
              {option.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
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
