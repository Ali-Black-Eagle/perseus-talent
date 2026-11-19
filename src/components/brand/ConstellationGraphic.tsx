import React, { useId } from "react";
import { perseusGuideLines, perseusLines, perseusStars } from "./perseusConstellation";

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
        {perseusLines.map((l) => (
          <line key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>

      {/* Subtle guide lines */}
      <g stroke="#C5A15B" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="3 3">
        {perseusGuideLines.map((l) => (
          <line key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>

      {/* Regular stars */}
      {perseusStars
        .filter((s) => !s.key)
        .map((s) => (
          <circle
            key={s.id}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={s.fill}
            className={s.legacyTwinkle ? `perseus-twinkle-${s.legacyTwinkle}` : undefined}
          />
        ))}

      {/* Key stars with glow (Mirfak - alpha Persei, Algol - beta Persei, Gamma Persei) */}
      <g filter={`url(#${glowId})`}>
        {perseusStars
          .filter((s) => s.key)
          .map((s) => (
            <React.Fragment key={s.id}>
              <circle
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill={s.fill}
                className={s.legacyTwinkle ? `perseus-twinkle-${s.legacyTwinkle}` : undefined}
              />
              {s.ring ? (
                <circle cx={s.cx} cy={s.cy} r={s.ring} stroke="#C5A15B" strokeWidth="0.75" />
              ) : null}
            </React.Fragment>
          ))}
      </g>
    </svg>
  );
}
