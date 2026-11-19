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
      "font-serif font-medium text-[length:var(--text-display)] leading-[1.02] tracking-[-0.015em] text-balance",
    h1: "font-serif font-medium text-[length:var(--text-h1)] leading-[1.05] tracking-[-0.01em] text-balance",
    h2: "font-serif font-medium text-[length:var(--text-h2)] leading-[1.1] tracking-[-0.005em] text-balance",
    h3: "font-serif font-semibold text-[length:var(--text-h3)] leading-[1.2] text-balance",
    h4: "font-sans font-semibold text-[length:var(--text-h4)] leading-[1.35] text-balance",
  };

  const defaultColor = level === "h4" ? "text-purple-900" : "text-purple-900";
  const colorStyles: Record<HeadingColor, string> = {
    white: "text-white",
    ink: "text-purple-900",
    gold: "text-gold-500",
  };

  const appliedColor = color ? colorStyles[color] : defaultColor;

  return (
    <Tag className={`${levelStyles[level]} ${appliedColor} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
