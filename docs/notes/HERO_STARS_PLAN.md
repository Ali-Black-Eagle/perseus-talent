# Homepage hero: animated stars plan

**Date:** 19 November 2026
**Goal:** the Perseus constellation in the home page hero should feel alive and premium (slow, elegant, astronomical), not busy or game-like. Other pages that use `ConstellationGraphic` (page heroes, footer, About, 404) stay as they are.

**Today:** `src/components/brand/ConstellationGraphic.tsx` is a static SVG with 9 lines and 10 stars; only 2 of the stars twinkle. The home page renders it twice in `src/app/page.tsx`: once for phones (around line 34) and once for desktop (around line 98).

## What to build

A new component, `src/components/brand/AnimatedConstellation.tsx`, used **only in the home page hero** (both the phone and desktop placements). It reuses the same star coordinates. Move them into a shared array that both components import, so the shape stays identical.

### Effects, in order of appearance
1. **Lines draw themselves on load.**
   - Each line animates `stroke-dashoffset` from its full length to 0, about 700ms each, staggered about 120ms in the order of the constellation (Mirfak outwards).
   - Total about 1.8s, starting 300ms after page load.
   - Dashed guide lines fade in last.
2. **Stars appear as their lines reach them.** Opacity 0 → 1 and scale 0.4 → 1, 400ms, ease-out, timed to their line.
3. **Every star twinkles,** not just two.
   - Each gets its own duration (3–7s) and delay from a **fixed list of values**, not `Math.random()` during render, so the server and browser render identically.
   - Opacity ranges from about 0.45 to 1. The two key stars also scale slightly, 1 → 1.15.
4. **Glow on the key stars** (Mirfak and Algol): a soft halo pulses (opacity 0.2 ↔ 0.6, scale 1 ↔ 1.35, 4–5s).
   - Animate a **pre-blurred circle's opacity and transform**; never animate the SVG filter itself, which is slow.
5. **Algol "blinks"** (a real astronomical touch: Algol is the famous eclipsing "Demon Star" in Perseus). About every 10s it dims to 30% for about 1.2s, then recovers. Subtle, not a flash.
6. **Background star field** across the **whole hero**, behind the text.
   - About 60 tiny stars (r 0.6–1.4px), white or gold, opacity 0.15–0.6, each twinkling slowly (4–9s) with fixed delays.
   - Positions from a fixed seeded list, the same on every load.
   - Keep the area behind the headline sparse: no stars in the left 55% × middle 60% on desktop, or lower their opacity to 0.15 or less there, so the text stays crisp.
   - On phones, show about 30.
7. **Shooting star**, now and then.
   - A thin gold-to-transparent streak (about 120px, 1px) crosses the upper part of the hero diagonally in about 0.9s.
   - Then it waits; one pass every 14–18s.
   - First appearance about 6s after load.
   - Never crosses the headline area.
8. **Gentle depth on desktop.**
   - On mouse movement over the hero, the constellation layer shifts up to ±8px and the background star field up to ±3px, in opposite directions, eased with `requestAnimationFrame` and lerping.
   - Only when `(pointer: fine)` and motion is allowed.
   - Resets smoothly when the mouse leaves.

### Rules (must hold)
- **Performance:**
  - CSS keyframes for everything except the depth effect (8).
  - Animate **only `transform` and `opacity`**, plus `stroke-dashoffset` for the one-off line draw.
  - No canvas, no animation libraries, no new dependencies.
  - Use `will-change` only on the two parallax layers.
- **Pause when not visible:** an IntersectionObserver on the hero adds a class that sets `animation-play-state: paused` on all hero star animations, and stops the depth effect, once the hero is scrolled out of view. Resume when it returns.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, show the **finished, still picture**: all lines drawn, all stars at full opacity, no twinkle, blink, shooting star or depth effect. Check this works with the global reduced-motion rule in `globals.css`. Lines must not stay invisible because of the draw-in starting state.
- **No layout shift:** the SVG keeps fixed dimensions and position. Nothing in the hero moves its text.
- **Server rendering:** no `Math.random()` or `Date` in render; the depth effect runs only after mount. No hydration warnings in the console.
- **Accessibility:** decorative only (`aria-hidden="true"`, `pointer-events: none`), and never covers the CTA buttons.
- **Unique IDs** for gradients and filters via `useId()`, since the home page renders the component twice.
- **Brand colours only:** gold `#C5A15B` / `#D4B577`, white. Elegant and slow: nothing faster than the shooting star, and no bouncing.

## Tests and checks
- **Browser test** (`tests/e2e/e2e.spec.ts`), "Home hero stars animate and respect reduced motion":
  - default: the animated constellation exists, star elements have a running CSS animation (`getAnimations().length > 0`), and the background field has stars;
  - with `reducedMotion: 'reduce'`: no running animations on hero stars, and every constellation line and star has computed opacity 1 and `stroke-dashoffset` 0.
- **Visual check:** screenshots at 1440px at 0.5s, 2.5s and 8s after load (lines mid-draw, then fully drawn), and at 375px. Look at them.
- **Short screen recording:** a 4-second capture (Playwright video) of the hero at 1440px, saved to the scratchpad for review.
- **Performance:** `npm run audit:lighthouse`. Home Performance stays at 95 or more, CLS 0, and no new console errors or hydration warnings.
- `npm run verify` passes. It builds into `.next-verify` on port 3400; use your own ports for anything else, and never stop processes you didn't start.
