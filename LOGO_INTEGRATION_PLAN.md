# Perseus Talent — Logo Integration Plan

**Date:** 19 November 2026
**Source:** the owner-supplied logo, a JPEG at 1280×853 on a white background. It shows a gold Perseus head with a winged helmet in a purple, Persian-arch medallion, gold and purple floral scrollwork, "PERSEUS" in gold Roman capitals, "TALENT" in purple spaced capitals between gold rules, and a purple flower ornament below.

## Context

This replaces the interim logo the build created: a constellation and 8-point-star monogram next to a serif wordmark in `src/components/brand/Logo.tsx`. The owner wants their real logo as an SVG, used across the site.

## Constraints and decisions

1. **A hand-drawn vector is impractical.** The logo is a detailed illustration, so it gets **auto-traced** into a multi-colour SVG. The tracer is `imagetracerjs`, a dev-only tool used once by a script. `sharp` is already installed and is used to prepare the source and render previews. The traced SVG is then optimised with `svgo`, also dev-only.
2. **The white background must go.** Before tracing, remove only the white that touches the image edge (flood-fill from the border), so highlights inside the logo stay.
3. **The full logo doesn't work in the header.** At 72–88px tall the detail turns to mush. Also, the purple "TALENT" and purple medallion disappear on the site's purple header and footer. So the logo is used in three forms:

   | Form | What it is | Where it goes |
   |---|---|---|
   | **Full logo** (`logo-full.svg`) | The complete traced logo, transparent background | Light backgrounds only: home intro section, About "Our story", 404, styleguide; also used to make the social-sharing image and the search-engine logo file |
   | **Emblem** (`logo-emblem.svg`) | Only the medallion with the head, cropped from the traced SVG | The header and footer, at 44–48px (header) and 64px (footer), next to the wordmark |
   | **Wordmark for dark backgrounds** | "PERSEUS" in gold Roman capitals with "TALENT" in white, letter-spaced, between thin gold rules: a simplified version of the logo's lettering | Header and footer, next to the emblem |

   The wordmark is made with real font outlines so it never depends on web fonts. "PERSEUS" uses a Roman-capital serif such as Cinzel (Google Fonts, OFL licence) to match the logo's Trajan-style letters. Outlines are made with `opentype.js` from the `@fontsource` font file, and the paths are stored in the component, the same way the current `Logo.tsx` stores its paths.
4. **Favicon.** Use the emblem on a purple rounded square, as `src/app/icon.svg` plus `apple-icon.png` at 180px. The detail will be minimal at 32px, which is acceptable.
5. **Social-sharing image and search-engine logo.** Search engines handle raster logos most reliably, so `public/brand/logo-full.png` (1200px wide, transparent) and a square `logo-emblem-512.png` are rendered from the SVGs. The structured data in `src/lib/seo.ts` points to `logo-emblem-512.png`. The social-sharing image (`src/app/opengraph-image.tsx`) shows the full logo on an ivory panel with the brand statement.
6. **File sizes.** The full logo SVG should be under 250 KB after optimisation; reduce the tracer's colour count and drop tiny paths until it fits. The emblem should be under 120 KB. The header must not hurt page speed: the emblem goes in as an `<img>` with set width and height, never inline, so it is cached once.
7. **Quality gate.** Render each SVG back to PNG with sharp and compare it side by side with the original. The head, wing, medallion border, florals and both words must be clearly recognisable, with no colour speckling. If the trace is poor at the original resolution, upscale the source 2× (Lanczos) before tracing and use a gold/purple palette of 12–20 colours.

## Steps

1. Copy the original to `brand-source/perseus-logo-original.jpg`. This is the master, kept outside `public/` and committed.
2. Write `scripts/build-logo.mjs`, which you can re-run any time. It:
   - removes the background;
   - upscales;
   - traces;
   - optimises with svgo;
   - writes `public/brand/logo-full.svg`;
   - crops the emblem into `public/brand/logo-emblem.svg` (same paths, cropped viewBox, paths outside the crop removed);
   - renders `logo-full.png`, `logo-emblem-512.png`, `apple-icon.png` and preview PNGs into the scratchpad.

   Add an npm script `brand:logo`.
3. Rewrite `src/components/brand/Logo.tsx`:
   - `variant="lockup"`: emblem + wordmark for dark backgrounds, used in the header and footer;
   - `variant="full"`: the full logo, light backgrounds only;
   - `variant="emblem"`.

   Keep the props `size`, `linkToHome` and `className`, and `aria-label="Perseus Talent — home"` on the link. Header sizes: emblem 40px on phones / 48px on desktop. The header height (`--header-h` 72/88) stays the same.
4. Update `Header.tsx`, `Footer.tsx` (the footer shows the lockup at a larger size), the styleguide, and `opengraph-image.tsx`. Replace `icon.svg` and the apple icon. Update the `seo.ts` logo URLs.
5. Add the full logo to light sections:
   - home intro (left column, about 280px wide, above or instead of the ornament);
   - About "Our story";
   - the 404 page (on purple, use the lockup).
6. Delete the old `public/brand/logo.svg` and `monogram.svg`, or replace them with the new files. Update every reference, including the constellation/star monogram code in `Logo.tsx`. `EightPointStar` and `ConstellationGraphic` stay, because other places still use them as decorative motifs.
7. Update `CONTENT_TODO.md` and `content/image-credits.md`: the logo is now owner-supplied, and the interim note is gone.

## Verification

- `npm run verify` passes. Update any test that looks for the old logo markup.
- Lighthouse on phone settings for Home stays at Performance 90 or higher.
- Browser screenshots at 375px and 1440px of: header (logo readable, no gap, nothing pushed out of place), footer, home intro, About, 404, and the favicon.
- The SVG previews compared with the original by eye.
- File sizes stay within the limits in decision 6.
