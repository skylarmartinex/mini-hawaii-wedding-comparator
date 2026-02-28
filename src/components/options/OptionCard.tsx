"use client";

import Link from "next/link";
import type { WeddingOption } from "@/lib/types";
import { OPTION_TYPES, STATUS_COLORS, type OptionTypeKey, type StatusKey } from "@/lib/constants";
import { formatCostRange, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { useCompareStore } from "@/store/useCompareStore";

interface OptionCardProps {
  option: WeddingOption;
}

export function OptionCard({ option }: OptionCardProps) {
  const { isPinned, pinOption, unpinOption, canPin } = useCompareStore();
  const pinned = isPinned(option.id);

  const heroImage = option.images[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Image area */}
      <Link href={`/option/${option.id}`} className="block">
        <div className="relative aspect-[16/10] bg-gray-100">
          {heroImage ? (
            <img
              src={heroImage.url}
              alt={heroImage.caption ?? option.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Status badge */}
          <Badge
            className={cn(
              "absolute left-2 top-2",
              STATUS_COLORS[option.status as StatusKey]
            )}
          >
            {option.status}
          </Badge>
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/option/${option.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 hover:underline">
            {option.name}
          </h3>
        </Link>

        <p className="mt-0.5 text-xs text-gray-500">
          {OPTION_TYPES[option.type as OptionTypeKey]} &middot; {option.island}
          {option.area ? `, ${option.area}` : ""}
        </p>

        {/* Cost */}
        <p className="mt-2 text-sm font-medium text-gray-900">
          {formatCostRange(option)}
        </p>

        {/* Capacity */}
        <div className="mt-1 flex gap-3 text-xs text-gray-500">
          {option.guestCapacitySeated != null && (
            <span>Seated: {option.guestCapacitySeated}</span>
          )}
          {option.guestCapacityStanding != null && (
            <span>Standing: {option.guestCapacityStanding}</span>
          )}
        </div>

        {/* Photo rating */}
        {option.photoRating != null && (
          <div className="mt-2">
            <Rating value={option.photoRating} size="sm" />
          </div>
        )}

        {/* Tags */}
        {option.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
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

        {/* Compare pin */}
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => (pinned ? unpinOption(option.id) : pinOption(option.id))}
            disabled={!pinned && !canPin()}
            className={cn(
              "w-full rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              pinned
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50",
              !pinned && !canPin() && "cursor-not-allowed opacity-40"
            )}
          >
            {pinned ? "Unpin from Compare" : "Pin to Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}
