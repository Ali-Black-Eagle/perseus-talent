// Rebuilds the traced Perseus Talent logo assets from brand-source/perseus-logo-original.jpg
// Usage: npm run brand:logo
// Dev-only: sharp + imagetracerjs + svgo + opentype.js + @fontsource/cinzel
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { optimize } from "svgo";
import opentype from "opentype.js";

const require = createRequire(import.meta.url);
const ImageTracer = require("imagetracerjs");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "brand-source", "perseus-logo-original.jpg");
const OUT = path.join(root, "public", "brand");
const PREVIEW =
  process.env.LOGO_PREVIEW_DIR ||
  "C:/Users/nekba/AppData/Local/Temp/claude/2ec828a55026a61c/258235bd-bd91-4856-a770-354d85405e5a/scratchpad/logo-preview";
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREVIEW, { recursive: true });

// ---- tuning -------------------------------------------------------------
const UPSCALE = 2;
const WHITE_MIN = 236; // all channels above => background candidate
const POCKET_MIN = Number(process.env.LOGO_POCKET || 243);
const GROW = Number(process.env.LOGO_GROW || 2);
const PALETTE_SIZE = Number(process.env.LOGO_COLORS || 12);
const TRACE = {
  ltres: Number(process.env.LOGO_LTRES || 6),
  qtres: Number(process.env.LOGO_LTRES || 6),
  pathomit: Number(process.env.LOGO_PATHOMIT || 90), // drop speckles smaller than N points (at 2x scale)
  colorsampling: 0, // use our custom palette
  colorquantcycles: 1,
  blurradius: 0,
  strokewidth: 1.2, // same-colour stroke hides anti-alias seams between regions
  roundcoords: 1,
  linefilter: false,
  viewbox: true,
  desc: false,
};
// Medallion (arch + head) bounding box in ORIGINAL 1280x853 pixel coordinates
const EMBLEM = { x: 392, y: 18, w: 498, h: 462 };
const SENTINEL = { r: 0, g: 255, b: 0, a: 255 };

// ---- 1. prepare bitmap ----------------------------------------------------
const { data, info } = await sharp(SRC)
  .resize({ width: 1280 * UPSCALE, kernel: "lanczos3" })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const bg = new Uint8Array(W * H);
