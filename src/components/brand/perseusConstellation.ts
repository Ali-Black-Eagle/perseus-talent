// Shared Perseus constellation geometry (viewBox 0 0 500 500).
// Used by the static ConstellationGraphic and the animated home-hero version, so the shape stays identical.

export interface ConstellationLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Draw order for the animated version (0 = first, Mirfak outwards). */
  order: number;
}

export interface GuideLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ConstellationStar {
  id: string;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  /** Key stars (Mirfak, Algol, Gamma Persei) are drawn inside the glow group in the static version. */
  key: boolean;
  /** Radius of the thin gold ring drawn around Mirfak and Algol. */
  ring?: number;
  /** Class used by the static graphic's original two-star twinkle. */
  legacyTwinkle?: "a" | "b";
  /** Index (into perseusLines) of the line that reaches this star; undefined for Mirfak, the origin. */
  reachedBy?: number;
}

export const perseusLines: ConstellationLine[] = [
  { x1: 260, y1: 180, x2: 310, y2: 120, order: 0 },
  { x1: 260, y1: 180, x2: 210, y2: 240, order: 1 },
  { x1: 210, y1: 240, x2: 160, y2: 300, order: 4 },
  { x1: 260, y1: 180, x2: 330, y2: 230, order: 2 },
  { x1: 330, y1: 230, x2: 370, y2: 320, order: 6 },
  { x1: 330, y1: 230, x2: 390, y2: 190, order: 7 },
  { x1: 210, y1: 240, x2: 230, y2: 360, order: 5 },
  { x1: 230, y1: 360, x2: 290, y2: 400, order: 8 },
  { x1: 310, y1: 120, x2: 360, y2: 80, order: 3 },
];

export const perseusGuideLines: GuideLine[] = [
  { x1: 160, y1: 300, x2: 230, y2: 360 },
  { x1: 370, y1: 320, x2: 290, y2: 400 },
];

const GOLD = "#C5A15B";
const WHITE = "#FFFFFF";

// Order matters for the static graphic: regular stars first, then key stars (Mirfak, Algol, Gamma Persei).
export const perseusStars: ConstellationStar[] = [
  { id: "persei-360-80", cx: 360, cy: 80, r: 2.5, fill: GOLD, key: false, reachedBy: 8 },
  { id: "persei-160-300", cx: 160, cy: 300, r: 2.5, fill: GOLD, key: false, reachedBy: 2 },
  { id: "persei-390-190", cx: 390, cy: 190, r: 2, fill: GOLD, key: false, reachedBy: 5 },
  { id: "persei-370-320", cx: 370, cy: 320, r: 3, fill: GOLD, key: false, legacyTwinkle: "b", reachedBy: 4 },
  { id: "persei-230-360", cx: 230, cy: 360, r: 2.5, fill: GOLD, key: false, reachedBy: 6 },
  { id: "persei-290-400", cx: 290, cy: 400, r: 2.5, fill: GOLD, key: false, reachedBy: 7 },
  { id: "persei-330-230", cx: 330, cy: 230, r: 3, fill: GOLD, key: false, reachedBy: 3 },
  { id: "mirfak", cx: 260, cy: 180, r: 4.5, fill: WHITE, key: true, ring: 7, legacyTwinkle: "a" },
  { id: "algol", cx: 210, cy: 240, r: 4, fill: WHITE, key: true, ring: 6, legacyTwinkle: "b", reachedBy: 1 },
  { id: "gamma-persei", cx: 310, cy: 120, r: 3.5, fill: GOLD, key: true, reachedBy: 0 },
];
