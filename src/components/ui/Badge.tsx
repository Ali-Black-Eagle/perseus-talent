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
    purple: "bg-[#F7F3FA] text-[#1C052E] border border-[#E6E0EB]",
    gold: "bg-[#F6EFE1] text-[#7A5A20] border border-[#C5A15B]/30",
    draft: "bg-[#FEF3F2] text-[#B42318] border border-[#B42318]/30 font-semibold uppercase tracking-wider",
    outline: "bg-transparent text-[#625A6B] border border-[#E6E0EB]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full select-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