const inMedallion = (i) => { const x = (i % W) / UPSCALE, y = ((i / W) | 0) / UPSCALE; return x > EMBLEM.x + 6 && x < EMBLEM.x + EMBLEM.w - 6 && y > EMBLEM.y + 40 && y < EMBLEM.y + EMBLEM.h - 6; };
{
  const stack = [];
  const isWhite = (i) =>
    data[i * 3] > WHITE_MIN && data[i * 3 + 1] > WHITE_MIN && data[i * 3 + 2] > WHITE_MIN;
  const push = (x, y) => {
    const i = y * W + x;
    if (!bg[i] && isWhite(i)) {
      bg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % W;
    const y = (i / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }
  // interior pockets of true white (between scrolls) are background too; letter highlights are cream, not >POCKET_MIN in blue
  for (let i = 0; i < W * H; i++) if (!inMedallion(i) && data[i*3] > POCKET_MIN && data[i*3+1] > POCKET_MIN && data[i*3+2] > POCKET_MIN) bg[i] = 1;
  // grow background by 1px so the pale anti-aliased halo is not traced as a fringe
  for (let pass = 0; pass < GROW; pass++) {
    const grown = bg.slice();
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (!bg[i] && (bg[i - 1] || bg[i + 1] || bg[i - W] || bg[i + W])) {
          const lum = (data[i * 3] + data[i * 3 + 1] + data[i * 3 + 2]) / 3;
          if (lum > 190) grown[i] = 1;
        }
      }
    bg.set(grown);
  }
}

// ---- 2. palette (k-means on foreground pixels) -----------------------------
function kmeans(points, k, iters = 12) {
  const lum = (p) => p[0] * 0.3 + p[1] * 0.59 + p[2] * 0.11;
  const sorted = points.slice().sort((a, b) => lum(a) - lum(b));
  let cent = Array.from({ length: k }, (_, i) => sorted[Math.floor(((i + 0.5) / k) * sorted.length)].slice());
  for (let it = 0; it < iters; it++) {
    const sum = cent.map(() => [0, 0, 0, 0]);
    for (const p of points) {
      let best = 0;
      let bd = Infinity;
      for (let c = 0; c < k; c++) {
        const d = (p[0] - cent[c][0]) ** 2 + (p[1] - cent[c][1]) ** 2 + (p[2] - cent[c][2]) ** 2;
        if (d < bd) {
          bd = d;
          best = c;
        }
      }
      sum[best][0] += p[0];
      sum[best][1] += p[1];
      sum[best][2] += p[2];
      sum[best][3]++;
    }
    cent = cent.map((c, i) => (sum[i][3] ? [sum[i][0] / sum[i][3], sum[i][1] / sum[i][3], sum[i][2] / sum[i][3]] : c));
  }
  return cent;
}
const samples = [];
for (let i = 0; i < W * H; i += 5) if (!bg[i]) samples.push([data[i * 3], data[i * 3 + 1], data[i * 3 + 2]]);
const centroids = kmeans(samples, PALETTE_SIZE);
const pal = [SENTINEL, ...centroids.map((c) => ({ r: Math.round(c[0]), g: Math.round(c[1]), b: Math.round(c[2]), a: 255 }))];

// ---- 3. trace --------------------------------------------------------------
const rgba = new Uint8ClampedArray(W * H * 4);
for (let i = 0; i < W * H; i++) {
  if (bg[i]) {
    rgba[i * 4] = SENTINEL.r;
    rgba[i * 4 + 1] = SENTINEL.g;
    rgba[i * 4 + 2] = SENTINEL.b;
  } else {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
  }
  rgba[i * 4 + 3] = 255;
}
const rawSvg = ImageTracer.imagedataToSVG({ width: W, height: H, data: rgba }, { ...TRACE, pal });

// ---- 4. split into paths, drop background, build full + emblem -------------
const pathRe = /<path\b[^>]*\/>/g;
const sentinelFill = `fill="rgb(${SENTINEL.r},${SENTINEL.g},${SENTINEL.b})"`;
const paths = (rawSvg.match(pathRe) || []).filter((p) => !p.includes(sentinelFill));
function bbox(p) {
  const d = /\bd="([^"]*)"/.exec(p)[1];
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
  }
  return { x0, y0, x1, y1 };
}
const svgoCfg = {
  multipass: true,
  floatPrecision: 0,
  plugins: ["preset-default"],
};
// Merge all subpaths of one colour into a single <path> (same-colour stroke hides seams); big size saving
function mergeByFill(list) {
  const groups = new Map();
  for (const p of list) {
    const fill = /fill="([^"]*)"/.exec(p)[1];
    const dm = /d="([^"]*)"/.exec(p); if (!dm) { console.log("BAD", p.slice(0,300)); continue; } const d = dm[1];
    groups.set(fill, (groups.get(fill) || "") + d);
  }
  return [...groups].map(([fill, d]) => `<path fill="${fill}" stroke="${fill}" stroke-width="${TRACE.strokewidth}" d="${d}"/>`).join("");
}
const wrap = (vb, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="Perseus Talent">${body}</svg>`;
const opt = (s) => optimize(s, svgoCfg).data;

// Tight crop of the full logo to its content bounds
let cb = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
for (const p of paths) {
  const b = bbox(p);
  cb = { x0: Math.min(cb.x0, b.x0), y0: Math.min(cb.y0, b.y0), x1: Math.max(cb.x1, b.x1), y1: Math.max(cb.y1, b.y1) };
}
const pad = 6;
const fx = Math.max(0, Math.floor(cb.x0 - pad));
const fy = Math.max(0, Math.floor(cb.y0 - pad));
const fw = Math.min(W, Math.ceil(cb.x1 + pad)) - fx;
const fh = Math.min(H, Math.ceil(cb.y1 + pad)) - fy;
const fullTight = opt(wrap(`${fx} ${fy} ${fw} ${fh}`, mergeByFill(paths)));

const ex = EMBLEM.x * UPSCALE, ey = EMBLEM.y * UPSCALE, ew = EMBLEM.w * UPSCALE, eh = EMBLEM.h * UPSCALE;
const MIN_EMBLEM_AREA = Number(process.env.LOGO_EMBLEM_MINAREA || 1000);
const emblemPaths = paths.filter((p) => {
  const b = bbox(p);
  if ((b.x1 - b.x0) * (b.y1 - b.y0) < MIN_EMBLEM_AREA) return false;
  const outside = b.x1 < ex || b.x0 > ex + ew || b.y1 < ey || b.y0 > ey + eh;
  return !outside;
});
// Centre the emblem in a square viewBox
const side = Math.max(ew, eh);
const sx = ex - (side - ew) / 2;
const sy = ey - (side - eh) / 2;
const emblemSvg = opt(wrap(`${sx} ${sy} ${side} ${side}`, mergeByFill(emblemPaths)));

fs.writeFileSync(path.join(OUT, "logo-full.svg"), fullTight);
fs.writeFileSync(path.join(OUT, "logo-emblem.svg"), emblemSvg);

// ---- 5. rasters --------------------------------------------------------------
await sharp(Buffer.from(fullTight)).resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo-full.png"));
await sharp(Buffer.from(emblemSvg)).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo-emblem-512.png"));
// favicon / apple icon: emblem on purple rounded square
const ICON_MIN_AREA = Number(process.env.LOGO_ICON_MINAREA || 8000);
const iconPaths = emblemPaths.filter((p) => { const b = bbox(p); return (b.x1 - b.x0) * (b.y1 - b.y0) >= ICON_MIN_AREA; });
const iconSvg = (n, r) => {
  const inner = Math.round(n * 0.84);
  const o = (n - inner) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 ${n} ${n}"><rect width="${n}" height="${n}" rx="${r}" fill="#1C052E"/><svg x="${o}" y="${o}" width="${inner}" height="${inner}" viewBox="${sx} ${sy} ${side} ${side}">${mergeByFill(iconPaths)}</svg></svg>`;
};
await sharp(Buffer.from(iconSvg(180, 0))).png({ compressionLevel: 9 }).toFile(path.join(root, "src", "app", "apple-icon.png"));
// icon.svg: a very small (32px) emblem; use a coarser copy to keep it light
fs.writeFileSync(path.join(root, "src", "app", "icon.svg"), opt(iconSvg(32, 6)));

