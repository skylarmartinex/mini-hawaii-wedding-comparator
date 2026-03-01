"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/web-utils";
import { useCompareStore } from "@wedding/shared";

const NAV_ITEMS = [
  { href: "/", label: "Options" },
  { href: "/compare", label: "Compare" },
  { href: "/settings", label: "Settings" },
];

export function Header() {
  const pathname = usePathname();
  const pinnedCount = useCompareStore((s) => s.board.pinnedOptionIds.length);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-gray-900"
        >
          Wedding Research Engine
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/option")
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {label}
                {href === "/compare" && pinnedCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                    {pinnedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
