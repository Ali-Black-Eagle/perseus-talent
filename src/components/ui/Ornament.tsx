import React from "react";

interface OrnamentProps {
  className?: string;
  color?: "gold" | "muted";
}

export function Ornament({ className = "", color = "gold" }: OrnamentProps) {
  const isGold = color === "gold";
  const lineColor = isGold ? "bg-[#C5A15B]/40" : "bg-[#E6E0EB]";
  const starColor = isGold ? "#C5A15B" : "#857B90";

  return (
    <div
      className={`flex items-center justify-center gap-4 my-6 select-none ${className}`}
      aria-hidden="true"
    >
      <span className={`h-[1px] w-12 md:w-16 ${lineColor}`} />
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M6 0L7.2 4L11.2 4.8L8 7.2L9.2 11.2L6 8.8L2.8 11.2L4 7.2L0.8 4.8L4.8 4L6 0Z"
          fill={starColor}
        />
      </svg>
      <span className={`h-[1px] w-12 md:w-16 ${lineColor}`} />
    </div>
  );
}
