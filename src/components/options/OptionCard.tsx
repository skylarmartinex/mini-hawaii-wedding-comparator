"use client";

import Link from "next/link";
import type { WeddingOption } from "@/lib/types";
import { OPTION_TYPES, type OptionTypeKey } from "@/lib/constants";
import { formatCostRange, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { StatusBadge } from "@/components/ui/SpecificBadges";
import { useCompareStore } from "@/store/useCompareStore";
import { useOptionStore } from "@/store/useOptionStore";

interface OptionCardProps {
  option: WeddingOption;
  viewMode?: "grid" | "table";
  onEdit?: () => void;
}

export function OptionCard({ option, viewMode = "grid", onEdit }: OptionCardProps) {
  const { isPinned, pinOption, unpinOption, canPin } = useCompareStore();
  const { updateOption } = useOptionStore();
  const pinned = isPinned(option.id);

  const heroImage = option.images[0];

  const cycleStatus = () => {
    const statuses: Array<keyof typeof import("@/lib/constants").STATUSES> = ["RESEARCHING", "SHORTLISTED", "FINALIST", "ELIMINATED"];
    const currentIdx = statuses.indexOf(option.status as any);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    updateOption(option.id, { status: nextStatus });
  };

  if (viewMode === "table") {
    return (
      <div className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md">
        <Link href={`/option/${option.id}`} className="shrink-0">
          <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-slate-100">
            {heroImage ? (
              <img
                src={heroImage.url}
                alt={heroImage.caption ?? option.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link href={`/option/${option.id}`}>
              <h3 className="truncate text-sm font-semibold text-slate-900 xl:text-base hover:underline">
                {option.name}
              </h3>
            </Link>
            <p className="truncate text-xs text-slate-500">
              {OPTION_TYPES[option.type as OptionTypeKey]}{option.location ? ` · ${option.location}` : ""}
            </p>
          </div>
          <div className="hidden shrink-0 flex-col items-end md:flex">
            <p className="text-sm font-medium text-slate-900">{formatCostRange(option)}</p>
            {option.photoRating != null && <Rating value={option.photoRating} size="sm" />}
          </div>
          <div className="shrink-0 cursor-pointer" onClick={cycleStatus}>
            <StatusBadge status={option.status} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => (pinned ? unpinOption(option.id) : pinOption(option.id))}
              disabled={!pinned && !canPin()}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                pinned
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                !pinned && !canPin() && "cursor-not-allowed opacity-40"
              )}
              title={pinned ? "Unpin" : "Pin to compare"}
            >
              <svg className="h-4 w-4" fill={pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-md p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Edit Option"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      {/* Image area */}
      <Link href={`/option/${option.id}`} className="block">
        <div className="relative aspect-[16/10] bg-slate-100">
          {heroImage ? (
            <img
              src={heroImage.url}
              alt={heroImage.caption ?? option.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Status badge */}
          <div className="absolute left-2 top-2 cursor-pointer" onClick={(e) => { e.preventDefault(); cycleStatus(); }}>
            <StatusBadge status={option.status} />
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/option/${option.id}`}>
          <h3 className="text-base font-semibold text-slate-900 xl:text-lg hover:underline line-clamp-1">
            {option.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
          {OPTION_TYPES[option.type as OptionTypeKey]}{option.location ? ` · ${option.location}` : ""}{option.area ? `, ${option.area}` : ""}
        </p>

        {/* Cost */}
        <p className="mt-3 text-sm font-medium text-slate-900">
          {formatCostRange(option)}
        </p>

        {/* Capacity */}
        <div className="mt-1 flex gap-3 text-xs text-slate-500">
          {option.guestCapacitySeated != null && (
            <span>Seated: {option.guestCapacitySeated}</span>
          )}
          {option.guestCapacityStanding != null && (
            <span>Standing: {option.guestCapacityStanding}</span>
          )}
        </div>

        {/* Photo rating */}
        {option.photoRating != null && (
          <div className="mt-3">
            <Rating value={option.photoRating} size="sm" />
          </div>
        )}

        {/* Tags */}
        {option.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {option.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
            {option.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{option.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => (pinned ? unpinOption(option.id) : pinOption(option.id))}
            disabled={!pinned && !canPin()}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
              pinned
                ? "bg-slate-900 text-white border-transparent hover:bg-slate-800"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
              !pinned && !canPin() && "cursor-not-allowed opacity-40"
            )}
          >
            {pinned ? "Unpin" : "Pin"}
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
