# Perseus Talent — Remaining Work Plan

**Audit date:** 18 November 2026
**Audited against:** `PERSEUS_TALENT_WEBSITE_PLAN.md`
**How it was audited:** read the code; ran type-check, unit tests, content audit and a production build; served the build on localhost and checked every page in a browser at phone (375px) and desktop widths.

## Verdict

**The website is not complete yet.** The core is solid and works. But several features in the plan are missing, and one design rule from the brief is broken (illustrations are used instead of photography).

### Already working (verified)
- All 14 public pages load (status 200); `/styleguide` and `/dev/submissions` correctly return 404 in production mode.
- There are no broken internal links (17 unique links checked), every page has exactly one H1, and no images are missing alt text.
- Phone layouts don't overflow sideways on the pages checked at 375px (Home, Employers, Candidates, Fee Calculator).
- The fee calculator gives the right numbers (£55,000 → £8,250.00), shows its error messages, and passes the salary to the employer form (`/employers?salary=55000#enquiry` pre-fills the field).
- Forms show an inline error on each invalid field. The hidden spam-trap field is in place. Submissions are saved locally in `.local-submissions/`, and the CV file type is checked by reading the file's actual contents.
- `robots.txt`, `sitemap.xml` and the social-sharing (Open Graph) image are generated; indexing is blocked on localhost.
- The type-check passes, all 21 unit tests pass, the content audit is clean, and the production build succeeds.

---

## Remaining work (in priority order)

### P1 — Must fix (the brief or plan is broken)

1. **Replace the cartoon-style illustrations with real photography.**
   The four images in `public/images/**.svg` are flat vector drawings of faceless figures. The brief explicitly says to avoid "cartoon illustrations" and to use "professional, authentic-looking photography".
   - Pick 6–8 licence-free photos (Unsplash or Pexels): healthcare professionals in real settings, leadership meetings, one-to-one conversations. Natural light, no handshakes, no syringes.
   - Save them locally as optimised JPG/WebP in `public/images/<page>/`, with descriptive alt text and the warm, slightly desaturated colour grade from the plan.
   - Update `content/image-credits.md` with each photo's source URL and licence. It currently calls the drawings "bespoke editorial vector assets".
   - The owner approves the photos before launch.

2. **Add search and filters to job listings** (`src/app/opportunities/page.tsx`). Right now the page only shows the empty state. The plan's Part J requires:
   - keyword search, filters for location, specialism and employment type, a result count announced to screen readers, "Clear filters" chips, and the filter state saved in the URL;
   - a filter sheet that slides up on phones and a sidebar on desktop (plan §FE12);
   - a separate message for "no results match your filters".
   - Test it with a temporary open job file, then remove it.

3. **Add Insights category filtering.** Build `/insights/category/[category]/page.tsx` and the category chips (plan §G6 and §FE13). Add pagination for when there are more than 9 articles.

4. **Make the contact page offer three enquiry routes.** It currently has only the general form. Add an Employer / Candidate / General tab set (plan §FE14) with arrow-key support and links that open a specific tab (`#employer`, `#candidate`, `#general`). The Employer tab shows the employer form. The Candidate tab links to `/candidates#register` and offers the general form for questions.

5. **Add canonical URLs and structured data for search engines** (missing on every page).
   - Add a canonical URL to each page's metadata, built from `NEXT_PUBLIC_SITE_URL`.
   - Add structured data (JSON-LD) through a shared helper (`src/lib/seo.ts`):
     - `EmploymentAgency`/`Organization` and `WebSite` on every page (no address);
     - `BreadcrumbList` on inner pages;
     - `Article` on insight articles;
     - `FAQPage` on the candidate FAQs;
     - `JobPosting` only for real, open jobs.
   - Fix page titles where the brand name appears twice, for example "Contact Us — Perseus Talent | Perseus Talent" and the same on Privacy, Cookie and Terms. Drop "— Perseus Talent" from those page titles, because the layout template already adds it.

6. **Spam protection on the form endpoints** (plan Part I4). Add these to all three routes in `src/app/api/enquiries/*`:
   - a minimum-time check: reject forms sent less than 3 seconds after loading, using a hidden `startedAt` timestamp;
   - a per-IP rate limit of 5 submissions per 10 minutes (`src/lib/rate-limit.ts`);
   - optional Cloudflare Turnstile, controlled by `TURNSTILE_ENABLED` (`src/lib/turnstile.ts` plus a client widget component).
   - Stop sending raw `error.message` text to visitors in the `catch` blocks. Return the fixed "temporarily unavailable — email or call us" message and log only a request ID.

