"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OptionImage } from "@/lib/types";

interface ImageGalleryProps {
    images: OptionImage[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                No images added yet
            </div>
        );
    }

    const actImage = images[selectedImage];

    return (
        <div className="space-y-4">
            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                <img
                    src={actImage?.url}
                    alt={actImage?.caption ?? title}
                    className="h-full w-full object-cover transition-opacity duration-300"
                />
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setSelectedImage(i)}
                            className={cn(
                                "h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                                i === selectedImage
                                    ? "border-teal-600 ring-2 ring-teal-600/20 ring-offset-1"
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

            {actImage?.caption && (
                <p className="text-sm text-slate-500 italic text-center">
                    {actImage.caption}
                </p>
            )}
        </div>
    );
}
