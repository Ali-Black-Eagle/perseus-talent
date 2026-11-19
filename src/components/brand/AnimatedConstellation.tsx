import React, { useId } from "react";
import {
  perseusGuideLines,
  perseusLines,
  perseusStars,
} from "./perseusConstellation";

interface AnimatedConstellationProps {
  className?: string;
  opacity?: number;
}

// Timing (ms). Lines draw Mirfak outwards, ~700ms each, staggered by 120ms, starting 300ms after load.
const START_MS = 300;
const STAGGER_MS = 120;
const DRAW_MS = 700;
const STAR_LEAD_MS = 450; // a star appears as its line reaches it
const GUIDE_DELAY_MS = START_MS + 8 * STAGGER_MS + DRAW_MS + 100;

// Fixed per-star twinkle values (same order as perseusStars), so server and browser render identically.
const TWINKLE_DURATION_S = [4.2, 5.6, 3.6, 6.4, 4.8, 5.2, 3.8, 4.4, 6.8, 5.0];
const TWINKLE_DELAY_S = [0.4, 1.8, 2.6, 0.9, 3.2, 1.4, 2.2, 0.2, 3.0, 1.1];

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/**
 * Animated Perseus constellation for the home hero. Same geometry as ConstellationGraphic.
 * Pure CSS keyframes live in globals.css (.hs-*). Without animation (reduced motion) every element
 * rests in its finished state: lines drawn, stars fully opaque.
 */
export function AnimatedConstellation({
  className = "",
  opacity = 1,
}: AnimatedConstellationProps) {
  const uid = useId();
  const haloId = `${uid}-halo`;

  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`hs-svg pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
      data-animated-constellation
    >
      <defs>
        <radialGradient id={haloId}>
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#D4B577" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#C5A15B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Primary lines: draw themselves via stroke-dashoffset (pathLength normalised to 1) */}
      <g stroke="#C5A15B" strokeWidth="0.75" strokeOpacity="0.7">
        {perseusLines.map((l) => (
          <line
            key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={0}
            className="hs-line"
            data-line
            style={{ animationDelay: `${START_MS + l.order * STAGGER_MS}ms` }}
          />
        ))}
      </g>

      {/* Guide lines fade in last */}
      <g stroke="#C5A15B" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="3 3">
        {perseusGuideLines.map((l) => (
          <line
            key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            className="hs-guide"
            data-line
            style={{ animationDelay: `${GUIDE_DELAY_MS}ms` }}
          />
        ))}
      </g>

      {/* Stars */}
      {perseusStars.map((s, i) => {
        const lineOrder = s.reachedBy === undefined ? undefined : perseusLines[s.reachedBy].order;
        const appearDelay =
          lineOrder === undefined ? START_MS : START_MS + lineOrder * STAGGER_MS + STAR_LEAD_MS;
        const twinkleVars: Vars = {
          "--hs-dur": `${TWINKLE_DURATION_S[i]}s`,
          "--hs-delay": `${TWINKLE_DELAY_S[i]}s`,
        };
        const isMirfak = s.id === "mirfak";
        const isAlgol = s.id === "algol";
        const isKeyGlow = isMirfak || isAlgol;
        const core = (
          <circle
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={s.fill}
            className={isKeyGlow ? "hs-twinkle hs-twinkle-key" : "hs-twinkle"}
            style={twinkleVars}
            data-star
          />
        );

        const inner = isKeyGlow ? (
          <>
            <circle
              cx={s.cx}
              cy={s.cy}
              r={isMirfak ? 24 : 20}
              fill={`url(#${haloId})`}
              className="hs-halo"
              style={{
                "--hs-halo-dur": isMirfak ? "4.6s" : "4s",
                "--hs-halo-delay": isMirfak ? "0.6s" : "1.8s",
              } as Vars}
            />
            <circle cx={s.cx} cy={s.cy} r={s.ring} stroke="#C5A15B" strokeWidth="0.75" />
            {core}
          </>
        ) : (
          core
        );

        return (
          <g
            key={s.id}
            className="hs-appear"
            style={{ animationDelay: `${appearDelay}ms` }}
          >
            {isAlgol ? <g className="hs-blink">{inner}</g> : inner}
          </g>
        );
      })}
    </svg>
  );
}