// previews
await sharp(Buffer.from(fullTight)).resize({ width: 1280 }).flatten({ background: "#ffffff" }).png().toFile(path.join(PREVIEW, "full-on-white.png"));
await sharp(Buffer.from(fullTight)).resize({ width: 1280 }).flatten({ background: "#1C052E" }).png().toFile(path.join(PREVIEW, "full-on-purple.png"));
await sharp(Buffer.from(emblemSvg)).resize(900, 900).flatten({ background: "#1C052E" }).png().toFile(path.join(PREVIEW, "emblem-on-purple.png"));
await sharp(await sharp(Buffer.from(emblemSvg)).resize(48, 48).flatten({ background: "#1C052E" }).png().toBuffer()).resize(384, 384, { kernel: "nearest" }).png().toFile(path.join(PREVIEW, "emblem-48px-x8.png"));

// ---- 6. wordmark outlines (Cinzel) ---------------------------------------------
const fontPath = (w) => path.join(root, "node_modules", "@fontsource", "cinzel", "files", `cinzel-latin-${w}-normal.woff`);
const load = (w) => {
  const b = fs.readFileSync(fontPath(w));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const n2 = (v) => String(+v.toFixed(2));
function pathData(cmds) {
  return cmds
    .map((c) => {
      if (c.type === "Z") return "Z";
      const pts = c.type === "M" || c.type === "L" ? [c.x, c.y] : c.type === "Q" ? [c.x1, c.y1, c.x, c.y] : [c.x1, c.y1, c.x2, c.y2, c.x, c.y];
      return c.type + pts.map(n2).join(" ");
    })
    .join("");
}
function setLine(font, text, size, trackEm, x0 = 0, y0 = 0) {
  let x = x0;
  let d = "";
  const scale = size / font.unitsPerEm;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    d += pathData(g.getPath(x, y0, size).commands);
    x += g.advanceWidth * scale + trackEm * size;
  }
  return { d, width: x - x0 - trackEm * size };
}
const f600 = load(600);
const f500 = load(500);
const P_SIZE = 40;
const perseus = setLine(f600, "PERSEUS", P_SIZE, 0.14, 0, P_SIZE * 0.7);
// TALENT must stay legible at header size (wordmark ~30px tall on phones): ~7px cap height.
const T_SIZE = 17;
const T_TRACK = 0.42;
const t0 = setLine(f500, "TALENT", T_SIZE, T_TRACK, 0, 0);
const totalW = Math.ceil(perseus.width);
const tX = (totalW - t0.width) / 2;
const tY = P_SIZE * 0.7 + 22;
const talent = setLine(f500, "TALENT", T_SIZE, T_TRACK, tX, tY);
const ruleY = +(tY - T_SIZE * 0.35).toFixed(1);
const gap = 12;
const rules = {
  left: { x1: 0, x2: +(tX - gap).toFixed(1), y: ruleY },
  right: { x1: +(tX + t0.width + gap).toFixed(1), x2: totalW, y: ruleY },
};
const vbH = Math.ceil(tY + 4);
const ts = `// GENERATED by scripts/build-logo.mjs - Cinzel outlines (OFL). Do not edit by hand.
export const WORDMARK = {
  viewBox: "0 0 ${totalW} ${vbH}",
  width: ${totalW},
  height: ${vbH},
  perseus: "${perseus.d}",
  talent: "${talent.d}",
  rules: ${JSON.stringify(rules)},
} as const;
`;
fs.writeFileSync(path.join(root, "src", "components", "brand", "wordmarkPaths.ts"), ts);

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1) + " KB";
console.log("palette", pal.slice(1).map((c) => "#" + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, "0")).join("")).join(" "));
console.log("paths full/emblem:", paths.length, emblemPaths.length);
console.log("logo-full.svg", kb(path.join(OUT, "logo-full.svg")), "logo-emblem.svg", kb(path.join(OUT, "logo-emblem.svg")));
console.log("logo-full.png", kb(path.join(OUT, "logo-full.png")), "emblem-512", kb(path.join(OUT, "logo-emblem-512.png")));
console.log("icon.svg", kb(path.join(root, "src", "app", "icon.svg")));
