# Perseus Talent — Frontend & Design Fix Plan

**Review date:** 19 November 2026
**Audited against:** `PERSEUS_TALENT_WEBSITE_PLAN.md` (Parts D, FE, G) and `REMAINING_WORK_PLAN.md`
**Method:** I read the source and checked it against the spec. I did not run lint, tests or the build for this review. Lighthouse scores come from the existing `lighthouse-reports/*.json`.
**This file replaces `REMAINING_WORK_PLAN.md`.** `REMAINING_WORK_PLAN - Copy.md` is an identical duplicate and can be deleted.

## Verdict

The site works and scores well technically: Lighthouse Performance 98–100 and Accessibility, Best Practices and SEO all 100. But **it does not yet look or read like the premium consultancy the brief describes.** The biggest problems:

- Articles show raw Markdown.
- Images look AI-generated and carry NHS branding.
- The logo and "8-point star" motif are wrong.
- Gold text on white fails contrast.
- Headings don't scale fluidly.
- Some copy breaks the "no fabrication" rule.

Of the 15 items in the previous plan, 7 are done (job search and filters, Insights categories, Contact tabs, SEO tags and structured data, spam protection, empty calculator, form error summary). Lighthouse (item 14) is also done. The rest are partial and are carried into this plan.

Paths below are under `src/` unless stated.

---

## P0 — Broken or risky (fix first)

1. **Articles render raw Markdown.** `app/insights/[slug]/page.tsx:142-144` prints the `content` string with `whitespace-pre-line`, so readers see `##`, `-` and `**`.
   - Render MDX/Markdown properly: `next-mdx-remote/rsc`, or `remark` + `remark-html`, since `gray-matter` is already used in `lib/content.ts`.
   - Add an `ArticleBody` component with its own prose styles to FE13 (no `@tailwindcss/typography`):
     - 18px/1.75 paragraphs
     - serif h2 34px and h3 26px
     - gold-600 8-point-star bullets
     - blockquote with a 2px gold left border
     - `hr` drawn as the ornament divider
     - tables with a purple-50 header row
   - Remove the dead `prose prose-lg` classes.

2. **Photography: AI-looking images with NHS logos and mirrored text.** For example, `public/images/home/executive-consultation.jpg` shows garbled, backwards "NHS Trust Executive Search" text. Using NHS marks implies an endorsement and is a trademark risk. `content/image-credits.md` has no real source or licence.
   - Replace all 8 with genuine licence-free photos (Unsplash/Pexels):
     - healthcare professionals in real settings
     - leadership meetings
     - one-to-one conversations
     - no logos, handshakes or syringes
   - Save as WebP at 1600px or less, about 150–250 KB each. Today's JPGs are about 800 KB.
   - Record each photo's real URL, photographer and licence in `image-credits.md`.
   - Fix the specialism image alt text, which says "team" while the image shows one person.
   - Use the images on pages that have none: Employers (2×2 feature grid), Candidates, Insights cards and featured article, and Contact (optional).
   - The owner approves the photos.

3. **Copy that breaks the no-fabrication rule or replaces official copy.**
   - `app/fee-calculator/page.tsx:~70-74`: restore the official G8 supporting text ("Calculate your recruitment fee in seconds. Enter the annual salary of your intended hire…").
   - `app/fee-calculator/page.tsx:101-137`:
     - Remove "Pay only on placement" and "Success", because payment terms are unconfirmed.
     - Remove the meaningless "0%" card.
     - Replace them with a "How our fee works" explainer that uses only facts from the brief: flat 15%, base salary, VAT where applicable, written agreement.
   - `app/contact/page.tsx:~97,~135`: remove "WhatsApp" and "Online portal" claims.
   - `app/specialisms/page.tsx:156-175`:
     - Render "More sectors" only when there is more than one active specialism.
     - Delete "as our client network expands".
   - `app/candidates/page.tsx:~262`: soften the "Strict confidentiality… explicit consent" wording to match the FAQ, and mark it [CONFIRM].
   - `app/employers/page.tsx:260`: remove the added "before recruitment begins".
   - British English: "résumé" → "CV". Rewrite About's "cultural synergy" in plain UK copy.

