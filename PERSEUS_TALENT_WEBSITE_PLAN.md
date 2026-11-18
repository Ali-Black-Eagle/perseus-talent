# PERSEUS TALENT — Complete Website Build Plan (for an AI developer)

## Context

Perseus Talent is a new UK recruitment consultancy (primary specialism: healthcare) that needs a premium, fully functional website at https://perseustalent.co.uk. The owner wrote a 24‑section brief. This plan turns that brief into an unambiguous, step‑by‑step build specification that any capable AI (or developer) can follow without guessing, while preserving every fact, piece of copy, rule and acceptance criterion in the original.

**What happens when this plan is approved:** this plan is saved as `C:\Users\nekba\Desktop\Perseus\PERSEUS_TALENT_WEBSITE_PLAN.md`. Nothing else is built yet (owner's choice). The file is the hand‑off document.

**Starting point (inspected 18 Nov 2026):** the `Perseus` folder is empty — no existing code, framework, backend, design system or deployment config. Node 24.20, npm 11.19 and Git 2.55 are installed. So the build starts from scratch and the stack below is chosen fresh.

**Owner answers already given:**
- No logo exists yet → the build must design a wordmark + monogram (see §D6).
- VAT registration status: not confirmed → calculator VAT display **off by default**, switchable by one config flag.
- **No hosting and no domain yet → the website is built to run fully on localhost** (`http://localhost:3000`). Everything — pages, calculator, forms, CV upload, job listings, SEO files — must work locally with **zero paid services and zero accounts required**. Deployment is a later, separate step; the code is written so going live later is only a matter of changing environment variables (see Part LH).

**Note on the source text:** the pasted brief contained messaging‑app timestamp/name lines (e.g. `[18/11/2026 19:58] …:`) that interrupted sentences. They are copy‑paste noise, not content. They have been removed here and must never appear on the site.

---

## PART A — ROLE, STANDARD AND NON‑NEGOTIABLE RULES

### A1. The role the AI must take
Act simultaneously as: (1) senior brand identity strategist, (2) award‑winning UI/UX designer, (3) senior full‑stack engineer, (4) professional corporate copywriter, (5) recruitment industry consultant, (6) conversion‑rate optimisation specialist, (7) technical SEO specialist, (8) accessibility & QA specialist.

This is a **real business project**, not a template demo or design experiment. The result must look and work like the site of an established, premium UK recruitment consultancy / specialist executive‑search firm. Make professional decisions independently, challenge weak ideas, and deliver a polished product. Visual quality and functionality are **equally** important — never sacrifice one for the other.

### A2. Official business facts (store once in `src/config/site.ts`; never hardcode elsewhere)
| Item | Value | Notes |
|---|---|---|
| Business name | Perseus Talent | |
| Website | https://perseustalent.co.uk | Display as **Perseustalent.co.uk** |
| Email | Perseustalent@gmail.com | Display exactly; link `mailto:Perseustalent@gmail.com` |
| Telephone | 07555004374 | Display exactly **07555004374**; link `tel:+447555004374` |
| Industry | Recruitment and talent acquisition | |
| Primary market | United Kingdom | |
| Primary specialism | Healthcare recruitment | |
| Positioning | A premium, relationship‑led recruitment consultancy connecting talented professionals with organisations seeking exceptional people. | |
| Audiences | A. Employers (companies, healthcare organisations, hiring managers, business owners, decision‑makers). B. Candidates (professionals seeking opportunities, progression, connections with employers). | Serve **both equally well**. |
| Fee | Flat **15%** of the successful candidate's annual gross base salary | No tiers, no other percentages, ever. |
| Brand statement | "The right people. The right opportunities. A better future." | |

Contact details must never be altered, re‑formatted differently, or substituted.

### A3. The "no fabrication" rule (applies to every page, image caption, meta tag and structured‑data block)
Do **not** invent: company history, number of placements, number of clients, client relationships, partnerships, awards, employee qualifications, accreditations, performance statistics, testimonials, office locations/addresses, social media accounts, company registration numbers, extra phone numbers, founder biography, specific healthcare disciplines, candidate networks, sector expertise claims, live vacancies, real industry news, or expert quotations.

Where information is missing, use a **clearly labelled editable placeholder**, e.g. a visible `[PLACEHOLDER — Founder biography to be supplied]` block styled distinctly (dashed gold border) and listed in `CONTENT_TODO.md`. Never present fiction as fact. No testimonials section at all until real, consented testimonials exist (build the component, but don't render it).

### A4. Language and tone
British English throughout (organisation, specialisation, enquiry, programme, colour, CV, licence/license correctly). Tone: confident, warm, intelligent, understated — premium consultancy, not sales‑y. No lorem ipsum anywhere. No promises of jobs, interviews or placements. No guaranteed outcomes, rankings or timescales.

---

## PART B — TECHNOLOGY DECISIONS

| Concern | Decision | Reason |
|---|---|---|
| Framework | **Next.js (App Router, current stable) + TypeScript (strict)** | Static pages for speed + server route handlers for forms/CV uploads in one maintainable codebase. |
| Styling | **Tailwind CSS** with design tokens defined as CSS custom properties in `globals.css` | Consistent design system, tiny CSS output. |
| Fonts | `next/font` self‑hosted: **Cormorant Garamond** (headings, 500/600, + italic 500) and **Manrope** (body/UI, 400/500/600/700) | Elegant editorial serif + highly readable modern sans; no layout shift, no third‑party font requests. |
| Content (Insights, Jobs, Specialisms) | **MDX/Markdown files in `/content`** with front‑matter validated by **Zod** at build time | Owner can add jobs/articles without redesign; no database needed at launch; invalid content fails the build loudly instead of breaking the site. (Optional later: Keystatic git‑based admin UI.) |
| Validation | **Zod** schemas shared by client and server | One source of truth; server always re‑validates. |
| Phone validation | `libphonenumber-js/min` | Correct UK/international number checks. |
| Delivery of enquiries | Pluggable **delivery adapter** chosen by `FORM_DELIVERY` env var: `local` (default on localhost — saves to a private git‑ignored folder), `smtp` (Nodemailer + Gmail App Password — real emails from localhost, no domain needed), `resend` (after a domain exists). See Part LH. | Works today on localhost, honest about where data went, upgrade without code changes. |
| CV handling | Validated in memory → in `local` mode written only to the private `./.local-submissions/` folder (outside `public/`, never served, git‑ignored); in `smtp`/`resend` mode attached to the notification email and **never written to disk** | Nothing publicly accessible; minimal GDPR exposure. (Later option: private Supabase Storage bucket with signed URLs.) |
| Spam protection | Hidden honeypot + minimum time‑to‑submit (3s) + per‑IP rate limit (5 submissions / 10 min) always on; **Cloudflare Turnstile** behind `TURNSTILE_ENABLED` flag (off on localhost; Cloudflare's official test keys can be used to test it locally; real keys after domain) | Layered, low friction, no account needed now. |
| Icons | `lucide-react` (stroke 1.5, tree‑shaken) + custom SVGs (8‑point star, constellation, monogram) | Consistent fine‑line icon style. |
| Animation | CSS transitions + a tiny IntersectionObserver hook; View Transitions API for page transitions as progressive enhancement | No heavy animation library. |
| Analytics | **None at launch.** If added later, use a consent‑gated solution (see §15) | Avoids needing a cookie banner on day one. |
| Testing | **Vitest** (unit), **Playwright** (e2e, mobile + desktop), **@axe-core/playwright** (accessibility), **Lighthouse** (performance/SEO), internal link crawler | Proves "functional" claims. |
| Running | **Localhost only for now**: `npm run dev` (development) and `npm run build && npm start` (production mode, still on localhost). Optional phone testing on the same Wi‑Fi via `npm run dev -- -H 0.0.0.0` → `http://<PC-IP>:3000`. | No host/domain exists yet. |
| Future hosting (not part of this build) | Vercel Pro (Vercel's free Hobby plan is non‑commercial only) or Netlify. Code stays platform‑neutral; CV limit 4MB fits both platforms' request limits. | Ready to deploy later without rewrites. |
| Linting/format | ESLint (next + jsx-a11y), Prettier, TypeScript strict | Clean, consistent code. |

**Environment variables** (`.env.example` committed with these localhost defaults; real `.env.local` never committed; no secret may be prefixed `NEXT_PUBLIC_`):
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000      # change to https://perseustalent.co.uk at launch
NEXT_PUBLIC_ALLOW_INDEXING=false                # true only on the live domain
FORM_DELIVERY=local                             # local | smtp | resend
ENQUIRY_TO_ADDRESS=Perseustalent@gmail.com      # defaults to site.ts email
SMTP_HOST=smtp.gmail.com  SMTP_PORT=465  SMTP_USER=  SMTP_APP_PASSWORD=   # only for FORM_DELIVERY=smtp
RESEND_API_KEY=  ENQUIRY_FROM_ADDRESS=          # only for FORM_DELIVERY=resend (after domain)
TURNSTILE_ENABLED=false  NEXT_PUBLIC_TURNSTILE_SITE_KEY=  TURNSTILE_SECRET_KEY=
SHOW_DRAFTS=true                                # drafts visible locally, badge "DRAFT"
```

---

## PART C — PROJECT STRUCTURE

```
perseus-talent/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                 # fonts, <Header/>, <Footer/>, skip link, default metadata
│  │  ├─ page.tsx                   # Home
│  │  ├─ employers/page.tsx
│  │  ├─ candidates/page.tsx
│  │  ├─ opportunities/page.tsx     # job listings (search + filters)
│  │  ├─ opportunities/[slug]/page.tsx
│  │  ├─ specialisms/page.tsx
│  │  ├─ specialisms/[slug]/page.tsx   # e.g. /specialisms/healthcare
│  │  ├─ about/page.tsx
│  │  ├─ insights/page.tsx
│  │  ├─ insights/[slug]/page.tsx
│  │  ├─ insights/category/[category]/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ fee-calculator/page.tsx
│  │  ├─ privacy-policy/page.tsx
│  │  ├─ cookie-policy/page.tsx
│  │  ├─ terms/page.tsx
│  │  ├─ not-found.tsx              # branded 404
│  │  ├─ styleguide/page.tsx        # development only (404 in production)
│  │  ├─ dev/submissions/page.tsx   # development only: view locally saved form submissions
│  │  ├─ api/enquiries/employer/route.ts
│  │  ├─ api/enquiries/candidate/route.ts   # multipart (CV)
│  │  ├─ api/enquiries/general/route.ts
│  │  ├─ sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg
│  ├─ components/
│  │  ├─ layout/   Header, DesktopNav, MobileNav, Footer, SkipLink, Container, Section
│  │  ├─ ui/       Button, LinkButton, Eyebrow, Heading, Card, Badge, Divider(ornament), Accordion, Placeholder
│  │  ├─ brand/    Logo (wordmark+monogram), ConstellationGraphic, GeometricPattern
│  │  ├─ sections/ Hero, SplitFeature, ProcessSteps, CtaBand, PricingPromo, ValuesGrid, FaqList
│  │  ├─ forms/    Field, TextInput, Select, Textarea, FileUpload, Checkbox, FormStatus, Turnstile,
│  │  │            EmployerEnquiryForm, CandidateRegistrationForm, GeneralEnquiryForm
│  │  ├─ calculator/ FeeCalculator, FeeResult
│  │  ├─ jobs/     JobCard, JobFilters, JobSearch, JobDetail, JobsEmptyState
│  │  └─ insights/ ArticleCard, FeaturedArticle, CategoryFilter, ArticleBody
│  ├─ config/  site.ts (business facts, nav, footer links, fee config, VAT flag, form limits)
│  ├─ lib/     fee.ts, format.ts, validation/*.ts (Zod), delivery/{index,local,smtp,resend}.ts, turnstile.ts, rate-limit.ts,
│  │           file-check.ts (magic bytes), content.ts (load MDX), seo.ts (metadata + JSON-LD helpers)
│  └─ styles/globals.css (tokens)
├─ content/
│  ├─ insights/*.mdx      jobs/*.mdx      specialisms/*.mdx
├─ public/brand/  (logo SVGs, favicon set, OG image)   public/images/ (optimised photography)
├─ tests/ unit/  e2e/
├─ CONTENT_TODO.md   (every placeholder + business info still needed)
├─ README.md         (run, add a job, add an article, add a specialism, deploy)
└─ .env.example
```

`src/config/site.ts` (single source of truth) must contain at least:
```ts
export const site = {
  name: 'Perseus Talent',
  url: 'https://perseustalent.co.uk', urlDisplay: 'Perseustalent.co.uk',
  email: 'Perseustalent@gmail.com',
  phoneDisplay: '07555004374', phoneHref: 'tel:+447555004374',
  statement: 'The right people. The right opportunities. A better future.',
  fee: { rate: 0.15, currency: 'GBP', vat: { enabled: false, rate: 0.2 },
         salaryMin: 1000, salaryMax: 10_000_000 },
  forms: { cvMaxBytes: 4 * 1024 * 1024, cvTypes: ['pdf','doc','docx'] },
  nav: [ /* Home, For Employers, For Candidates, Our Specialisms, About Us, Insights, Contact */ ],
  navCta: { label: 'Calculate Your Fee', href: '/fee-calculator' },
};
```

---

## PART D — DESIGN SYSTEM (Stage 2)

### D1. Colour (mandatory palette)
| Token | Hex | Use |
|---|---|---|
| `--purple-900` (PRIMARY) | **#1C052E** | Header, hero sections, footer, key brand elements, selected section backgrounds, prominent CTAs on light sections |
| `--white` (SECONDARY) | **#FFFFFF** | Main content backgrounds, text on dark, forms, reading areas |
| `--gold-500` (ACCENT) | **#C5A15B** | Small decorative details, selected buttons, icons, borders/dividers, highlights, subtle type accents |

Supporting tints (derived, never replacing the primaries): `--purple-800 #2A0B42` (hover/raised surfaces on dark), `--purple-700 #3B1A57` (borders on dark), `--purple-50 #F7F3FA` (very soft alternate light section), `--gold-600 #A8853F` (gold hover), `--gold-text #7A5A20` (gold‑coloured text on white — verify ≥4.5:1), `--ink #1C052E` (headings on white), `--body #3A3242` (body text on white), `--muted #625A6B` (secondary text, verify ≥4.5:1), `--line #E6E0EB` (hairlines on white), `--error #B42318`, `--success #1E7A4C`.

Rules:
- Do **not** use generic violet/bright purple as primary. Do **not** make black the primary colour.
- Gold is an accent: roughly ≤10% of any viewport. Never large gold fills except the single primary CTA style.
- **Contrast facts (pre‑computed):** white on #1C052E ≈ 19:1 ✔; gold #C5A15B on #1C052E ≈ 8.4:1 ✔ (fine for text); gold #C5A15B on white ≈ 2.3:1 ✘ — **never use #C5A15B for text on white**; use `--gold-text` there, and use #C5A15B on white only for decorative lines/icons with a non‑colour cue.

### D2. Typography
- Headings: Cormorant Garamond 500/600; italic used sparingly for one emphasised phrase in a headline (e.g. "*A better future.*" in gold on the hero).
- Body/UI: Manrope 400 (body), 500/600 (labels, nav, buttons).
- Eyebrows/labels: Manrope 600, uppercase, letter‑spacing 0.16–0.2em, 12–13px, gold on dark / `--gold-text` on light.
- Fluid scale (clamp): Display 44→88px, H1 38→68px, H2 30→48px, H3 22→30px, H4 18→22px, body 16→18px, small 14px. Line height 1.05–1.15 headings, 1.6–1.7 body. Max body measure ~68ch.
- One H1 per page; strict H1→H2→H3 order.

### D3. Spacing, layout, shape
- 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160).
- Section vertical padding: `clamp(64px, 10vw, 144px)`. Container max‑width 1240px; side gutters 20px (mobile) / 32px (tablet) / 48px (desktop). No horizontal overflow at any width ≥320px.
- Breakpoints: 640 / 768 / 1024 / 1280 / 1536. Full desktop nav from **1280px**; below that, the expandable menu (7 items + CTA do not fit elegantly earlier).
- Corners: sharp/minimal (2px) for an editorial, executive‑search feel; cards may use 4px. Hairline 1px borders; very soft shadows only on raised cards/menus.
- 12‑column grid on desktop; asymmetric editorial layouts (e.g. 5/7 splits, offset images) rather than repetitive centred blocks.

### D4. Components (all reusable, all with hover / focus‑visible / active / disabled states)
- **Buttons:** `primary-gold` (gold bg, purple text — nav CTA "Calculate Your Fee" and main CTA on dark), `primary-purple` (purple bg, white text — main CTA on light), `secondary` (1px border: white/gold on dark, purple on light), `text-link` (gold underline that grows on hover). Min height 48px, min tap target 44×44, visible 2px gold (on dark) / purple (on light) focus ring with offset. Subtle interaction: 150–200ms colour/background change and a small arrow nudge; no bounce.
- **Forms:** label above field, always visible (no placeholder‑only labels); helper text; required marker "(required)" in text, not just *; inline error under field linked with `aria-describedby`; error summary at top on submit with links to fields; 16px+ input font (prevents iOS zoom); generous 48–52px fields.
- **Cards:** article card, job card, specialism card, value card, step card.
- **Ornament divider:** two hairlines with a small gold 8‑point star between them.
- **Placeholder block:** dashed gold border + "Placeholder" badge, used only for owner‑supplied info.

### D5. Brand motifs (subtle — a contemporary corporate brand, not a mythology site)
1. **Perseus constellation:** a fine‑line SVG of the constellation (stars as small dots, connecting lines at ~0.5px, gold at 40–70% opacity) used in the homepage hero and sparingly as a footer/section watermark. Optional slow twinkle (opacity 0.6↔1, 4–6s) disabled under reduced motion.
2. **Persian geometric artistry:** an 8‑point star / girih‑inspired tessellation as an SVG pattern at 3–6% opacity on selected purple backgrounds, and the 8‑point star as the divider ornament and bullet icon.
Use each motif in limited, deliberate places (hero, footer, one or two CTA bands). Never on white reading areas behind text.

### D6. Logo (no logo exists — design it)
- **Wordmark:** "PERSEUS" in Cormorant Garamond 600, wide tracking; "TALENT" beneath or beside in Manrope 600, small caps, tracking 0.3em; white on purple / purple on white.
- **Monogram:** a refined "P" or a minimal mark combining a 4–5‑star constellation fragment with the 8‑point star, gold on purple.
- Deliver as optimised inline SVG components + `public/brand/` SVG/PNG exports, favicon (SVG + 32px + 180px apple‑touch), and a 1200×630 Open Graph image (purple, wordmark, statement, constellation).
- Mark in `CONTENT_TODO.md`: "Interim logo — replace if a professionally commissioned logo is produced."

### D7. Photography
- Professional, authentic‑looking images relevant to healthcare professionals, professional environments, business leadership and people in conversation. **Avoid** obvious stock, artificial handshakes, cartoons, cheap business graphics, unrelated healthcare imagery (e.g. syringes, surgery close‑ups).
- Source from licence‑free libraries (e.g. Unsplash/Pexels) choosing natural light, real settings, diverse people; record each image's source and licence in `content/image-credits.md`; owner to approve or replace before launch.
- Treatment: consistent warm, slightly desaturated grade; optional thin gold frame offset; never text over busy photos without a purple overlay.
- Every image: `next/image`, explicit dimensions, responsive `sizes`, AVIF/WebP, lazy‑loaded except the hero/LCP image (`priority`), meaningful `alt` (empty `alt=""` for decorative).
- Homepage hero uses the **designed abstract visual** (constellation + geometric pattern) or a single carefully chosen professional image — the hero must instantly read as a recruitment consultancy through its copy and CTAs.

### D8. Motion
Restrained only: gentle section reveals (opacity 0→1, translateY 12px→0, 500–700ms, ease‑out, once), refined button/link hovers, smooth mobile‑menu open/close (slide + fade 250ms), header compacting on scroll, page transitions via View Transitions where supported. All disabled/reduced under `prefers-reduced-motion: reduce`. No parallax, no scroll‑jacking, no autoplay video. Animations must not shift layout (no CLS).

### D9. Mobile‑first
Design the 375px layout first, intentionally (not a shrunk desktop): stacked hero with CTAs full‑width, larger tap targets, calculator result card directly under the input, sticky but compact header, forms single‑column, footer contact links as large tappable rows. Then enhance for tablet and desktop.

---

## PART FE — FRONTEND SPECIFICATION IN FULL DETAIL

Everything in this part is a concrete value. If something is not specified here, follow the nearest specified pattern — never invent a new style.

### FE1. Global tokens (`src/styles/globals.css`, exposed to Tailwind via `@theme`)
```css
:root {
  /* Brand (mandatory) */
  --purple-900:#1C052E; --white:#FFFFFF; --gold-500:#C5A15B;
  /* Supporting tints */
  --purple-800:#2A0B42; --purple-700:#3B1A57; --purple-600:#5A3A78;
  --purple-100:#EFE8F4; --purple-50:#F7F3FA; --ivory:#FBF9F6;
  --gold-400:#D4B577; --gold-600:#A8853F; --gold-text:#7A5A20; --gold-100:#F6EFE1;
  /* Text */
  --ink:#1C052E; --body:#3A3242; --muted:#625A6B;               /* muted ≈6.6:1, gold-text ≈6.3:1 on white */
  --on-dark:#FFFFFF; --on-dark-muted:rgba(255,255,255,.78); --on-dark-subtle:rgba(255,255,255,.6);
  /* Lines & fields */
  --line:#E6E0EB; --line-dark:rgba(255,255,255,.14); --field-border:#857B90; /* ≥3:1 non-text contrast */
  /* Status */
  --error:#B42318; --error-bg:#FEF3F2; --success:#1E7A4C; --success-bg:#ECFDF3;
  /* Type */
  --font-serif:'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-sans:'Manrope', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  /* Shape & depth */
  --radius-sm:2px; --radius-md:4px; --radius-pill:999px;
  --shadow-sm:0 1px 2px rgba(28,5,46,.06);
  --shadow-md:0 10px 30px -12px rgba(28,5,46,.22);
  --shadow-lg:0 24px 60px -20px rgba(28,5,46,.35);
  /* Motion */
  --ease-out:cubic-bezier(.22,1,.36,1); --ease-in-out:cubic-bezier(.65,0,.35,1);
  --dur-fast:150ms; --dur-base:250ms; --dur-slow:600ms;
  /* Layout */
  --container:1240px; --container-narrow:820px; --measure:68ch;
  --gutter:20px; --header-h:72px;
  --z-base:1; --z-header:50; --z-menu:60; --z-modal:70; --z-skip:100;
}
@media (min-width:768px){ :root{ --gutter:32px; } }
@media (min-width:1280px){ :root{ --gutter:48px; --header-h:88px; } }
html{ color-scheme:light; scroll-behavior:smooth; scroll-padding-top:calc(var(--header-h) + 16px);
      -webkit-text-size-adjust:100%; text-rendering:optimizeLegibility; -webkit-font-smoothing:antialiased; }
@media (prefers-reduced-motion:reduce){ html{scroll-behavior:auto} *,*::before,*::after{animation:none!important;transition-duration:1ms!important} }
body{ background:var(--white); color:var(--body); font:400 1rem/1.7 var(--font-sans); }
::selection{ background:var(--gold-500); color:var(--purple-900); }
```
No dark‑mode theme (brand uses fixed purple and white sections). No custom scrollbars.

### FE2. Type scale (fluid with `clamp()`, rem‑based)
| Token | Font / weight | Mobile (375) | Desktop (1440) | Line height | Letter spacing | Used for |
|---|---|---|---|---|---|---|
| `display` | Serif 500 | 44px | 88px | 1.02 | -0.015em | Homepage H1 only |
| `h1` | Serif 500 | 40px | 68px | 1.05 | -0.01em | Interior page H1 |
| `h2` | Serif 500 | 32px | 48px | 1.1 | -0.005em | Section headings |
| `h3` | Serif 600 | 24px | 30px | 1.2 | 0 | Card/sub‑section titles |
| `h4` | Sans 600 | 18px | 20px | 1.35 | 0 | Small headings, form section titles |
| `lead` | Sans 400 | 18px | 21px | 1.6 | 0 | Intro paragraphs |
| `body` | Sans 400 | 16px | 17px | 1.7 | 0 | Paragraphs |
| `small` | Sans 400 | 14px | 14px | 1.55 | 0 | Meta, helper text |
| `eyebrow` | Sans 600 uppercase | 12px | 13px | 1.2 | 0.18em | Labels above headings |
| `button` | Sans 600 | 15px | 15px | 1 | 0.02em | Buttons |
| `nav` | Sans 500 | 15px | 15px | 1 | 0.01em | Header links |
| `nav-cta` | Sans 600 uppercase | 13px | 13px | 1 | 0.12em | "Calculate Your Fee" |
| `numeral` | Serif 500 | 56px | 72px | 1 | 0 | 01–04 step numbers (gold) |
| `fee-figure` | Serif 600 | 48px | 72px | 1 | -0.01em | Calculator main fee |
| `stat-feature` | Serif 500 | 112px | 180px | 0.9 | -0.02em | "15%" on pricing band |
Example: `h1: clamp(2.5rem, 1.75rem + 3.2vw, 4.25rem)`. Headings use `text-wrap: balance`; paragraphs `text-wrap: pretty`. Headings on white = `--ink`; on purple = white. Eyebrows have a 28px × 1px gold line before them (`::before`, 12px gap).

### FE3. Spacing & grid
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160 px.
- Section padding (top/bottom): mobile 64px, tablet 96px, desktop 128px (`clamp(4rem, 2rem + 6vw, 8rem)`). Hero sections: see FE6.
- Heading → body gap 24px; eyebrow → heading 16px; paragraph spacing 1em; body → CTA 32px; card grid gaps 24px (mobile) / 32px (desktop).
- Container: `max-width: var(--container)`, centred, side padding `var(--gutter)`. Narrow container (820px) for legal pages, article bodies and forms.
- Grid: 4 columns mobile, 8 tablet, 12 desktop; column gap 24px / 32px.
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Design order: 375 → 768 → 1024 → 1280 → 1440. Must not break at 320px.

### FE4. Header
- Sticky (`position: sticky; top:0; z-index: var(--z-header)`), purple‑900 background, height `--header-h` (72 / 88px).
- Scroll state (after 8px): 1px bottom border `--line-dark` + `--shadow-md`; height stays fixed (no layout shift).
- Logo: wordmark SVG, height 32px mobile / 40px desktop, left aligned, link to `/`.
- Desktop (≥1280): nav centred‑right, link gap 32px (40px ≥1440); links `nav` style, colour `--on-dark-muted`, hover → white + 1px gold underline growing from left (`transform: scaleX(0→1)`, origin left, 250ms `--ease-out`, positioned 6px below text); active → white + 2px gold underline permanently + `aria-current="page"`.
- **Calculate Your Fee** button: 44px tall, padding 0 20px, 1px gold border, gold text (`nav-cta`), 2px radius, 24px left margin; hover → gold fill, purple‑900 text (200ms); focus → 2px white outline, 3px offset. Gold‑accented but not a solid gold block at rest, so it stands out without overpowering.
- Mobile/tablet (<1280): logo left; right side shows a compact gold‑outline "Fee Calculator" icon button only ≥640px; menu toggle 48×48px with 3 lines (24px wide, 1.5px, white) animating into an X (250ms). `aria-label` toggles "Open menu"/"Close menu".
- Mobile menu panel: fixed, full viewport below header (`inset: var(--header-h) 0 0 0`), purple‑900 with 8‑point geometric pattern at 4% opacity; content padding 32px gutter; links listed vertically, each a 64px row with hairline `--line-dark` separator, small gold numeral (01–07, 12px sans) left, label in serif 30px white; active link gold; CTA "Calculate Your Fee" full‑width gold‑filled button (56px); beneath, phone and email as tappable rows with gold icons. Opening: fade + translateY(-8px→0) 250ms, links stagger 30ms each; closing reverse 200ms. Focus trap, `Esc` closes, scroll lock, closes on link click and route change, focus returns to toggle. `inert` on page content while open.
- Skip link: visually hidden until focused, then appears top‑left as gold button above header (`z-skip`).

### FE5. Buttons & links
| Variant | Rest | Hover | Active | Focus‑visible | Disabled |
|---|---|---|---|---|---|
| `gold` (primary on dark) | bg gold‑500, text purple‑900 | bg gold‑400, arrow +3px | bg gold‑600 | 2px white outline, 3px offset | 45% opacity, no pointer |
| `purple` (primary on light) | bg purple‑900, text white | bg purple‑800, arrow +3px | bg purple‑700 | 2px gold‑600 outline, 3px offset | 45% opacity |
| `outline-light` (secondary on dark) | transparent, 1px white/60%, white text | border gold, text gold‑500 | bg white/5% | 2px white outline | 45% |
| `outline-dark` (secondary on light) | transparent, 1px purple‑900, purple text | bg purple‑900, white text | bg purple‑800 | 2px gold‑600 outline | 45% |
| `text-link` | ink/white text, 1px gold underline offset 4px | underline thickens to 2px | — | outline as above | — |
Sizes: `sm` 40px / padding 0 16px / 14px (cards only) · `md` 48px / 0 24px / 15px (default) · `lg` 56px / 0 32px / 16px (hero, CTA bands). Radius 2px. Optional trailing arrow icon 16px with 10px gap (`→` lucide `ArrowRight`). Transitions 200ms `--ease-out` on background, color, border, transform. On mobile, hero and CTA‑band buttons are full width and stacked with 12px gap. Buttons that navigate are `<a>`; buttons that act are `<button>`.
Inline body links: purple‑900 text, 1px gold‑600 underline, offset 3px; hover purple‑700 with 2px underline. External links get `rel="noopener noreferrer"` and a visually hidden "(opens in new tab)" only if they open new tabs (avoid new tabs generally).

### FE6. Hero patterns
- **Home hero:** purple‑900; min‑height `min(92vh, 880px)` on ≥1024 (content vertically centred), auto on mobile with padding 72px top / 64px bottom. Desktop grid: text in columns 1–7, constellation visual in 8–12 (approx. 520×520px SVG, gold lines 0.75px at 55% opacity, star dots 2–4px, 2 brighter "key stars" with soft glow). 8‑point geometric pattern overlay at 4% opacity across the whole hero. Mobile: constellation sits top‑right behind text at 25% opacity, 280px. Order: eyebrow → H1 (`display`; final phrase "A better future." in italic serif, gold‑400) → supporting lead (`--on-dark-muted`, max 42ch) → CTAs (`gold` lg "Find Talent", `outline-light` lg "Explore Opportunities") → 48px below, a thin row of three factual brand pillars separated by small gold 8‑point stars: "Relationship‑led recruitment · Transparent 15% flat fee · Healthcare focus" (small, white 70%). Bottom edge: 1px gold hairline at 30% opacity, full container width.
- **Interior hero (all other pages):** purple‑900; padding 64px top / 64px bottom mobile, 112px / 96px desktop. Breadcrumb (13px, white 60%, gold "/" separators) → eyebrow → H1 (`h1`, max 18ch) → intro (`lead`, `--on-dark-muted`, max 60ch, multiple paragraphs spaced 16px) → optional CTA row. A small constellation fragment (≈220px, 35% opacity) right‑aligned on ≥1024. Same gold hairline bottom edge.
- Long official intro copy (e.g. Employers, Candidates, About) may be split: first sentence in hero as `lead`, remainder in the first white section — but every word of the official copy must appear on the page.

### FE7. Section background rhythm (alternate to create editorial pacing; avoid two purple sections touching — the only exception is a purple CTA band directly above the purple footer, separated by a gold hairline)
- Home: Hero (purple) → Intro (white) → Dual audience (ivory) → Approach (white) → Pricing band (purple + pattern) → Insights (white, conditional) → Final CTA (purple‑50) → Footer (purple).
- Employers: Hero → Approach (white) → Requirements/Identifying/Screening/Communication as 2×2 editorial feature grid with image (ivory) → Pricing model (white) → Calculator (purple) → Enquiry form (purple‑50, form on white card) → CTA band "Let's find your next great hire." (white with purple text, gold ornament) → Footer.
- Candidates: Hero → Why connect (white) → Candidate approach (ivory) → Career opportunities (white) → Registration + CV form (purple‑50) → FAQs (white) → CTA band (purple) → Footer.
- Specialisms: Hero → Intro + featured Healthcare panel (white; panel = 7/5 split image + text on purple‑900) → "More sectors" structure (ivory; rendered only when more specialisms exist) → CTA (purple‑50) → Footer.
- About: Hero → Our story (white, 5/7 split with image) → Our philosophy (ivory, large serif pull‑statement) → Our values (white, 5 cards) → Our approach (ivory) → Our vision (purple with constellation) → CTA (purple‑50) → Footer.
- Insights: Hero → Featured article (white) → Category chips + grid (white) → CTA (purple‑50) → Footer.
- Contact: Hero → Contact details strip + pathways (white) → Selected form (purple‑50) → Footer.
- Fee calculator: Hero → Calculator (white with purple calculator card) → How our fee works + salary explanation (ivory) → CTA (purple‑50) → Footer.
- Legal: Hero (compact: 48/48px) → draft banner → narrow container text (white) → Footer.
When a purple section precedes the purple footer, insert a 1px gold hairline at 30% opacity between them.

### FE8. Section component specs
- **SplitFeature** (text + image): grid 5/7 or 6/6 on ≥1024, image left or right via prop; stacked on mobile with image first; image aspect 4:5 (portrait) or 3:2; optional decorative 1px gold frame offset 16px behind image (desktop only).
- **Dual audience panels:** two equal columns (6/6) on ≥1024, gap 32px; each: image 4:3 → eyebrow ("For Employers"/"For Candidates") → H2 at 36–40px → copy → CTA (`purple`). Equal heights, CTAs aligned to bottom. Stacked on mobile, Employers first.
- **ProcessSteps:** 4 columns ≥1024, 2×2 at 768, stacked mobile; each step: gold numeral (`numeral`), 40px gold hairline, title (`h3`), text (`body`, muted). On desktop a 1px gold line at 30% opacity connects steps horizontally behind numerals. Reveal stagger 80ms.
- **Pricing band:** grid 7/5; left eyebrow + H2 + copy + `gold` CTA; right the "15%" (`stat-feature`, gold‑500) with caption "of the successful candidate's annual gross base salary" (small, white 78%). Mobile: 15% above copy, centred left.
- **CtaBand:** centred text, max 720px, H2 + optional copy + buttons row; ornament divider above heading.
- **Ornament divider:** 1px lines 64px each side of a 10px 8‑point star (gold); `aria-hidden`.
- **ValuesGrid:** 5 cards: 3 + 2 centred on desktop (or 5 columns ≥1440), 2 columns tablet, 1 mobile. Card: white, 1px `--line`, padding 32px, 8‑point star icon 28px gold, title `h3`, text `body`. Hover: border gold‑500, translateY(-2px), `--shadow-md`, 250ms.
- **Placeholder block:** 1px dashed gold‑600 border, ivory background, padding 24px, small badge "Placeholder — to be supplied" (gold‑text, uppercase 11px), italic description of what's needed.

### FE9. Cards
- **Article card:** image 3:2 (rounded 0), `object-fit: cover`; below: eyebrow category (gold‑text), title (`h3` 24px, ink, 2‑line clamp), excerpt (body, muted, 3‑line clamp), meta row "12 March 2027 · 5 min read" (small, muted, `<time>`). Whole card clickable via the title link with stretched `::after` (single tab stop). Hover: image scale 1.03 over 600ms, title underline. Draft badge top‑left on image when draft.
- **Featured article:** 7/5 split, image 16:10 left, text right with larger title (`h2` size), "Read article" text link.
- **Job card:** white, 1px `--line`, padding 28px, radius 4px; top row: specialism tag (pill, purple‑50 bg, purple text, 12px) + posted date (small, muted, right); title (`h3`, 26px); meta row with lucide icons 16px gold‑600: MapPin location · PoundSterling salary · Briefcase employment type; 2‑line summary; "View role →" text link. Hover: border gold‑500, `--shadow-md`.
- **Specialism card:** image 4:3 with purple gradient overlay bottom (to 85%), title in white serif on image, summary below, "Explore →".

### FE10. Forms (visual & interaction detail)
- Form wrapper: white card, 1px `--line`, padding 24px mobile / 48px desktop, max width 820px, placed on purple‑50 section. Optional heading (`h3`) + intro text + "Fields marked (required) must be completed." note.
- Layout: single column mobile; ≥768 two columns for short fields (Full name | Email; Telephone | Company / Location; Job title | Salary), full width for selects with long labels, textareas, file upload, consent, submit.
- **Label:** 14px sans 600 ink, 8px above field; "(required)" in muted 400 after label text. Helper text 13px muted under label (e.g. "We'll only use this to contact you about your enquiry.").
- **Input/select:** height 52px, padding 0 16px, 16px font (prevents iOS zoom), 1px `--field-border`, radius 2px, white bg. Hover: border purple‑600. Focus: border purple‑900 + 3px outer ring `rgba(197,161,91,.55)` (plus 2px purple outline for forced‑colours mode). Placeholder colour `--muted`. Salary input has a fixed "£" prefix inside the field (left, 16px, ink) with input padding 36px.
- **Select:** native `<select>` styled, custom chevron SVG right 16px.
- **Textarea:** min‑height 160px, vertical resize, character counter (small, muted, right) "0 / 3000".
- **Checkbox:** 22px box, 1.5px `--field-border`, radius 2px; checked → purple‑900 fill with gold check; label 15px body to the right, clickable; links inside label underlined.
- **File upload:** dropzone 1.5px dashed `--field-border`, radius 4px, padding 28px, centred: lucide `FileUp` 28px gold‑600, "Drag and drop your CV here, or **browse files**" (browse styled as text link; actual native `<input type=file>` visually hidden but focusable), helper "PDF, DOC or DOCX · maximum 4MB". Drag‑over: purple‑50 bg, purple border solid. Selected: dropzone replaced by a file chip (FileText icon, file name truncated middle, size "512 KB", "Remove" button with `aria-label="Remove CV file <name>"`). Client‑side checks for type and size with immediate inline errors.
- **Errors:** field border `--error`, background `--error-bg`, message under field (14px, error colour, lucide `AlertCircle` 16px) with `id` linked via `aria-describedby`, `aria-invalid="true"`. Validate on blur and on submit (not on every keystroke until the field has been touched). On submit with errors: error summary box at top (role="alert", heading "Please correct the following", list of links to each field), focus moves to it.
- **Submit:** `purple` lg button ("Send Enquiry" / "Register Your Interest" / "Send Message"), full width on mobile; loading state: spinner 16px + "Sending…", disabled, `aria-busy`. Privacy line above button (small, muted) with link to Privacy Policy.
- **Success state:** form replaced in place by a panel: gold circle (56px) with check icon, `h3` "Thank you", message (exact copy from Part I4 depending on delivery mode), secondary button "Send another enquiry"; focus moves to the heading; panel has `role="status"`.
- **Failure state:** banner above submit (error‑bg, 1px error border, role="alert") with retry advice and the phone/email fallback; entered data kept.
- Prefill from calculator: salary field filled and a small info box under it (purple‑50, gold left border 3px): "Estimated fee: £6,000.00 excluding VAT — indicative only."

### FE11. Fee calculator UI
- Card: purple‑900 background, 1px gold hairline border at 40% opacity, radius 4px, padding 32px mobile / 56px desktop, subtle geometric pattern 3% opacity. Title "THE PERSEUS FEE CALCULATOR" as eyebrow (gold).
- Layout ≥1024: input column (5/12) left, results column (7/12) right separated by 1px `--line-dark` vertical rule. Mobile: input on top, results directly below.
- Input: label white 15px 600; field 64px tall, 24px font, white bg, "£" prefix; helper below "Annual gross base salary, before tax, excluding bonuses, commission and benefits." (white 70%). Error text below field in `#FFB4A9` (light red with ≥4.5:1 on purple) with icon.
- Results list (`<dl>`): rows "Annual salary", "Recruitment percentage", then the primary block "Estimated recruitment fee (excluding VAT)" shown as `fee-figure` in gold‑500 with label above; VAT rows (only when enabled) with "(illustrative)" tag in small caps. Rows separated by 1px `--line-dark`, label white 70% left, value white right, tabular numerals (`font-variant-numeric: tabular-nums`).
- Empty state: results show "—" values dimmed and the prompt "Enter a salary to see your estimated fee."
- Number change: value cross‑fades (opacity 150ms) — no count‑up animation (avoids misleading intermediate figures).
- CTA "Discuss Your Recruitment Needs" (`gold` lg) appears enabled only after a valid result; before that it's hidden (not a dead button).
- Disclaimer below the card in 14px muted on white (or white 70% inside card on the dedicated page), lucide `Info` icon.

### FE12. Job listings UI
- Top: search input (full width, 56px, lucide `Search` icon left, clear "×" button when filled, placeholder "Search by job title, keyword or location").
- ≥1024: filters left column (3/12) as checkbox groups with headings (Location, Specialism, Employment type) and "Clear all" link; results right (9/12) as single‑column job cards list. <1024: "Filters (n)" button opens a bottom‑sheet dialog (focus‑trapped, "Show results" and "Clear" buttons).
- Result count line: "Showing 3 opportunities" (`aria-live="polite"`). Active filters shown as removable chips.
- No‑results (with filters): "No opportunities match your search." + "Clear filters" + register CTA. Zero‑jobs empty state: centred panel with constellation illustration, official empty‑state copy, "Register Your Interest" `purple` button.
- Job detail page: 8/4 layout ≥1024 — main description left; right sticky summary card (top: header‑h + 24px) with salary, location, type, specialism, posted date and "Apply for this role" `purple` button; on mobile the summary card appears under the title and a sticky bottom "Apply for this role" bar (64px, purple) is shown.

### FE13. Insights & article typography
- Category chips: pills 36px tall, 1px `--line`, 14px; active = purple‑900 bg, white text; horizontal scroll on mobile with fade edge.
- Article page: narrow container (max 720px text measure); title `h1` in hero; meta row; hero image 16:9 full container width under hero (overlapping hero bottom by 64px on desktop).
- Prose: p 18px/1.75; h2 serif 34px, margin 56px 0 16px; h3 serif 26px, margin 40px 0 12px; lists with gold 8‑point star bullets (custom `::marker`/`::before`), 8px item spacing; blockquote = 2px gold left border, padding‑left 24px, serif italic 24px (styling only — never fictional quotes); links as FE5; images full width with 14px muted caption; tables with 1px `--line` rules and purple‑50 header row; `hr` = ornament divider.
- Pagination: numbered 44px squares, current = purple fill; prev/next text links.

### FE14. Accordion, tabs, breadcrumbs
- **Accordion (FAQs):** each item border‑bottom 1px `--line`; trigger is a full‑width `<button aria-expanded>` 20px serif question with plus icon (gold‑600) that rotates 45° to an ×; panel animates via `grid-template-rows: 0fr → 1fr` 250ms; multiple can be open.
- **Contact pathway tabs:** three large selectable cards (Employer / Candidate / General) with icon, title and one line of text, implemented as an ARIA tablist (arrow keys move, Enter/Space selects), selected = purple‑900 bg + white text + gold top border 3px; URL hash syncs (`#employer`, `#candidate`, `#general`) so links can deep‑link to a tab. Candidate tab panel shows a short message + "Go to candidate registration" button + the general form for questions.
- **Breadcrumbs:** `<nav aria-label="Breadcrumb">` with ordered list; current page `aria-current="page"`, not a link.

### FE15. Motion details
- Reveal: elements with `data-reveal` start `opacity:0; translateY(12px)` **only when JS has added `.js` to `<html>`** (content visible without JS); IntersectionObserver threshold 0.15, rootMargin `0px 0px -10% 0px`; transition 600ms `--ease-out`; children with `data-reveal-stagger` delay 80ms each; observe once.
- Page transitions: View Transitions API cross‑fade 200ms where supported; nothing elsewhere.
- Image hover zoom 1.03 / 600ms; card lift 2px / 250ms; underline grow 250ms; button colour 200ms; menu 250ms.
- Constellation twinkle: 2–3 stars only, opacity 0.6↔1, 5s infinite alternate, staggered.
- Reduced motion: all of the above disabled; elements rendered in final state.

### FE16. Images & media handling
- All via `next/image`, local files in `public/images/<page>/` (downloaded and optimised once, no hot‑linking — works offline on localhost).
- Aspect ratios: hero/feature 4:5 or 3:2, dual panels 4:3, article cards 3:2, article hero 16:9, OG 1200×630.
- `sizes` set per layout (e.g. dual panel `(min-width:1024px) 600px, 100vw`). Placeholder background purple‑50 while loading. Colour grade consistent (slightly warm, lowered saturation ~85%).
- Alt text describes content and purpose (e.g. "Healthcare professional reviewing notes with a colleague in a bright clinic corridor"); decorative SVGs `aria-hidden="true"`.

### FE17. Footer (visual detail)
- Purple‑900; padding 96px top / 32px bottom desktop, 64px / 24px mobile; faint constellation watermark bottom‑right 6% opacity (desktop only).
- Grid ≥1024: 12 cols → col1 span 4 (logo 44px tall + statement in serif italic 22px white 85%, max 28ch), col2 span 2, col3 span 3, col4 span 3. 768–1023: 2×2. Mobile: single column, 40px gaps.
- Column headings: `eyebrow` style in gold‑500 ("Navigate", "Services", "Contact").
- Links: 15px white 78%, 12px vertical spacing, hover white + gold underline.
- Contact rows: lucide `Phone`, `Mail`, `Globe` 18px gold‑500 + value (16px white); each row min 48px tall, full row clickable.
- Bottom bar: border‑top 1px `--line-dark`, padding‑top 24px; left: legal links (13px, white 60%, separated by gold "·"); right: "© {year} Perseus Talent. All rights reserved." (13px white 60%). Mobile: stacked, legal links wrap.

### FE18. States that must exist (no blank or broken screens)
Loading (form submit), success, error, validation, empty (jobs, insights, search results), disabled, 404, JavaScript‑disabled (all content readable, links work, forms show a note "Please enable JavaScript to submit this form, or email/call us" via `<noscript>`), slow images (placeholder colour), long content (long names/emails wrap with `overflow-wrap:anywhere`).

### FE19. Favicon & metadata assets
`icon.svg` (gold monogram on purple rounded square), `favicon.ico` 32px, `apple-icon.png` 180px, `opengraph-image` 1200×630 (purple, wordmark, statement, constellation), `theme-color` meta `#1C052E`.

### FE20. Development style guide route
`/styleguide` (development only, 404 in production) showing every token, type style, button variant/state, form control/state, card, divider, accordion, tabs and the calculator — used to review the design system in Stage 2 before building pages.

---

## PART E — NAVIGATION (header)

- Sticky header, purple #1C052E background, logo left (links to `/`, `aria-label="Perseus Talent — home"`).
- Desktop items (in this exact order): **Home · For Employers · For Candidates · Our Specialisms · About Us · Insights · Contact**, then the gold‑accented button **CALCULATE YOUR FEE** → `/fee-calculator`. The button stands out (gold outline or gold fill) without overpowering the items.
- Active state: gold underline + `aria-current="page"`. `/opportunities/*` marks "For Candidates" active; `/specialisms/*` marks "Our Specialisms"; `/insights/*` marks "Insights".
- Mobile/tablet (<1280px): menu button (`aria-expanded`, `aria-controls`) opens a full‑height panel (purple, subtle geometric pattern) listing all items + the CTA + phone/email; focus trapped inside; `Esc` closes; focus returns to the toggle; body scroll locked; **closes automatically after a link is selected** and on route change.
- Fully keyboard operable; visible focus states; skip link "Skip to main content" as first focusable element.
- Every item works. No dead links. No decorative buttons without function.

---

## PART F — SITE MAP & URLS

| Page | URL |
|---|---|
| Home | `/` |
| For Employers | `/employers` (enquiry form anchor `#enquiry`, calculator anchor `#fee-calculator`) |
| For Candidates | `/candidates` (registration form anchor `#register`) |
| Opportunities (job listings) | `/opportunities`, `/opportunities/[job-slug]` |
| Our Specialisms | `/specialisms`, `/specialisms/healthcare` (+ future `/specialisms/[slug]`) |
| About Us | `/about` |
| Insights | `/insights`, `/insights/[article-slug]`, `/insights/category/[category]` |
| Contact | `/contact` (anchors `#employer`, `#candidate`, `#general`) |
| Calculate Your Fee | `/fee-calculator` |
| Legal | `/privacy-policy`, `/cookie-policy`, `/terms` |
| 404 | branded page with links to Home, Employers, Candidates, Contact |

"Explore Opportunities" buttons → `/opportunities`. "Find Talent" / "Recruit With Perseus" → `/employers`. "Register Your Interest" → `/candidates#register`. "Contact Our Team" → `/contact`. "Discuss Your Recruitment Needs" / "Discuss Your Recruitment Requirements" → `/employers#enquiry` (with prefill when coming from the calculator).

---

## PART G — PAGE‑BY‑PAGE SPECIFICATION

Copy in quotation marks is **official and must be used verbatim** (British English). Copy marked *(draft)* is supplied by this plan to fill sections the brief named without text; it follows the no‑fabrication rule and may be refined by the owner. Items marked **[CONFIRM]** must be confirmed by the owner before launch and are listed in `CONTENT_TODO.md`.

### G1. HOMEPAGE (`/`) — build and polish this first (Stage 3)
Purpose: communicate the proposition immediately and route visitors into the employer or candidate journey.

1. **Hero** — purple background, white headline, restrained gold accents, constellation + faint geometric pattern (or one premium image), strong hierarchy.
   - Eyebrow *(draft)*: "UK Healthcare Recruitment Consultancy" (makes "recruitment consultancy" instantly clear).
   - H1: "The right people. The right opportunities. A better future."
   - Supporting: "Connecting exceptional talent with organisations shaping the future of healthcare."
   - Primary CTA: "Find Talent" (gold) → `/employers`. Secondary CTA: "Explore Opportunities" (outline) → `/opportunities`.
2. **Introduction** (white) — H2 "People are at the heart of every great organisation." Copy:
   "At Perseus Talent, we believe exceptional recruitment goes beyond filling vacancies. It is about understanding people, recognising potential and building connections that create lasting value.
   We bring organisations and talented professionals together through a considered, relationship‑led approach to recruitment.
   Our focus is simple: understanding what organisations need, recognising what professionals can offer and creating connections that move careers and businesses forward."
   Layout: editorial split, large serif heading left, copy right, ornament divider.
3. **Dual audience split** (two equal panels, side by side on desktop, stacked on mobile — equal visual weight):
   - **Employers** — H2 "Talent that moves your business forward." Copy: "Finding the right person can make all the difference.
     We work with organisations to understand their recruitment requirements and identify professionals whose experience, capabilities and ambitions align with their needs.
     From understanding the role to identifying suitable candidates, our approach is built around communication, attention to detail and finding the right fit." CTA "Recruit With Perseus" → `/employers`.
   - **Candidates** — H2 "Your next opportunity starts here." Copy: "Your career deserves more than a job search.
     We believe every professional has a unique combination of experience, ambition and potential.
     Our aim is to connect talented people with opportunities that support their professional development and future ambitions.
     Whether you are actively exploring new opportunities or considering your next career move, Perseus Talent is here to help you take the next step." CTA "Explore Opportunities" → `/opportunities`.
   - Each panel with a relevant image (employer: leadership/meeting setting; candidate: healthcare professional in a real environment).
4. **Our Approach** — H2 "A more considered approach to recruitment." Four steps with large serif gold numerals:
   - 01 — Understand: "We take time to understand the organisation, the position and the people involved."
   - 02 — Identify: "We identify professionals whose experience and capabilities align with the requirements."
   - 03 — Connect: "We facilitate meaningful introductions between employers and candidates."
   - 04 — Deliver: "We support the recruitment process with clear communication and a focus on achieving the right outcome."
   - Small note under steps *(draft)*: "Every recruitment brief is different, and we adapt our approach to each one." (prevents implying an identical process every time).
5. **Pricing promotion** (purple band, geometric pattern) — H2 "Recruitment pricing without the guesswork." Copy: "We believe recruitment fees should be straightforward and transparent.
   Our standard recruitment fee is calculated at a flat rate of 15% of the successful candidate's annual gross base salary.
   Use the Perseus Fee Calculator to receive an immediate estimate." Large "15%" typographic feature in gold. CTA "Calculate Your Fee" → `/fee-calculator`. Optionally a compact inline calculator teaser.
6. **Latest Insights** (only rendered if ≥1 published article exists) — 3 article cards + "View all insights".
7. **Final CTA** — H2 "Great opportunities begin with a conversation." Copy: "Whether you're looking to strengthen your organisation or take the next step in your career, let's start a conversation." Buttons: "Contact Our Team" → `/contact`; "Explore Opportunities" → `/opportunities`.
8. Footer (G12).

### G2. FOR EMPLOYERS (`/employers`)
- Hero: H1 "Find the people who move your business forward."
- Intro: "The right people make a meaningful difference to every organisation.
  At Perseus Talent, we work with employers to understand their requirements and connect them with professionals who bring the experience, capabilities and potential needed to contribute to their organisation.
  We believe successful recruitment starts with understanding the people behind the position."
- Hero CTAs: "Discuss Your Recruitment Needs" → `#enquiry`; "Calculate Your Fee" → `#fee-calculator` (prominent calculator link).
- Required sections, in order (copy *(draft)*, no unverifiable claims):
  1. **Our recruitment approach** — the four stages (reuse ProcessSteps component) framed for employers.
  2. **Understanding your requirements** — "Every successful hire begins with a clear brief. We take time to understand the role, the responsibilities, the team it sits within and the qualities that will help someone succeed in your organisation."
  3. **Identifying suitable candidates** — "We look for professionals whose experience, capabilities and ambitions genuinely align with your requirements, focusing on fit rather than volume."
  4. **Candidate assessment and screening** — "Before introducing a candidate, we review their experience against your brief and discuss the opportunity with them to understand their motivations and suitability." **[CONFIRM]** exact screening steps (e.g. right‑to‑work, reference or registration checks) before stating any specific check.
  5. **Communication throughout the recruitment process** — "You can expect clear, timely updates at each stage, from shortlist to offer, so you always know where your recruitment stands."
  6. **Our pricing model** — "A flat 15% of the successful candidate's annual gross base salary. No tiers and no complicated pricing structures. Final fees, payment terms and applicable conditions are confirmed in a written recruitment agreement." **[CONFIRM]** payment terms / rebate or replacement policy (show placeholder, don't invent).
  7. **Recruitment fee calculator** — embedded `<FeeCalculator variant="embedded" />` (same component as the dedicated page) at `#fee-calculator`.
  8. **Employer enquiry form** at `#enquiry` (spec in §I1).
- Employer CTA band: H2 "Let's find your next great hire." Button "Discuss Your Recruitment Needs" → `#enquiry`.

### G3. FOR CANDIDATES (`/candidates`)
- Hero: H1 "Your next opportunity starts here."
- Intro: "Your professional journey is unique.
  At Perseus Talent, we aim to connect ambitious professionals with organisations offering meaningful career opportunities.
  We take the time to understand your experience, career ambitions and what matters to you in your next move.
  Whether you are actively looking or simply exploring what comes next, we welcome the opportunity to connect."
- Hero CTAs: "Register Your Interest" → `#register`; "Explore Opportunities" → `/opportunities`.
- Required sections, in order:
  1. **Why connect with Perseus Talent?** *(draft)* — three or four short points: a personal, relationship‑led approach; time taken to understand your ambitions; honest, clear communication; opportunities considered against what matters to you. (No claims about network size or success rates.)
  2. **Our candidate approach** — four steps: Conversation → Understanding your goals → Relevant opportunities → Support through the process. *(draft)*
  3. **Career opportunities** — preview of latest 3 jobs from `/content/jobs`, or the empty state (§J) + "View all opportunities" → `/opportunities`.
  4. **Candidate registration** + 5. **CV submission** — one combined form at `#register` (spec §I2) with clear explanation that the CV is uploaded within registration.
  6. **Candidate FAQs** (accessible accordion) *(draft)*:
     - "Do I have to pay to register?" — "No. We do not charge candidates for helping them find work." **[CONFIRM]** (UK agency rules generally prohibit charging work‑seekers fees).
     - "What happens after I register?" — "We review your details and, where we have or expect to have a relevant opportunity, a member of our team will be in touch. Registering does not guarantee an interview or placement."
     - "Will you share my CV without asking me?" — "We will discuss an opportunity with you before your CV is sent to an employer." **[CONFIRM]**
     - "Which file types can I upload?" — "PDF, DOC or DOCX, up to 4MB."
     - "I'm not actively looking. Can I still register?" — "Yes. You're welcome to register and tell us what your next move might look like."
     - "How is my information used and can I ask for it to be deleted?" — summary + link to Privacy Policy + email address.
- Candidate CTA band: H2 "Let's take the next step together." Button "Register Your Interest" → `#register`.
- Never promise a job, interview or placement anywhere on this page.

### G4. OUR SPECIALISMS (`/specialisms` and `/specialisms/[slug]`)
- Hero: H1 "Specialist knowledge. Meaningful connections."
- Intro: "Understanding a sector is essential to understanding its people.
  Perseus Talent focuses on connecting organisations with professionals whose skills, experience and ambitions align with their recruitment needs.
  Healthcare is our primary area of focus, with a structure designed to accommodate further professional sectors as the business develops."
- **Healthcare** = featured primary specialism (large card/feature panel → `/specialisms/healthcare`). Its detail page describes the relationship‑led approach applied to healthcare organisations and professionals, with an editable **[PLACEHOLDER — specific healthcare disciplines/roles Perseus Talent recruits for, to be confirmed by the owner]** block. Do not list invented disciplines, networks or expertise.
- Data‑driven: each specialism is an MDX file in `content/specialisms/` (front‑matter: `title, slug, summary, order, primary: boolean, status: 'active'|'coming-soon', image`). Adding a sector = add one file; the page and sitemap update automatically. Ship only Healthcare as active; no fake "coming soon" sectors unless the owner names them.
- CTA: "Discuss Your Recruitment Requirements" → `/employers#enquiry`.

### G5. ABOUT US (`/about`)
- Hero: H1 "Built on ambition. Driven by people."
- Intro: "Perseus Talent was established with a clear belief: great organisations are built by great people.
  We approach recruitment as a relationship, not simply a transaction.
  By taking the time to understand both organisations and professionals, we aim to create connections that deliver meaningful and lasting value.
  Our ambition is to build a recruitment consultancy recognised for its professionalism, attention to detail and commitment to people."
- Required sections:
  - **Our story** — short brand‑level copy *(draft)* about why the business exists (belief in people, relationship‑led recruitment) + **[PLACEHOLDER — founding date, founder name/photo/biography to be supplied]**. No invented history.
  - **Our philosophy** — recruitment as a relationship; quality of fit over volume *(draft)*.
  - **Our values** (5 cards, 8‑point‑star icons):
    - Integrity — "Acting honestly, professionally and responsibly."
    - Understanding — "Taking the time to understand people and organisations."
    - Excellence — "Maintaining high standards throughout the recruitment process."
    - Relationships — "Building meaningful professional connections."
    - Ambition — "Always looking for opportunities to improve and progress."
  - **Our approach** — reuse the four‑stage ProcessSteps.
  - **Our vision** — "To build a recruitment consultancy recognised for its professionalism, attention to detail and commitment to people." *(draft, derived from the intro)*.
  - Optional "The name" note *(draft)*: one elegant sentence on the Perseus constellation as a symbol of navigation and guidance — brief, not mythological storytelling.
- CTA band → Contact.

### G6. INSIGHTS (`/insights`, `/insights/[slug]`, `/insights/category/[category]`)
- Hero: H1 "Perspectives on people, careers and recruitment."
- Layout: featured article (large image + title + excerpt), category filter chips, grid of article cards (image, category, title, excerpt, publication date `<time datetime>`, reading time), pagination when >9.
- Categories (fixed list in config): Healthcare Recruitment, Recruitment Industry, Employer Guidance, Candidate Advice, Career Development, Interview Preparation, Talent Acquisition, Professional Insights.
- Article page: breadcrumb, H1, date, category, reading time, body (MDX with styled typography), share links (copy link/LinkedIn/email — no tracking scripts), related articles, CTA band, Article JSON‑LD.
- Front‑matter: `title, slug, excerpt, category, date, updated?, author (default "Perseus Talent"), image, imageAlt, featured, status: 'draft'|'published'`.
- **Drafts:** write 3 genuinely useful, evergreen *draft* articles (e.g. "Preparing for a healthcare interview: a practical checklist", "Writing a clear job brief: what to tell your recruiter", "Understanding recruitment fees: how a flat‑rate model works") — no news, no statistics, no quotes attributed to anyone. Each is `status: 'draft'` with a visible **"DRAFT — not yet published"** badge. Drafts render only in development/preview; **production excludes drafts** unless `SHOW_DRAFTS=true`, and drafts are always `noindex`. If no published articles exist in production, the page shows a polished empty state: "Insights are coming soon. In the meantime, get in touch to start a conversation." with Contact CTA, and the homepage Insights strip is hidden.

### G7. CONTACT (`/contact`)
- Hero: H1 "Let's start a conversation." Supporting: "Whether you're looking to strengthen your team, explore your next career opportunity or simply learn more about Perseus Talent, we'd be pleased to hear from you."
- Official contact details displayed **prominently** (large, tappable): Telephone 07555004374 (`tel:+447555004374`), Email Perseustalent@gmail.com (`mailto:`), Website Perseustalent.co.uk (`https://perseustalent.co.uk`). No address, no map, no opening hours unless supplied **[CONFIRM]**.
- Three enquiry pathways as three cards / an accessible tab set:
  - A. **Employer enquiries** → renders the Employer enquiry form (or links to `/employers#enquiry`).
  - B. **Candidate enquiries** → links to the Candidate registration form (`/candidates#register`) and offers the general form for questions.
  - C. **General enquiries** → General enquiry form (§I3).
- Clear validation and honest confirmation messages (§I4).

### G8. THE PERSEUS FEE CALCULATOR (`/fee-calculator` + embedded on `/employers`)
One of the most important commercial features. Must be genuinely functional.
- Official name displayed: **THE PERSEUS FEE CALCULATOR**.
- H1: "Transparent recruitment pricing. No guesswork."
- Supporting: "Calculate your recruitment fee in seconds.
  Enter the annual salary of your intended hire and discover your estimated recruitment fee using our straightforward 15% flat‑rate pricing model."
- **Formula:** `Recruitment Fee = Annual Gross Base Salary × 0.15`. No tiers. No alternative percentages. Rate read from `site.fee.rate` only.
- **Input:** one prominent field. Label: "Enter the annual gross base salary". Fixed "£" prefix (GBP). Placeholder: "e.g. 40,000". `inputmode="decimal"`, `autocomplete="off"`. Thousands separators formatted on blur; accepts "40000", "40,000", "£40,000", "40000.50".
- **Live calculation** as the user types (no submit button needed), results in an `aria-live="polite"` region.
- **Results (in this order), recruitment fee excluding VAT is the primary, largest figure:**
  1. Annual salary — £40,000.00
  2. Recruitment percentage — 15%
  3. **Recruitment fee (excluding VAT) — £6,000.00** ← primary
  4. VAT (20%, illustrative) — £1,200.00 — *only when VAT is enabled*
  5. Total including illustrative VAT — £7,200.00 — *only when VAT is enabled*
- **VAT is configurable**: `site.fee.vat.enabled` (default **false**, because VAT registration is unconfirmed). When enabled, lines 4–5 appear labelled "illustrative" with the note "VAT shown for illustration only and applies only where Perseus Talent is VAT registered." Never imply the VAT‑inclusive total is automatically the amount payable. (The owner sets the flag; visitors do not toggle it.)
- **Maths:** compute in integer pence to avoid floating‑point errors: `feePence = Math.round(salaryPence × 15 / 100)`; VAT likewise; format with `Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP', minimumFractionDigits:2})`.
- **Validation** (messages shown inline, linked to the input, announced to screen readers):
  - Empty → no result shown (show the neutral prompt "Enter a salary to see your estimated fee"), never £0.00 as if calculated.
  - Letters/invalid characters → "Please enter the salary using numbers only, for example 40,000."
  - Negative/zero → "Please enter a salary greater than £0."
  - Below £1,000 or above £10,000,000 (configurable) → "Please enter an annual salary between £1,000 and £10,000,000."
  - More than 2 decimal places → rounded to pence or error (choose: rounded).
- **CTA after a valid calculation:** "Discuss Your Recruitment Needs" → `/employers?salary=40000#enquiry`. The employer form reads `salary`, pre‑fills "Expected annual salary" and shows the recalculated estimated fee as read‑only context ("Estimated fee: £6,000.00 excl. VAT — indicative only"). The fee is recalculated server‑side, never trusted from the URL. Nothing is sent automatically. Never call the estimate a quote.
- **Disclaimer** (always visible under results): "All calculations are indicative and based on a flat 15% recruitment fee applied to annual gross base salary. VAT is additional where applicable. Final fees, payment terms and applicable conditions will be confirmed in a written recruitment agreement.
  The calculation is based on annual gross base salary and does not automatically include bonuses, commission or additional benefits."
- Design: premium purple card with gold hairline, big serif figure for the fee; on mobile the result card sits directly under the input.
- Page also includes a short "How our fee works" explainer and an FAQ‑style "What counts as annual gross base salary?" note *(draft)*: base salary before tax, excluding bonuses, commission and benefits (consistent with the disclaimer).

### G9. LEGAL PAGES (`/privacy-policy`, `/cookie-policy`, `/terms`)
Editable drafts with a visible banner at top: "**Draft — this document requires professional legal review before publication.**" Never claim legal compliance is certified. Also list in `CONTENT_TODO.md`.
- **Privacy Policy** (UK GDPR & Data Protection Act 2018) must cover: who we are (+ **[PLACEHOLDER]** legal entity name, registered address, ICO registration number), what personal data is collected (enquiries, candidate registrations, CVs, special‑category data that may appear in CVs), purposes and lawful bases (e.g. legitimate interests / steps prior to contract / consent where relevant), candidate data and sharing CVs with prospective employers (with the candidate's agreement), employer enquiries, CV uploads and how they are transmitted/stored (email delivery via Resend, no public storage), retention periods **[PLACEHOLDER, e.g. candidate data reviewed after X months]**, data subject rights (access, rectification, erasure, restriction, objection, portability) and how to exercise them, third‑party processors (hosting provider, Resend, Cloudflare Turnstile, Gmail/Google), international transfers, security, complaints to the ICO, privacy contact (Perseustalent@gmail.com).
- **Cookie Policy** — states that only strictly necessary cookies/technologies are used at launch (Turnstile anti‑spam), none for analytics/advertising; describes how consent will be requested if analytics are added (PECR).
- **Terms and Conditions** (website terms of use) — use of site, content accuracy, calculator estimates are indicative and not offers, no guarantee of placement, intellectual property, links, liability limitations, governing law (England & Wales **[CONFIRM]**). Separate employer Terms of Business are **not** website content — flag as needed **[CONFIRM]**.

### G10. OPPORTUNITIES / JOB LISTINGS (`/opportunities`, `/opportunities/[slug]`) — see Part J.

### G11. 404 page
Purple, constellation motif, "This page has drifted out of orbit." *(draft)* with links Home / For Employers / For Candidates / Contact.

### G12. FOOTER (mandatory on every page, at the very bottom)
- Background #1C052E, text #FFFFFF, accents #C5A15B. Premium, elegant, uncluttered; faint constellation or geometric watermark.
- **Desktop 4 columns:**
  1. Logo **PERSEUS TALENT** + statement "The right people. The right opportunities. A better future."
  2. Website navigation: Home, For Employers, For Candidates, Our Specialisms, About Us, Insights, Contact, Calculate Your Fee.
  3. Recruitment services *(draft labels)*: Employer Recruitment (`/employers`), Healthcare Recruitment (`/specialisms/healthcare`), Candidate Registration (`/candidates#register`), Current Opportunities (`/opportunities`), Fee Calculator (`/fee-calculator`).
  4. Contact: Telephone **07555004374** (`tel:+447555004374`), Email **Perseustalent@gmail.com** (`mailto:Perseustalent@gmail.com`), Website **Perseustalent.co.uk** (`https://perseustalent.co.uk`) — gold icons, all values pulled from `site.ts`.
- **Mobile:** sections stacked neatly; phone/email/website as large tappable rows (≥48px).
- **Bottom bar (absolute bottom):** Privacy Policy · Cookie Policy · Terms and Conditions · "© {current year} Perseus Talent. All rights reserved." — year computed dynamically (`new Date().getFullYear()`), never hardcoded.
- No social media icons, company numbers, addresses or extra phone numbers unless supplied later (slots exist in config, hidden when empty).

---

## PART I — FORMS & LEAD GENERATION (must truly work)

All forms: Zod schema shared client+server; labels always visible; required fields marked in text; inline + summary errors; `autocomplete` attributes (name, email, tel, organization, address-level2); privacy notice line with link to Privacy Policy; consent checkbox where stated; hidden honeypot; Turnstile widget; submit button shows a loading state and is disabled while sending; double‑submit prevented.

### I1. Employer enquiry form (`/employers#enquiry`, also on `/contact`)
| Field | Type | Rules |
|---|---|---|
| Full name | text | required, 2–100 chars |
| Company name | text | required, 2–150 |
| Business email | email | required, valid email |
| Telephone number | tel | required, valid UK/international number |
| Job title or position to be filled | text | required, 2–150 |
| Expected annual salary | text (decimal, £ prefix) | required, same rules as calculator; prefilled from `?salary=` |
| Estimated fee | read‑only display | auto, indicative, excl. VAT |
| Additional information | textarea | optional (brief lists it; kept optional to reduce friction), ≤3000 chars |
| Privacy acknowledgement | checkbox | required: "I have read the Privacy Policy and agree to Perseus Talent contacting me about this enquiry." |

### I2. Candidate registration + CV submission (`/candidates#register`)
| Field | Type | Rules |
|---|---|---|
| Full name | text | required |
| Email address | email | required |
| Telephone number | tel | required |
| Current location | text | required (town/city, region) |
| Professional specialism | select: "Healthcare", "Other (please specify)" + text field when Other | required — no invented sub‑disciplines |
| Current position | text | required |
| Preferred opportunities | text + optional checkboxes (Permanent, Fixed‑term contract, Temporary, Part‑time, Full‑time) | optional |
| CV upload | file | required; PDF/DOC/DOCX; ≤4MB (keeps under serverless request limits); drag‑and‑drop + button; shows file name/size; remove/replace |
| Additional information | textarea | optional |
| Consent | checkbox, required | "I consent to Perseus Talent processing my details and CV to consider me for suitable opportunities, as described in the Privacy Policy. I understand that registering does not guarantee an interview or placement." |
Privacy notice above submit summarising how data is used, retained and how to request deletion.

### I3. General enquiry form (`/contact#general`)
Full name (required), Email address (required), Telephone number (optional — not essential for a general enquiry), Enquiry type (required select: Employer enquiry / Candidate enquiry / General enquiry / Other), Message (required, 10–3000 chars), privacy acknowledgement.

### I4. Submission behaviour — honesty is mandatory
- Route handlers: `POST /api/enquiries/{employer|candidate|general}`.
- Server steps: rate‑limit check → honeypot & time‑trap → Turnstile verify (if `TURNSTILE_ENABLED`) → Zod validate → sanitise (trim, strip control chars, HTML‑escape every value in the email template) → (candidate) file checks: extension + MIME + **magic bytes** (`%PDF`, `D0 CF 11 E0` for .doc, ZIP containing `word/document.xml` for .docx), size ≤4MB, random server‑side filename → hand to the delivery adapter selected by `FORM_DELIVERY` (Part LH).
- The API response always states what actually happened: `{ ok: true, delivery: 'local' | 'email' }` or an error. The UI copy matches it exactly:
  - `email` (smtp/resend confirmed with a message id): "Thank you — your enquiry has been sent. We'll be in touch." / candidate: "Thank you — your registration has been received. If we have a suitable opportunity, we'll be in touch."
  - `local` (localhost development mode): same thank‑you heading plus a clearly visible development note: "Development mode: this submission was saved on this computer and has **not** been emailed." — never claim it was sent.
- On failure: clear error, form data preserved, and fallback "Please try again or email us at Perseustalent@gmail.com / call 07555004374."
- If the chosen mode's credentials are missing (e.g. `smtp` without an App Password): API returns 503 and the UI says "Online enquiries are temporarily unavailable. Please email or call us." — **never a fake success**.
- CVs are never written to `public/`, logs or any served location; logs never contain personal data (log only request id + outcome).

---

## PART LH — LOCALHOST‑FIRST OPERATION (no host, no domain yet)

**Goal:** the owner runs `npm install` then `npm run dev`, opens `http://localhost:3000`, and every page and feature works — without creating any account or paying for anything.

1. **Delivery adapters** (`src/lib/delivery/{local,smtp,resend}.ts`, common interface `deliver(submission) → { ok, delivery, id }`):
   - `local` (default): writes `submission.json` (+ the CV file, renamed to a random id with its validated extension) into `./.local-submissions/<YYYY-MM-DD_HHmmss>_<type>_<id>/`. The folder is in `.gitignore`, sits outside `public/`, and is never served by Next.js. This adapter **refuses to run when `NODE_ENV=production` on a non‑localhost URL** (prevents accidental storage on a future server).
   - `smtp`: Nodemailer over Gmail SMTP (`smtp.gmail.com:465`, TLS) authenticated with a **Google App Password** for Perseustalent@gmail.com (requires 2‑Step Verification; the owner creates the App Password themselves and pastes it into `.env.local` — the AI must not handle the owner's credentials). Sends from and to Perseustalent@gmail.com with `reply-to` = enquirer and the CV attached. Real emails from localhost, no domain needed. Acknowledgement emails to enquirers are optional (`SEND_ACKNOWLEDGEMENT=false` by default).
   - `resend`: for later, once `perseustalent.co.uk` is live and verified (SPF/DKIM/DMARC).
2. **Dev submissions viewer:** `/dev/submissions` — available **only** when `NODE_ENV=development`, otherwise 404. Lists locally saved submissions (type, date, name, email) with a link to download each CV through an API route that also only works in development. Lets the owner test the full journey on localhost.
3. **Turnstile:** off by default (`TURNSTILE_ENABLED=false`). Honeypot, time‑trap and rate limit still active. Cloudflare's published test keys may be used to test the widget locally.
4. **URLs & SEO on localhost:** all canonicals, sitemap entries, Open Graph URLs and JSON‑LD URLs are built from `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`) — never hardcoded. While `NEXT_PUBLIC_ALLOW_INDEXING=false`, `robots.txt` returns `Disallow: /` and every page has `<meta name="robots" content="noindex">`; flipping to `true` at launch removes both. `sitemap.xml` and `robots.txt` still generate and are viewable at `http://localhost:3000/sitemap.xml` and `/robots.txt`.
5. **Official website link:** the footer/contact "Perseustalent.co.uk" link still points to `https://perseustalent.co.uk` exactly as the brief requires. It will not load until the domain is purchased and live — this is expected and listed in `CONTENT_TODO.md`, not a bug.
6. **Offline‑safe assets:** fonts self‑hosted via `next/font` (downloaded at install/build), all images stored locally in `public/images/`, no runtime CDN dependencies. After `npm install`, the site runs without internet (except `smtp` sending).
7. **Scripts in `package.json`:** `dev`, `dev:lan` (`next dev -H 0.0.0.0` for phone testing on the same Wi‑Fi), `build`, `start`, `lint`, `typecheck`, `test` (Vitest), `test:e2e` (Playwright, starts the app itself on port 3000), `check:links`, `check:a11y`, `verify` (runs lint + typecheck + unit + build + e2e in sequence).
8. **Windows friendliness:** the owner's machine is Windows 11 — use cross‑platform scripts only (no `rm -rf`/bash‑only syntax; use Node scripts or `rimraf`), paths via `path.join`, and document commands for PowerShell.
9. **Going live later (documented in README, not done now):** buy/point domain → choose host (Vercel Pro or Netlify) → set `NEXT_PUBLIC_SITE_URL=https://perseustalent.co.uk`, `NEXT_PUBLIC_ALLOW_INDEXING=true`, `FORM_DELIVERY=smtp` or `resend`, Turnstile keys → redeploy. No code changes required.

---

## PART J — JOB LISTINGS ARCHITECTURE

- Each vacancy = `content/jobs/<slug>.mdx`. Front‑matter (Zod‑validated): `title, slug, employerName? (only if disclosure authorised), employerDisclosed: boolean, location, region?, salaryMin?, salaryMax?, salaryText?, employmentType ('Permanent'|'Contract'|'Temporary'|'Part-time'|'Full-time'), specialism (must match a specialism slug), datePosted, validThrough?, status ('open'|'closed'|'draft'), requiredExperience, requiredQualifications?, applicationInstructions`. Body = job description.
- `/opportunities`: keyword search (title/location/description, client‑side, debounced), filters for **location**, **specialism**, **employment type** (state synced to URL query so results are shareable/back‑button friendly), result count announced via `aria-live`, "Clear filters".
- `/opportunities/[slug]`: title, employer (or "Confidential employer"), location, salary, type, description, experience, qualifications, application instructions, **"Apply for this role"** → `/candidates?job=<slug>#register` (prefills a hidden "Applying for" field), plus `JobPosting` JSON‑LD (only for real, open jobs).
- Closed jobs: page stays but shows "This role is no longer accepting applications" and is excluded from listings and sitemap.
- **Ship with zero vacancies** (do not invent any). Empty state (styled, with constellation motif):
  "New opportunities are on the horizon.
  Register your interest with Perseus Talent and let us know what your next career move looks like." + button "Register Your Interest" → `/candidates#register`.
- Include one `status: 'draft'` example job file named `_example-job.mdx` (excluded from all builds) purely as a template for the owner, documented in README.

---

## PART K — SEO & DIGITAL MARKETING

- Unique `<title>` (pattern "Page Name | Perseus Talent", homepage "Perseus Talent | UK Healthcare Recruitment Consultancy") and unique meta description (≤155 chars) per page, set via Next.js `metadata`.
- Canonical URLs on every page (absolute, built from `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` now, `https://perseustalent.co.uk` at launch; no trailing‑slash duplicates). At launch: force HTTPS and a single host (recommend apex, redirect www).
- Indexing blocked while on localhost (`NEXT_PUBLIC_ALLOW_INDEXING=false`, see Part LH).
- Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`), one H1 per page, logical headings, descriptive URLs (Part F), descriptive link text (never "click here").
- Open Graph + Twitter card metadata with branded OG image per page type.
- `sitemap.xml` (auto‑generated incl. published articles, open jobs, specialisms; excludes drafts/closed) and `robots.txt` (allow all, link sitemap; disallow `/api/`).
- Structured data (JSON‑LD): `Organization`/`EmploymentAgency` (name, url, email, telephone, logo — **no address** until supplied), `WebSite`, `BreadcrumbList`, `Article` for insights, `JobPosting` for real open jobs only, `FAQPage` on candidate FAQs.
- Internal linking between employers ↔ calculator ↔ specialisms ↔ insights ↔ candidates.
- Fast images (Part D7), British English, natural copy, no keyword stuffing.
- Search themes to weave in naturally: UK healthcare recruitment; healthcare recruitment consultancy; professional recruitment services; recruitment consultants UK; employer recruitment services; candidate recruitment opportunities. **No specific towns/regions** until the owner confirms target areas. No claims about rankings or guaranteed search performance.

---

## PART L — LEGAL, PRIVACY & COMPLIANCE (implementation)

- Legal page drafts per §G9, all marked for professional review.
- No non‑essential cookies/trackers at launch ⇒ no consent banner needed. If analytics are later required: either a cookieless tool (e.g. Plausible/Fathom) documented in the Cookie Policy, or a consent banner with "Accept" and "Reject" equally prominent, scripts loaded **only after** consent, preference stored, and a "Cookie settings" link in the footer. Never fire non‑essential tracking before consent.
- Data minimisation: no database. On localhost, submissions are kept only in the private git‑ignored `.local-submissions/` folder on the owner's computer (delete test data before launch); once emailing is enabled, CVs are attached to emails and not stored on the server.
- Data subject requests handled via Perseustalent@gmail.com (documented in privacy policy).
- Flag to owner (not legal advice): ICO data protection fee registration, Employment Agencies Act 1973 / Conduct of Employment Agencies and Employment Businesses Regulations 2003 (e.g. terms of business with employers, no fees to work‑seekers), Companies Act website disclosure requirements if trading as a limited company.

---

## PART M — SECURITY & ACCESSIBILITY

**Security:** server‑side validation on every endpoint; input sanitisation and HTML escaping in emails; strict file type/size/magic‑byte checks; no secrets in client code or repo; `.env*` git‑ignored; security headers via `next.config` (Content‑Security‑Policy allowing self + Turnstile, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `frame-ancestors 'none'`); rate limiting; Turnstile; honeypot; generic error messages (no stack traces to users); dependency audit (`npm audit`) before launch.

**Accessibility (target WCAG 2.2 AA):** full keyboard navigation; visible focus indicators (≥2px, high contrast, not obscured by sticky header — use `scroll-margin-top`); skip link; semantic landmarks; colour contrast per D1; accessible labels, errors (`aria-invalid`, `aria-describedby`, error summary); target size ≥24×24 (aim 44×44); descriptive link text; alt text; `aria-live` for calculator results, job‑filter counts and form status; accordion and mobile menu follow WAI‑ARIA patterns; respects `prefers-reduced-motion`; page `lang="en-GB"`; zoom to 200% and 320px reflow without loss.

---

## PART N — PERFORMANCE & QUALITY TARGETS

- Static generation for all content pages; JS only where interactive (header menu, calculator, forms, job filters, accordions).
- Optimised responsive images (AVIF/WebP), lazy loading below the fold, hero image `priority`.
- Self‑hosted subset fonts with `display: swap`, max 2 families.
- Minimal dependencies (no UI kits, no animation libraries, no jQuery).
- Targets (mobile Lighthouse): Performance ≥90, Accessibility ≥95 (aim 100), Best Practices ≥95, SEO 100. Core Web Vitals: LCP <2.5s, CLS <0.1, INP <200ms.
- No horizontal overflow at 320 / 375 / 414 / 768 / 1024 / 1280 / 1440 / 1920 px.

---

## PART O — BUILD WORKFLOW (follow in order; don't rush into one unstructured implementation)

1. **Stage 1 – Discovery:** confirm empty project & toolchain (Node 24, npm 11, Git 2.55 present on Windows 11); scaffold Next.js + TS + Tailwind + ESLint/Prettier inside `C:\Users\nekba\Desktop\Perseus`; git init; create `site.ts`, `.env.example` (localhost defaults), `.gitignore` (incl. `.env*.local`, `.local-submissions/`), `CONTENT_TODO.md`. Confirm `npm run dev` serves `http://localhost:3000`. List only information that genuinely blocks work (none blocks the build — missing facts become placeholders).
2. **Stage 2 – Design system:** tokens exactly as FE1–FE3, fonts, buttons (FE5), form controls (FE10), cards (FE9), ornament, logo/monogram/favicon/OG image (D6, FE19), header + mobile nav (FE4), footer (FE17), Section/Container, breakpoints, reveal hook (FE15). Build the development‑only `/styleguide` route (FE20) and review every component/state at 375 and 1440 before continuing.
3. **Stage 3 – Homepage:** build fully (G1), review on mobile and desktop, refine until the visual identity and quality are right **before** continuing.
4. **Stage 4 – Remaining pages:** Employers, Candidates, Specialisms (+ Healthcare), About, Insights (+ article + category), Contact, Fee Calculator, Opportunities (+ job page), legal pages, 404.
5. **Stage 5 – Functionality:** fee calculator logic + tests, employer/candidate/general forms + API routes, CV upload, delivery adapters (`local` working end‑to‑end; `smtp` ready for an App Password; `resend` stubbed and tested with a mock), `/dev/submissions` viewer, optional Turnstile, job search/filters, active nav, contact links, prefill flows, responsive interactions.
6. **Stage 6 – Content:** complete all copy; remove every placeholder except clearly identified owner‑supplied business information (all of which is listed in `CONTENT_TODO.md`); image selection + alt text + credits; meta titles/descriptions.
7. **Stage 7 – QA:** run every test in Part P; fix all issues.
8. **Stage 8 – Final review:** review the whole site as an independent premium agency — flag and fix anything generic, amateurish, inconsistent or commercially weak (e.g. repetitive centred layouts, weak CTAs, inconsistent spacing, gold overuse, stocky images, mythological overreach) before declaring done.

---

## PART P — VERIFICATION (how "done" is proven)

- **Unit (Vitest):** `fee.ts` — £40,000 → fee £6,000.00, VAT £1,200.00, total £7,200.00; £33,333.33 → £5,000.00; £1,000 → £150.00; empty → no result; "abc", "-5", "0", "£20,000,001" → correct errors; "£40,000" and "40,000.5" parse correctly; VAT lines absent when `vat.enabled=false`. Zod schemas: valid/invalid emails, phones (07555004374, +44 7555 004374 valid; "12345" invalid), salary rules. File checker: real PDF/DOCX pass; renamed `.exe`→`.pdf`, 5MB file, `.png` rejected.
- **E2E (Playwright against `http://localhost:3000`, both `next dev` and `next build && next start`; desktop 1440 + mobile 375):** every header, footer and in‑page link returns 200 (crawler over all internal hrefs — no broken links; the external `https://perseustalent.co.uk` link is checked for exact href only, since the domain is not live); mobile menu opens, traps focus, closes on Esc and after selecting a link; active nav state correct on each page; "Calculate Your Fee" button reaches `/fee-calculator`; calculator updates live and CTA pre‑fills the employer form; forms show inline errors for empty/invalid input; each form submitted in `local` mode creates the expected folder/files in `.local-submissions/` and the UI shows the "saved on this computer, not emailed" note; `smtp`/`resend` adapters tested with mocked transports; missing‑credentials path returns 503 and shows the honest "unavailable" message; `/dev/submissions` and `/styleguide` return 404 in production mode; CV upload accepts PDF and rejects invalid types; job empty state renders with zero jobs; with a temporary test job file, search and each filter work and job page renders; `tel:` and `mailto:` hrefs are exactly `tel:+447555004374` / `mailto:Perseustalent@gmail.com`; footer present and last element on every page with dynamic year; no horizontal overflow at all widths in Part N (`document.documentElement.scrollWidth <= innerWidth`); zero console errors; no broken images.
- **Accessibility:** axe‑core scan on every page (0 serious/critical); manual keyboard pass (tab order, focus visible, skip link); reduced‑motion check; 200% zoom.
- **Performance/SEO:** Lighthouse mobile + desktop on Home, Employers, Fee Calculator, Candidates; validate JSON‑LD (Rich Results Test); confirm sitemap/robots; check unique titles/descriptions via a script.
- **Content audit:** grep for "lorem", "TODO" outside `CONTENT_TODO.md`, invented numbers/claims, American spellings; confirm no testimonials rendered; confirm contact details only come from `site.ts`.
- **Visual review:** screenshots of each page at 375 / 768 / 1440 compared against the design rules (purple primary, white content, restrained gold, consistent type).

---

## PART Q — FINAL ACCEPTANCE CRITERIA (from the brief — all must be ✔)

**Branding:** #1C052E used consistently · white used appropriately · gold restrained · typography consistent · professional branding.
**Navigation:** all menu links work · desktop nav works · mobile nav works · fee calculator CTA works.
**Content:** every main page has complete copy · British English · no lorem ipsum · no fake testimonials · no invented achievements · all CTAs meaningful.
**Calculator:** 15% flat fee correct · salary input works · results update immediately · VAT configurable · invalid input handled · results formatted (£, 2dp) · employer enquiry CTA works.
**Contact:** telephone, email, website correct · tel/mailto/website links work · contact details at the very bottom of every page.
**Functionality:** forms validate · submission status honest · CV uploads secure · job listings function · no dead buttons · no broken links.
**Technical:** responsive across devices · no critical console errors · no broken images · good loading performance · accessibility basics tested · SEO fundamentals implemented.

Do not declare anything functional unless it has actually been implemented **and** tested.

---

## PART R — FINAL HAND‑OVER REPORT (the building AI must provide at the end)

1. Summary of what has been built.
2. List of completed pages.
3. List of working features (each verified by a named test).
4. Backend integrations still required, expected to include: (now, optional) Google App Password for Perseustalent@gmail.com to switch forms from `local` to real `smtp` email on localhost; (at launch) domain purchase, hosting account (Vercel Pro or Netlify) and DNS, optional Resend with `perseustalent.co.uk` verified (SPF/DKIM/DMARC), Cloudflare Turnstile keys, optional consent‑gated analytics, optional private candidate database/storage.
5. Business information still needed before launch (also in `CONTENT_TODO.md`):
   - Legal entity type, registered company name/number and registered office address (if a limited company), ICO registration number.
   - VAT registration status/number (to switch the calculator VAT flag).
   - Payment terms, rebate/replacement policy and employer Terms of Business.
   - Founder/team names, photos and biographies; founding date; real "Our story" details.
   - Specific healthcare disciplines/roles recruited for; any additional specialisms; confirmed target geographic areas.
   - Screening checks actually performed; confirmation of candidate‑facing statements marked [CONFIRM].
   - Data retention periods; legal review of Privacy Policy, Cookie Policy and Terms.
   - Approved photography (or approval of selected images); final professional logo if commissioned.
   - Real vacancies; real articles; real testimonials (only with written consent); social media accounts (if any); opening hours (if wanted).
   - Recommendation: a domain email address (e.g. hello@perseustalent.co.uk) for credibility — the displayed address stays Perseustalent@gmail.com until the owner decides otherwise.
6. Instructions for running (PowerShell, in `C:\Users\nekba\Desktop\Perseus`): `npm install` → `Copy-Item .env.example .env.local` (works as‑is with localhost defaults) → `npm run dev` → open `http://localhost:3000` → view test submissions at `http://localhost:3000/dev/submissions` → `npm run verify` (lint, types, unit, build, e2e) → `npm run build; npm start` to preview production mode locally → `npm run dev:lan` to test on a phone on the same Wi‑Fi. How to enable real emails (create App Password, set `FORM_DELIVERY=smtp`). How to add a job, an article and a specialism (copy the example MDX file, edit front‑matter, set `status`, restart dev server). Future deployment steps as in Part LH §9 (documented only — not performed in this build).
