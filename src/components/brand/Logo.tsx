import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "wordmark" | "monogram" | "full";
  color?: "light" | "dark";
  className?: string;
  linkToHome?: boolean;
}

export function Logo({
  variant = "full",
  color = "light",
  className = "",
  linkToHome = true,
}: LogoProps) {
  const isLight = color === "light";
  const textColor = isLight ? "#FFFFFF" : "#1C052E";
  const subColor = isLight ? "rgba(255, 255, 255, 0.75)" : "#625A6B";
  const goldColor = "#C5A15B";

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Monogram / Icon */}
      {(variant === "monogram" || variant === "full") && (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
          aria-hidden="true"
        >
          <rect width="36" height="36" rx="4" fill="#1C052E" />
          <rect
            x="0.5"
            y="0.5"
            width="35"
            height="35"
            rx="3.5"
            stroke={goldColor}
            strokeOpacity="0.4"
          />
          {/* Constellation fragment lines */}
          <line
            x1="10"
            y1="24"
            x2="18"
            y2="14"
            stroke={goldColor}
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />
          <line
            x1="18"
            y1="14"
            x2="26"
            y2="18"
            stroke={goldColor}
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />
          <line
            x1="18"
            y1="14"
            x2="18"
            y2="8"
            stroke={goldColor}
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />
          {/* Star dots */}
          <circle cx="10" cy="24" r="1.5" fill={goldColor} />
          <circle cx="26" cy="18" r="1.5" fill={goldColor} />
          <circle cx="18" cy="8" r="1.5" fill={goldColor} />
          {/* Central 8-point star anchor */}
          <path
            d="M18 10L19.2 13L22 14L19.2 15L18 18L16.8 15L14 14L16.8 13Z"
            fill={goldColor}
          />
        </svg>
      )}

      {/* Wordmark typography */}
      {(variant === "wordmark" || variant === "full") && (
        <div className="flex flex-col leading-none">
          <span
            className="font-serif text-[22px] md:text-[25px] font-semibold tracking-[0.14em]"
            style={{ color: textColor }}
          >
            PERSEUS
          </span>
          <span
            className="font-sans text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.32em] mt-[3px]"
            style={{ color: isLight ? goldColor : subColor }}
          >
            TALENT
          </span>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        aria-label="Perseus Talent — Home"
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A15B] focus-visible:ring-offset-2 rounded-[2px]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