4. **Gold `#C5A15B` used as text on white or ivory** (about 2.3:1, fails WCAG AA). Use `--gold-text` (#7A5A20) for text on light backgrounds and gold-600 for decorative marks. Affected:
   - `sections/ProcessSteps.tsx:67`: numerals on white or ivory. Use gold-text on light, gold-500 on purple, controlled by a `tone` prop.
   - `app/employers/page.tsx:173,189,204,223`
   - `app/fee-calculator/page.tsx:101,115,128`
   - `✦` glyphs in `about/page.tsx:203` and `candidates/page.tsx:219-258`
   - `ui/Accordion.tsx:54` (use gold-600)
   - `forms/CandidateRegistrationForm.tsx` FileUp icon (use gold-600)
   - Add an axe colour-contrast check to the existing `tests/e2e/accessibility.spec.ts`. It is already on as part of the serious rules, so confirm it covers these elements.

5. **Keyboard access on the CV upload.** `forms/CandidateRegistrationForm.tsx:580-616`: the `sr-only` file input sits outside the dropzone, so there is no visible focus. Wrap the input in the dropzone `<label>` and add `focus-within:` ring styles. Also:
   - border 1.5px
   - truncate file names in the middle (keep the extension)

6. **Form success state.** In all three forms (`EmployerEnquiryForm.tsx:164-225` and the equivalent places in the Candidate and General forms):
   - Move focus to the "Thank you" heading using `ref` + `tabIndex={-1}`.
   - Heading text: "Thank you". Put the rest in the message.
   - Gold-filled 56px circle with a check icon.
   - "Send another enquiry" as a secondary (`outline-dark`) button.
   - `role="status"`.

---

## P1 — Brand identity (biggest premium gain)

7. **Real 8-point star.** Create one `brand/EightPointStar.tsx` SVG: two overlapping squares rotated 45°, or a 16-vertex polygon. Use it in:
   - `ui/Ornament.tsx:28` (10px; currently a 5-point star)
   - `brand/GeometricPattern.tsx:33`: rebuild as a true 8-point girih tile
   - the Logo monogram (`brand/Logo.tsx:79`)
   - hero pillar separators (`app/page.tsx:79,83`)
   - list bullets and value-card icons (replaces `✦` in `globals.css:188` and the pages)

8. **Redesign the logo as SVG.** Rewrite `brand/Logo.tsx`:
   - an inline SVG wordmark with outlined paths: "PERSEUS" in Cormorant 600 with wide tracking, and "TALENT" in Manrope 600, tracked 0.3em, readable at 11px or more
   - a monogram built from a constellation fragment and an 8-point star, drawn in gold strokes of at least 1.25px, with no filled square tile
   - sizes: 32px on mobile and 40px on desktop in the header, 44px in the footer

   Regenerate `public/brand/logo.svg` with outlined paths (no `<text>`), plus `icon.svg`, the apple icon and the OG image so they match. It stays marked "interim" in `CONTENT_TODO.md`.

9. **Fluid type scale (FE2).**
   - Add type tokens to `globals.css` `@theme`, each a `clamp()` exactly as in FE2: `--text-display`, `h1`, `h2`, `h3`, `h4`, `lead`, `numeral`, `fee-figure` and `stat-feature`.
   - Rewrite `ui/Heading.tsx:24-29` to use them, with `text-wrap: balance` on all headings.
   - Add a global `p { text-wrap: pretty }`.
   - Remove the `leading-tight` and `tracking-tight` overrides on page H1s: `employers:70`, `candidates:160`, `about`, `contact`, `fee-calculator`, and `page.tsx:43`.
   - Remove every Cormorant `font-bold` (700 isn't loaded, so the browser fakes it) and use 600 instead: `fee-calculator:101-128`, `about:203`, `candidates:219`, `opportunities:83`, `JobDirectory.tsx:188`.

10. **Home hero to FE6** (`app/page.tsx:21-190`).
    - At 1024px and up: a 12-column grid, text in columns 1–7 and the constellation in 8–12 (about 520px).
    - On mobile: the constellation top-right at 280px and 25% opacity; auto height (apply `min-h` only at `lg:`).
    - CTA gap 12px.
    - Pillar row with 8-point stars and no extra border.
    - Bottom hairline at container width, gold, 30% opacity.
    - Constellation: twinkle on 2–3 stars (5s, off for reduced motion); use `useId()` for SVG ids so repeated instances don't share `gold-glow` or `perseus-girih-pattern`.

11. **Shared `PageHero` and `Breadcrumb` components.** Replace the interior hero code that is copy-pasted on every page:
    - padding 64/64px on mobile and 112/96px on desktop
    - 13px breadcrumb with gold "/" separators
    - H1 at most 18ch, lead at most 60ch
    - constellation fragment about 220px at 35% opacity, from 1024px up
    - gold hairline along the bottom edge

    Use it on Employers, Candidates, Specialisms, About, Insights, Contact, Fee Calculator, Opportunities, the legal pages and articles.

---

## P2 — Layout, components, consistency

12. **Break the repetitive centred layouts.** Convert at least one section per page to an asymmetric 5/7 or 7/5 split (D3) with a left-aligned heading. Targets:
    - Employers "Understanding your requirements"
    - Candidates "Why connect"
    - About "Our approach"
    - Contact details strip
    - Fee calculator explainer

    Keep centred alignment only for CTA bands.

13. **Employers page structure.** Stop showing two 01–04 sequences in a row (`employers/page.tsx:127` and `:173-223`): make the 2×2 an image-led editorial grid without numerals. Then:
    - body text 16px or more on mobile
    - embedded calculator on a white or ivory section, so the purple card stands out
    - remove the duplicated "Recruitment Fee Calculator" heading

14. **Fee calculator to FE11** (`calculator/FeeCalculator.tsx`).
    - Remove `font-mono` (`:116,122,150,156`) and use Manrope `tabular-nums`.
    - Results as a `<dl>` of rows.
    - Primary fee as `fee-figure` (48→72px) in gold-500, label above.
    - "—" empty values.
    - 150ms opacity cross-fade when the value changes.
    - CTA through the shared `Button` (gold lg).
    - Remove the no-op `animate-in fade-in` (`:165`).

15. **Home sections.**
    - Dual audience panels (`page.tsx:156,205`): H2 at 36–40px, image 4:3, body 16px or more on mobile, CTAs aligned to the bottom.
    - Pricing band (`:261-318`): "15%" as `stat-feature` (112→180px), no boxed background, remove the extra eyebrow, padding to match `Section`.

16. **ProcessSteps.**
    - Numerals 56/72px.
    - Connector line behind the numerals (z-index plus a background mask).
    - Note in body size, not 12px italic.
    - `data-reveal-stagger`.

17. **Insights list to FE9/FE13** (`app/insights/page.tsx:125-200`, category page).
    - Featured article as a 7/5 split with a 16:10 image.
    - Cards: 3:2 image, gold-text category eyebrow, 2-line title clamp, 3-line excerpt clamp, `<time datetime>`, reading time.
    - A single stretched title link; remove "Read full article".
    - Image hover zoom 1.03.
    - Add the purple-50 CTA section.

18. **Section rhythm (FE7) and padding.**
    - Fee calculator CTA: purple → purple-50 (`fee-calculator/page.tsx:156`).
    - Contact form section: ivory → purple-50 (`contact/page.tsx:143`).
    - Make `CtaBand` (`sections/CtaBand.tsx:42`) and the home pricing band use the `Section` padding scale (64/96/128).
    - `CtaBand` button gap 12px; fix the `isPurple ? "gold" : "gold"` no-op.

19. **Buttons (`ui/Button.tsx`).**
    - Focus: a 2px `outline` with 3px offset on every variant; white on dark, gold-600 on light.
    - Arrow nudge 3px.
    - `sm` weight 600.
    - Loading label "Sending…".
    - List the transitioned properties instead of `transition-all`.
    - Link-buttons honour `disabled` with `aria-disabled` and no href.

20. **Card hover transitions.** `globals.css:146-150` is unlayered `[data-reveal]` CSS and overrides the card transitions, so hovers snap. Move it into `@layer base` and add border, box-shadow and transform transitions, so the 250ms lift and border easing work.

21. **Header and mobile drawer** (`layout/Header.tsx`).
    - Hover underline 1px at 6px below the text; active underline 2px.
    - Tablet calculator icon 44×44 (`:155`).
    - Drawer:
      - labels 30px serif with gold numerals 01–07
      - links appear 30ms apart
      - 200ms close animation (keep the drawer mounted until the animation ends)
      - contact rows 48px tall and tappable (`:247-260`)

22. **Footer** (`layout/Footer.tsx`).
    - 44px logo.
    - Remove the curly quotes around the statement (`:25`).
    - Top hairline at 30% opacity (`:12`).

23. **Forms** (all three, shared `forms/Field` styles).
    - Error text 14px with `AlertCircle`.
    - Focus ring 3px gold (55% opacity) plus the border colour change.
    - Hover border purple-600.
    - Selects: `appearance-none` with a custom chevron.
    - Prefill info box 14px.
    - `<noscript>` fallback note.

24. **Accordion and badges.**
    - Accordion: a bare gold-600 plus that rotates to ×, panel text 16px.
    - Article categories as an eyebrow, not a pill. Pills stay for job tags only.

25. **Contact tabs** (`contact/ContactTabs.tsx`). Remove the "Active/Select Pathway" labels and the `→` glyph. Selected tab: purple-900 background with a 3px gold top border.

26. **404 and labels.**
    - 404: one primary and one secondary button plus text links; full width on mobile.
    - Make labels consistent: "Contact Our Team" and "Discuss Your Recruitment Needs" everywhere.

---

## P3 — Leftovers from the previous plan, and tooling

27. **Scroll reveal and View Transitions.**
    - Make `RevealProvider` call `useReveal()` from `lib/reveal.ts` instead of duplicating its logic.
    - Add `data-reveal` to section headings, split features and dual panels.
    - Turn on real page cross-fades with Next's `experimental.viewTransition` in `next.config.ts`, plus the existing CSS.

28. **Content Security Policy** (`next.config.ts:7-18`).
    - Add the Turnstile domain only when `TURNSTILE_ENABLED=true`.
    - Drop `'unsafe-eval'` outside development.

29. **ESLint.** Add `eslint-plugin-jsx-a11y` (recommended rules) to `eslint.config.mjs` and fix what it finds.

30. **Browser (Playwright) tests** (`tests/e2e/`). Add tests for:
    - local-mode save (check that a submission folder is created)
    - the 503 message when SMTP settings are missing
    - CV upload rejecting a renamed `.exe` and a 5MB file
    - job search and filters, using a temporary open job file
    - article page renders headings and has no stray `##`
    - console-error check on all routes, not 5

    Fix `verify` so it runs `build` **before** `test:e2e`.

31. **Theme tokens.** Replace the 884 `[#hex]` classes with `@theme` tokens. Do it file by file, largest first:
    - `CandidateRegistrationForm` (76)
    - `JobDirectory` (69)
    - `EmployerEnquiryForm` (61)
    - `GeneralEnquiryForm` (44)
    - then the pages, `Section` and `CtaBand`

    Remove off-palette colours (`#DDD6CE`, `#8C827A`, `#F4F0F7`) or map them to purple-100 or ivory. Do this after items 1–26 so the visual changes and the refactor don't get mixed together.

---

## P4 — Owner actions (not code)

- Approve the replacement photos.
- Confirm the [CONFIRM] items: screening checks, payment terms, confidentiality wording.
- Delete the test submissions in `.local-submissions/`.
- Set `SHOW_DRAFTS=false` or publish the drafts.
- Supply the remaining `CONTENT_TODO.md` details: logo if commissioned, VAT, company and ICO details, founder.

---

## Order of work

1. **P0 items 1–6.** These are correctness and trust problems.
2. **P1 items 7–11.** The brand identity changes give the biggest visual gain.
3. **P2 items 12–26**, page by page: Home → Employers → Fee calculator → Candidates → Insights → About → Contact → Specialisms → 404.
4. **P3 items 27–31.**

After each group, run `npm run verify` and take screenshots.

## Done when

- `npm run verify` passes: lint (with jsx-a11y), type-check, unit tests, content audit, build, browser tests and axe on all routes, with zero serious or critical issues.
- Lighthouse on phone settings stays at Performance 90 or more and Accessibility, Best Practices and SEO at 100.
- A screenshot review at 375, 768 and 1440px on every page confirms:
  - real photos, with no logos or garbled text
  - SVG logo and a true 8-point star
  - no gold text on white
  - fluid headings
  - articles render formatted
  - asymmetric editorial layouts
  - FE7 section rhythm
- A grep finds no `font-mono`, no Cormorant `font-bold`, no `prose` classes and no `✦` glyphs in `src/`.
- Every copy change matches Part G word for word, or is marked *(draft)*/[CONFIRM].
- What's left outstanding is only owner-supplied information.
