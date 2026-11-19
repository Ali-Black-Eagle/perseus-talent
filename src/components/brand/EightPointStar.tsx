import React from "react";

interface EightPointStarProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Canonical 8-point star (two overlapping concentric squares rotated 45 degrees,
 * rendered as a single 16-vertex polygon path for uniform opacity & stroke handling).
 */
export function EightPointStar({
  size = 16,
  className = "",
  color = "currentColor",
  ...props
}: EightPointStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      <path d="M8,0 L10.343,2.343 L13.657,2.343 L13.657,5.657 L16,8 L13.657,10.343 L13.657,13.657 L10.343,13.657 L8,16 L5.657,13.657 L2.343,13.657 L2.343,10.343 L0,8 L2.343,5.657 L2.343,2.343 L5.657,2.343 Z" />
    </svg>
  );
}
