import React, { useId } from "react";

interface PatternProps {
  className?: string;
  opacity?: number;
}

export function GeometricPattern({
  className = "",
  opacity = 0.04,
}: PatternProps) {
  const patternId = useId();

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
            id={patternId}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Canonical 8-point girih star at centre (40, 40): two concentric overlapping squares */}
            <rect
              x="30"
              y="30"
              width="20"
              height="20"
              fill="none"
              stroke="#C5A15B"
              strokeWidth="0.8"
            />
            <rect
              x="30"
              y="30"
              width="20"
              height="20"
              transform="rotate(45 40 40)"
              fill="none"
              stroke="#C5A15B"
              strokeWidth="0.8"
            />
            {/* Interlacing diagonal lines */}
            <line x1="0" y1="0" x2="80" y2="80" stroke="#C5A15B" strokeWidth="0.5" strokeOpacity="0.5" />
            <line x1="80" y1="0" x2="0" y2="80" stroke="#C5A15B" strokeWidth="0.5" strokeOpacity="0.5" />
            <rect x="20" y="20" width="40" height="40" fill="none" stroke="#C5A15B" strokeWidth="0.5" strokeOpacity="0.4" />
            {/* Corner 8-point star fragments */}
            <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
            <rect x="-6" y="-6" width="12" height="12" transform="rotate(45 0 0)" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
            <rect x="74" y="-6" width="12" height="12" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
            <rect x="74" y="-6" width="12" height="12" transform="rotate(45 80 0)" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
            <rect x="-6" y="74" width="12" height="12" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
            <rect x="-6" y="74" width="12" height="12" transform="rotate(45 0 80)" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
            <rect x="74" y="74" width="12" height="12" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
            <rect x="74" y="74" width="12" height="12" transform="rotate(45 80 80)" fill="none" stroke="#C5A15B" strokeWidth="0.6" strokeOpacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
