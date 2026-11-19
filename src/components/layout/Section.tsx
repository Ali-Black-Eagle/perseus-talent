import React from "react";

export type SectionBackground = "purple" | "white" | "ivory" | "purple-50";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  bg?: SectionBackground;
  goldBorderBottom?: boolean;
  children: React.ReactNode;
}

export function Section({
  bg = "white",
  goldBorderBottom = false,
  className = "",
  children,
  ...props
}: SectionProps) {
  const bgStyles: Record<SectionBackground, string> = {
    purple: "bg-purple-900 text-white",
    white: "bg-white text-body",
    ivory: "bg-ivory text-body",
    "purple-50": "bg-purple-50 text-body",
  };

  return (
    <section
      className={`relative py-16 md:py-24 xl:py-32 ${bgStyles[bg]} ${
        goldBorderBottom ? "border-b border-gold-500/30" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
