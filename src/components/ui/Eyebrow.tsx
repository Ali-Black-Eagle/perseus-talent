import React from "react";

interface EyebrowProps {
  children: React.ReactNode;
  theme?: "dark" | "light";
  className?: string;
  withLine?: boolean;
}

export function Eyebrow({
  children,
  theme = "dark",
  className = "",
  withLine = true,
}: EyebrowProps) {
  const isLight = theme === "light";
  const textColor = isLight ? "text-[#7A5A20]" : "text-[#C5A15B]";

  return (
    <div
      className={`inline-flex items-center text-xs md:text-[13px] font-sans font-semibold tracking-[0.18em] uppercase ${textColor} ${className}`}
    >
      {withLine && (
        <span
          className="inline-block w-7 h-[1px] bg-[#C5A15B] mr-3 shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </div>
  );
}
