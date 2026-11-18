import React from "react";

interface PatternProps {
  className?: string;
  opacity?: number;
}

export function GeometricPattern({
  className = "",
  opacity = 0.04,
}: PatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
      >
        <defs>
          <pattern
            id="perseus-girih-pattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* 8-point star at centre (40, 40) */}
            <path
              d="M40 24 L44 34 L54 34 L46 41 L49 51 L40 45 L31 51 L34 41 L26 34 L36 34 Z"
              fill="none"
              stroke="#C5A15B"
              strokeWidth="0.8"
            />
            {/* Interlacing diagonal lines */}
            <line x1="0" y1="0" x2="80" y2="80" stroke="#C5A15B" strokeWidth="0.5" strokeOpacity="0.5" />
            <line x1="80" y1="0" x2="0" y2="80" stroke="#C5A15B" strokeWidth="0.5" strokeOpacity="0.5" />
            <rect x="20" y="20" width="40" height="40" fill="none" stroke="#C5A15B" strokeWidth="0.5" strokeOpacity="0.4" />
            {/* Corner star fragments */}
            <circle cx="0" cy="0" r="4" fill="none" stroke="#C5A15B" strokeWidth="0.6" />
            <circle cx="80" cy="0" r="4" fill="none" stroke="#C5A15B" strokeWidth="0.6" />
            <circle cx="0" cy="80" r="4" fill="none" stroke="#C5A15B" strokeWidth="0.6" />
            <circle cx="80" cy="80" r="4" fill="none" stroke="#C5A15B" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#perseus-girih-pattern)" />
      </svg>
    </div>
  );
}
