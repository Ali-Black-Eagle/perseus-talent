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
    purple: "bg-[#1C052E] text-white",
    white: "bg-white text-[#3A3242]",
    ivory: "bg-[#FBF9F6] text-[#3A3242]",
    "purple-50": "bg-[#F7F3FA] text-[#3A3242]",
  };

  return (
    <section
      className={`relative py-16 md:py-24 xl:py-32 ${bgStyles[bg]} ${
        goldBorderBottom ? "border-b border-[#C5A15B]/30" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
