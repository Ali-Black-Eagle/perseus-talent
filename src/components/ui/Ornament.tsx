import React from "react";
import { EightPointStar } from "@/components/brand/EightPointStar";

interface OrnamentProps {
  className?: string;
  color?: "gold" | "muted";
}

export function Ornament({ className = "", color = "gold" }: OrnamentProps) {
  const isGold = color === "gold";
  const lineColor = isGold ? "bg-gold-500/40" : "bg-line";
  const starColor = isGold ? "#C5A15B" : "#857B90";

  return (
    <div
      className={`flex items-center justify-center gap-4 my-6 select-none ${className}`}
      aria-hidden="true"
    >
      <span className={`h-[1px] w-12 md:w-16 ${lineColor}`} />
      <EightPointStar size={10} color={starColor} />
      <span className={`h-[1px] w-12 md:w-16 ${lineColor}`} />
    </div>
  );
}
