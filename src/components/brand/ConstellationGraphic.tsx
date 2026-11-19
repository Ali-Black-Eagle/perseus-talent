import React, { useId } from "react";

interface ConstellationProps {
  className?: string;
  opacity?: number;
}

export function ConstellationGraphic({
  className = "",
  opacity = 0.55,
}: ConstellationProps) {
  const glowId = useId();

  // Perseus constellation star coordinate map (Mirfak, Algol, Gorgonea, Menkib, Atik, Miram)
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <style>{`
          @keyframes starTwinkleA {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes starTwinkleB {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.35; }
          }
          @media (prefers-reduced-motion: no-preference) {
            .perseus-twinkle-a {
              animation: starTwinkleA 5s ease-in-out infinite;
            }
            .perseus-twinkle-b {
              animation: starTwinkleB 5s ease-in-out infinite 2s;
            }
          }
        `}</style>
      </defs>

      {/* Primary constellation segment lines */}
      <g stroke="#C5A15B" strokeWidth="0.75" strokeOpacity="0.7">
        <line x1="260" y1="180" x2="310" y2="120" />
        <line x1="260" y1="180" x2="210" y2="240" />
        <line x1="210" y1="240" x2="160" y2="300" />
        <line x1="260" y1="180" x2="330" y2="230" />
        <line x1="330" y1="230" x2="370" y2="320" />
        <line x1="330" y1="230" x2="390" y2="190" />
        <line x1="210" y1="240" x2="230" y2="360" />
        <line x1="230" y1="360" x2="290" y2="400" />
        <line x1="310" y1="120" x2="360" y2="80" />
      </g>

      {/* Subtle guide lines */}
      <g stroke="#C5A15B" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="3 3">
        <line x1="160" y1="300" x2="230" y2="360" />
        <line x1="370" y1="320" x2="290" y2="400" />
      </g>

      {/* Regular stars */}
      <circle cx="360" cy="80" r="2.5" fill="#C5A15B" />
      <circle cx="160" cy="300" r="2.5" fill="#C5A15B" />
      <circle cx="390" cy="190" r="2" fill="#C5A15B" />
      <circle cx="370" cy="320" r="3" fill="#C5A15B" className="perseus-twinkle-b" />
      <circle cx="230" cy="360" r="2.5" fill="#C5A15B" />
      <circle cx="290" cy="400" r="2.5" fill="#C5A15B" />
      <circle cx="330" cy="230" r="3" fill="#C5A15B" />

      {/* Key stars with glow (Mirfak - alpha Persei, Algol - beta Persei) */}
      <g filter={`url(#${glowId})`}>
        {/* Mirfak */}
        <circle cx="260" cy="180" r="4.5" fill="#FFFFFF" className="perseus-twinkle-a" />
        <circle cx="260" cy="180" r="7" stroke="#C5A15B" strokeWidth="0.75" />

        {/* Algol */}
        <circle cx="210" cy="240" r="4" fill="#FFFFFF" className="perseus-twinkle-b" />
        <circle cx="210" cy="240" r="6" stroke="#C5A15B" strokeWidth="0.75" />

        {/* Gamma Persei */}
        <circle cx="310" cy="120" r="3.5" fill="#C5A15B" />
      </g>
    </svg>
  );
}
