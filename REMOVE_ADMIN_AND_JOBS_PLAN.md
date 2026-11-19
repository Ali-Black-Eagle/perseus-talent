# Remove the admin panel and job listings

**Date:** 19 November 2026
**Decision:** the site no longer has an admin panel and never shows job vacancies. Candidates register their CV instead. Insights and Specialisms stay, and are edited as MDX files in `content/` by developers.

## Part A: Delete the admin panel (Keystatic) completely

- Delete:
  - `keystatic.config.ts`;
  - `src/app/keystatic/` (page, layout, client component) and `src/app/api/keystatic/`;
  - `src/lib/admin.ts`;
  - `tests/admin/`, `playwright.admin.config.ts`, `tests/unit/keystatic-config.test.ts`.
- Uninstall `@keystatic/core` and `@keystatic/next` with `npm uninstall` so the lockfile updates. Remove any other dependency that only Keystatic used.
- `next.config.ts`:
  - remove `adminCspDirectives`, `adminHeaders` and the two admin header entries;
  - apply the public headers to **every** route, with source `/:path*` (replacing the negative-lookahead source);
  - remove the `NEXT_PUBLIC_KEYSTATIC_*` entries from `env` (keep `NEXT_PUBLIC_TURNSTILE_ENABLED`).
- `package.json`: remove the `test:admin` script, and remove the admin run from `scripts/verify-browser.mjs` (and any other verify script).
- `robots.txt` / robots route, sitemap and SEO tests: remove every `/keystatic` mention. The SEO tests "admin is hidden on a production build" go away. Keep the strict-CSP check, rewritten as "the public site has the strict CSP".
- `.env.example`: delete the whole "Admin panel (Keystatic)" block.
- `src/lib/content.ts`: remove anything that only existed for Keystatic, such as comments or slug handling for Keystatic's file names. Keep behaviour that Insights and Specialisms still rely on.

## Part B: Remove job opportunities from the site

### Pages and code
- Delete:
  - `src/app/opportunities/` (list and `[slug]`);
  - `src/components/opportunities/`;
  - `content/jobs/`;
  - `tests/fixtures/content/jobs/` and any job fixture setup in `scripts/prepare-test-content.mjs` (delete the script and its callers if it only exists for jobs);
  - `docs/job-template.mdx`.
- `src/lib/content.ts`:
  - remove the job schema and loaders: `getJobs`, `getJobBySlug`, `getJobPages` and the job types;
  - remove `getJobPostingJsonLd` and job helpers from `src/lib/seo.ts`;
  - remove `pageSeo.opportunities`;
  - remove job entries from `src/lib/sitemap-routes.ts`.
- `next.config.ts`:
  - remove the `outputFileTracingIncludes` entries for the candidate route and `/opportunities`. Keep any still needed for Insights and Specialisms; check how those pages read content;
  - add **permanent redirects** from `/opportunities` and `/opportunities/:slug*` to `/candidates`.

### Candidate application
- Candidate registration form (`CandidateRegistrationForm.tsx`): remove the `job` / `initialJobSlug` / `?job=` handling and any "applying for" UI.
- `src/app/api/enquiries/candidate/route.ts`: remove the `job` field, `JOB_SLUG_PATTERN`, `getJobBySlug` lookup and `applyingForJob*` fields.
- Notification emails and templates: remove "applying for" lines.
- Validation schemas and unit tests: remove job fields.
- Keep `preferredOpportunities` if it is the candidate's role-preference field (it is about what roles they want, not listings).

### Links and copy
- Find every `/opportunities` link across `src/`, `scripts/` and tests:
  - header nav and its active-state logic;
  - mobile menu;
  - footer / `src/config/site.ts`;
  - `not-found.tsx`;
  - home page (3 places: hero CTA, a later CTA, closing CTA);
  - About and Candidates pages.
- Replace each **"Explore Opportunities"** / **"View All Opportunities"** button with **"Register Your CV"** → `/candidates#register`. Where that would put two identical buttons side by side, drop the duplicate.
- Candidates page: delete the whole "Career opportunities" teaser section ("New opportunities are on the horizon…"). Reword copy that refers to a jobs directory or "current vacancies".
- Generic wording such as "career opportunities" or "the right opportunities" is fine and stays.
- `scripts/check-links.mjs`, `scripts/verify-all.mjs`, `scripts/generate-offline-html.mjs`: remove the opportunities route and its checks.

### Docs
`README.md` and `DEPLOYMENT.md`:
- remove the admin panel sections (DEPLOYMENT section 11 "Managing jobs and articles" and the env table rows, README `test:admin` and `/keystatic` notes);
- add one short note: Insights and Specialisms are MDX files in `content/` edited in code;
- renumber sections if needed.

Leave historical plan files (`*_PLAN.md`) untouched.

## Must hold
- `git grep -niE "keystatic|/opportunities|getJob|JobPosting|content/jobs"` returns nothing outside `*_PLAN.md` files and `package-lock.json`. The only exception is the redirect source in `next.config.ts`.
- No dead imports or unused exports (lint clean), and no orphaned images used only by job pages. `job-brief.webp` is an Insights / Employers image, **not** a job listing: keep it.
- The home page hero layout and the animated stars are unchanged apart from the CTA label and link.
- `/opportunities` and `/opportunities/anything` return a 308 to `/candidates`. `/keystatic` and `/api/keystatic` return 404.
- The sitemap has no job URLs; `robots.txt` no longer mentions `/keystatic`.

## Tests and checks
- Update the e2e, SEO and accessibility suites:
  - remove job tests;
  - add an SEO test for the two redirects and the `/keystatic` 404;
  - update route lists that included `/opportunities`.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, then `npm run verify`. All must pass.
- Screenshot the home, candidates and 404 pages at 1440px and 375px, and look at them for awkward gaps or leftover CTAs.