7. **The fee calculator should start empty** (`src/app/fee-calculator/page.tsx:76` passes `initialSalary="40000"`). The plan says empty input with the placeholder "e.g. 40,000" and the prompt "Enter a salary to see your estimated fee". Today, tapping the field and typing adds to the existing "40000", which shows a confusing error. Pass no initial value; keep URL pre-fill on `/employers`.

### P2 — Accessibility and quality gaps

8. **Mobile menu accessibility** (`src/components/layout/Header.tsx`).
   - Add a focus trap and mark the page behind the menu as `inert` while the menu is open; move focus to the first link when it opens.
   - The `animate-in fade-in slide-in-from-top-2` classes do nothing because `tailwindcss-animate` isn't installed. Replace them with a CSS animation using the plan's timings (250ms fade and slide, with links appearing one after another), and turn it off for users who prefer reduced motion.
   - The panel is positioned with `top-[72px] md:top-[88px]`, but the header is only 88px tall from 1280px (`--header-h`). Use `top: var(--header-h)` so there's no gap on tablets.
9. **Form error summary and focus** (all three forms). When a form is submitted with errors, show an error summary at the top (`role="alert"`, with a link to each field) and move focus to it. Right now focus stays on the page body. Check that the privacy-consent checkbox also gets `aria-invalid` and an error message when it isn't ticked.
10. **Turn on the scroll-reveal animations.** `src/lib/reveal.ts` and the `[data-reveal]` CSS exist, but no component uses them. Add a small client component (`<RevealProvider/>`) in the layout that calls `useReveal()` on each page change, and add `data-reveal` / `data-reveal-stagger` to section headings, cards and process steps (plan §FE15). Also add the View Transitions cross-fade.
11. **Add a Content-Security-Policy header** in `next.config.ts`: self, plus Turnstile when enabled, plus `frame-ancestors 'none'`. Only send HSTS when not on localhost.

### P3 — Tooling and verification (needed to prove "done")

12. **Set up the linter.** There's no ESLint config file, and `next lint` stops to ask a setup question, so linting has never actually run. Add an `eslint.config.mjs` flat config (next/core-web-vitals and jsx-a11y). Change the `lint` script to `eslint .` and add it to `npm run verify`. Fix whatever it finds.
13. **Add browser tests (Playwright) and accessibility checks (axe)** (plan Part P). `scripts/verify-all.mjs` only checks that each address returns a status code. Add `@playwright/test` and `@axe-core/playwright`, and write tests for:
    - navigation and the mobile menu;
    - the calculator and the pre-filled employer form;
    - each form: validation errors, saving in local mode, and the honest 503 message when email settings are missing;
    - CV upload rejecting the wrong file types;
    - job search and filters;
    - no sideways overflow at 320, 375, 768, 1024, 1440 and 1920px;
    - zero console errors;
    - axe finding no serious or critical problems on every page.

    Add `test:e2e` and `check:a11y` scripts and include them in `verify`.
14. **Run Lighthouse on Home, Employers, Fee Calculator and Candidates** (phone settings) against the production build. Targets: Performance ≥90, Accessibility ≥95, SEO 100. Fix anything that falls short.
15. **Code consistency (optional but recommended).** There are 884 hard-coded colour values such as `bg-[#1C052E]` across `src/`. Replace them with the Tailwind theme tokens from `globals.css` (`bg-purple-900`, `text-gold-500` and so on), so a brand colour can be changed in one place. Do this file by file after the tests exist, so nothing changes visually.

### P4 — Before launch (owner actions; not code)
- Delete the test submissions in `.local-submissions/` (9 test entries, including a test CV).
- Set `SHOW_DRAFTS=false`, or publish the three draft articles after review.
- Supply everything in `CONTENT_TODO.md`: logo, VAT status, company and ICO details, founder information, healthcare disciplines, payment terms, retention periods, and a legal review of the three policies.
- Optional now: a Google App Password, so forms send real emails from localhost (`FORM_DELIVERY=smtp`).

---

## Done when
- Every P1–P3 item above is implemented.
- `npm run verify` passes (lint, type-check, unit tests, content audit, build, browser tests, accessibility checks).
- Lighthouse targets are met.
- A screenshot review at 375 / 768 / 1440px confirms the real photography and a consistent premium look.
- The final report lists only owner-supplied information as outstanding.
