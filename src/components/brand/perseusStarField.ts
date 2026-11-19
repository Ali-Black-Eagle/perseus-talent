// Deterministic background star field for the home hero. Seeded, so server and browser render the same positions.

export interface FieldStar {
  /** Percent of hero width / height. */
  x: string;
  y: string;
  /** Diameter in px (radius 0.6 to 1.4). */
  size: string;
  gold: boolean;
  /** Peak and trough opacity of the twinkle. */
  hi: string;
  lo: string;
  dur: string;
  delay: string;
  /** First 30 stars show on phones; the rest appear from md up. */
  extra: boolean;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build(count: number): FieldStar[] {
  const rand = mulberry32(20261119);
  const stars: FieldStar[] = [];
  for (let i = 0; i < count; i++) {
    const x = rand() * 100;
    const y = rand() * 100;
    const r = 0.6 + rand() * 0.8;
    // Keep the area behind the headline (left 55% x middle 60%) sparse and dim so text stays crisp.
    const behindText = x < 55 && y > 20 && y < 80;
    const peak = behindText ? 0.12 + rand() * 0.03 : 0.3 + rand() * 0.3;
    stars.push({
      x: x.toFixed(2),
      y: y.toFixed(2),
      size: (r * 2).toFixed(2),
      gold: rand() > 0.55,
      hi: peak.toFixed(2),
      lo: (peak * 0.3).toFixed(2),
      dur: (4 + rand() * 5).toFixed(1),
      delay: (rand() * 8).toFixed(1),
      extra: i >= 30,
    });
  }
  return stars;
}

export const heroFieldStars: FieldStar[] = build(60);
