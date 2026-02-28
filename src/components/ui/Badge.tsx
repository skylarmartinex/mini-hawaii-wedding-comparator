"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
  onClick?: () => void;
}

export function Badge({
  children,
  className,
  variant = "default",
  onClick,
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors";
  const variants = {
    default: "bg-gray-100 text-gray-700",
    outline: "border border-gray-300 text-gray-700",
  };

  const Component = onClick ? "button" : "span";
  return (
    <Component
      className={cn(base, variants[variant], onClick && "cursor-pointer hover:opacity-80", className)}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {children}
    </Component>
  );
}
