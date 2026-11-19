import React from "react";

export type BadgeVariant = "purple" | "gold" | "draft" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "purple",
  children,
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    purple: "bg-purple-50 text-purple-900 border border-line",
    gold: "bg-gold-100 text-gold-text border border-gold-500/30",
    draft: "bg-error-bg text-error border border-error/30 font-semibold uppercase tracking-wider",
    outline: "bg-transparent text-muted border border-line",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full select-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
