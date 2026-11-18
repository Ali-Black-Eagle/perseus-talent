import React from "react";

export type HeadingLevel = "display" | "h1" | "h2" | "h3" | "h4";
export type HeadingColor = "white" | "ink" | "gold";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  color?: HeadingColor;
  children: React.ReactNode;
}

export function Heading({
  level = "h2",
  as,
  color,
  children,
  className = "",
  ...props
}: HeadingProps) {
  const Tag = as || (level === "display" ? "h1" : level);

  const levelStyles: Record<HeadingLevel, string> = {
    display:
      "font-serif font-medium text-[44px] md:text-[64px] lg:text-[88px] leading-[1.02] tracking-[-0.015em] text-balance",
    h1: "font-serif font-medium text-[38px] md:text-[52px] lg:text-[68px] leading-[1.05] tracking-[-0.01em] text-balance",
    h2: "font-serif font-medium text-[30px] md:text-[38px] lg:text-[48px] leading-[1.1] tracking-[-0.005em] text-balance",
    h3: "font-serif font-semibold text-[22px] md:text-[26px] lg:text-[30px] leading-[1.2]",
    h4: "font-sans font-semibold text-[18px] md:text-[20px] leading-[1.35]",
  };

  const defaultColor = level === "h4" ? "text-[#1C052E]" : "text-[#1C052E]";
  const colorStyles: Record<HeadingColor, string> = {
    white: "text-white",
    ink: "text-[#1C052E]",
    gold: "text-[#C5A15B]",
  };

  const appliedColor = color ? colorStyles[color] : defaultColor;

  return (
    <Tag className={`${levelStyles[level]} ${appliedColor} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
