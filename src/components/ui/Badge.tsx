"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "info" | "neutral" | "accent";
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
    outline: "border border-slate-300 text-slate-700",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    neutral: "bg-slate-100 text-slate-700",
    accent: "bg-teal-100 text-teal-800",
  };

  const Component = onClick ? "button" : "span";
  return (
    <Component
      className={cn(base, variants[variant], onClick && "cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-teal-500", className)}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {children}
    </Component>
  );
}
