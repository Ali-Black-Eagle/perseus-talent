# Admin panel and SEO plan

**Date:** 19 November 2026
**Goals:**
1. The owner can add, edit, close and delete **jobs**, **Insights articles** and **specialisms** through a private admin panel, without touching code.
2. The site is as search-friendly as it can honestly be before launch.

**Hosting context:** Netlify free plan (each publish uses about 15 of 300 monthly credits), code on GitHub, and a budget under $7 a month. No database.

---

## Part A: Admin panel (Keystatic)

### A1. Setup
- Install `@keystatic/core` and `@keystatic/next`.
- Add `keystatic.config.ts`, the admin page `src/app/keystatic/[[...params]]/page.tsx` (with its layout) and the API route `src/app/api/keystatic/[...params]/route.ts`.
- **Storage:**
  - `local` when `KEYSTATIC_STORAGE` is unset or `local`: this is the default on localhost and edits the files on disk.
  - `github` when `KEYSTATIC_STORAGE=github`: the live site. Repository from `KEYSTATIC_GITHUB_REPO` (`owner/name`). Keystatic's own variables are `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
  - No secrets go in code; document every variable in `.env.example` and `DEPLOYMENT.md`.
- Branding: name "Perseus Talent", brand purple accent where Keystatic allows.

### A2. Collections (must match the existing Zod schemas in `src/lib/content.ts` exactly)
| Collection | Path | Fields |
|---|---|---|
| **Jobs** | `content/jobs/*` (`.mdx`, front matter + body) | title (slug from title, editable); employer name; "Show employer name publicly?" (checkbox); location; region; salary min / max (numbers, optional); salary text (optional); employment type (select: the schema's values); specialism (select from specialisms); date posted (date, default today); closing date (optional); **status: Open / Closed / Draft**; required experience; required qualifications (optional); application instructions (default text); description (rich text) |
| **Insights** | `content/insights/*` | title (slug from title), excerpt (with a 155-character hint), category (select from the fixed category list in config), date, updated (optional), author (default "Perseus Talent"), image (upload to `public/images/insights/`), image alt text (**required**), featured, **status: Draft / Published**, body (rich text: headings, bold, lists, links, quotes) |
| **Specialisms** | `content/specialisms/*` | title, slug, summary, order, primary, status (Active / Coming soon), image, body |

- Every field gets a plain-English label and description, for example "Shown on the job card. Leave salary blank if not disclosed."
- **Slugs:** make `src/lib/content.ts` work out the slug from the file name when the front matter has none, so Keystatic's file-name slugs and the existing files both work. Existing files must keep validating unchanged.
- **The job template** `content/jobs/_example-job.mdx` would show in the admin as a job. Move it to `docs/job-template.mdx`, and update the README and test references.
- **Body format:** use Keystatic's MDX/Markdown field so `ArticleBody` (remark) keeps rendering it. Check that a body saved from the editor renders correctly: headings, lists, links, bold.

### A3. Job lifecycle fixes
- **Open:** listed on `/opportunities`, in the sitemap, with JobPosting structured data.
- **Closed:**
  - not listed and not in the sitemap;
  - the job page **still loads** with a "This role is no longer accepting applications" banner, no apply button and no JobPosting data;
  - add `robots: noindex`.
  - Today `getJobBySlug` only finds listed jobs, so closed jobs show a 404; fix that.
- **Draft:** never visible in production, and visible locally only when `SHOW_DRAFTS=true`.
- An empty or closed-only list still shows "New opportunities are on the horizon".

### A4. Remove the made-up vacancy
- Delete `content/jobs/lead-clinical-nurse-specialist.mdx`. It's an invented listing, against the brief's no-fabrication rule.
- Tests that use it (`tests/unit/candidate-route.test.ts`, `email-template.test.ts`) must use a **test-only fixture** instead: mock `getJobBySlug`, or point the loader at a fixtures folder. No fake job may exist in `content/`.
- `scripts/generate-offline-html.mjs` references that job. Remove that entry, or make the script skip missing jobs. Don't otherwise change files from the other session.

### A5. Protect and hide the admin
- `/keystatic` and `/api/keystatic` get `noindex`, are excluded from the sitemap and are disallowed in `robots.txt`.
- **In production with GitHub storage,** only GitHub users with write access to the repository can save; that's Keystatic's built-in sign-in.
- **In production with local storage** (a misconfiguration), the admin must not let anyone edit the live server's files. Return 404 for `/keystatic` unless `KEYSTATIC_STORAGE=github` or `NODE_ENV=development`.
- **Content-Security-Policy:** the admin needs GitHub API calls and Keystatic's own scripts and styles. Relax the CSP **only** for `/keystatic` and `/api/keystatic` via a separate `headers()` entry; the public site's CSP stays strict.
- Keystatic's admin pages should not use the public header and footer.

### A6. Owner guide
Add "Managing jobs and articles" to `DEPLOYMENT.md`:
- the one-time GitHub and Keystatic connection steps (the owner does any sign-ins themselves);
- how to post, edit and close a job;
- how to publish an article;
- the note that **each save republishes the site in about 1–2 minutes and uses about 15 Netlify credits**, so make several changes and then save.

---

## Part B: SEO

### B1. Fix what's broken or missing (found in the audit)
1. **The no-index safeguard on localhost.** Pages output `<meta name="robots" content="index, follow">` even though indexing isn't allowed. Fix `createPageMetadata` in `src/lib/seo.ts` and the layout: `noindex, nofollow` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`.
2. **Share images on inner pages.** Inner pages lose `og:image` because page-level `openGraph` replaces the layout's. `createPageMetadata` must always include the default image, `/opengraph-image`, and allow an override. Articles use their own image; jobs and specialisms use the default. Add `twitter: { card: "summary_large_image" }`.
3. **Titles over 60 characters** (Google truncates them):
   - Fee calculator (83): "Recruitment Fee Calculator — 15% Flat Fee"
   - Candidates (70): "Healthcare Jobs & Career Opportunities"
   - About (65): "About Us — Relationship-Led Recruitment"
   - Employers (57): "Healthcare Recruitment for Employers"
   - The layout adds "| Perseus Talent". Check every title, including articles and jobs, comes to 60 characters or fewer; shorten article/job titles automatically if needed.
4. **Descriptions** must be 120–155 characters, unique, and include the page's main phrase:
   - **Home:** must mention UK healthcare recruitment, for example "Perseus Talent is a UK healthcare recruitment consultancy connecting organisations with exceptional professionals. Transparent 15% flat fee."
   - **Contact:** 162 characters, too long.
   - Generate article and job descriptions from the excerpt or summary, cut to 155 characters.
5. **Sitemap:** `lastModified` is `new Date()` for static pages, which tells Google every page changed on every build. Use fixed dates for static pages, `updated ?? date` for articles, and `datePosted` for jobs. Exclude the admin, closed jobs, drafts, `/dev` and `/styleguide`.
6. **robots.txt (live):** disallow `/api/`, `/dev/`, `/keystatic` and `/styleguide`; link to the sitemap.

### B2. Structured data (validate each against Google's documented required properties)
- **JobPosting** (open jobs only):
  - `title`, `description` (HTML), `datePosted`, `validThrough`, `employmentType` mapped to Google's values (FULL_TIME, PART_TIME, CONTRACTOR, TEMPORARY);
  - `hiringOrganization`: the employer if disclosed, otherwise Perseus Talent;
  - `jobLocation` with a `PostalAddress` (`addressLocality`, `addressRegion`, `addressCountry: "GB"`);
  - `baseSalary` (GBP, `MonetaryAmount` with `QuantitativeValue` min/max, `unitText: "YEAR"`) when salary is given;
  - `directApply: false`; `identifier` as the slug.
- **Article:** headline, image, datePublished, dateModified, author as Organization, publisher with the logo (`/brand/logo-emblem-512.png`), and the canonical as `mainEntityOfPage`.
- **EmploymentAgency** (all pages):
  - name, url, logo, email, telephone `+447555004374`;
  - `areaServed: "GB"`, `knowsAbout: ["Healthcare recruitment"]`;
  - **no address and no social links** (none supplied).
- Keep BreadcrumbList on inner pages, and add it to articles and jobs. Keep FAQPage on Candidates.
- Add a unit test that loads each schema builder with sample data and checks Google's required properties exist.

### B3. On-page
- One H1 per page; headings in order (H1 → H2 → H3, no skips). Fix any skips.
- Every content image has meaningful alt text (decorative images get `alt=""`).
- `<html lang="en-GB">`, plus an `alternates.languages` en-GB self-reference.
- **Internal links:**
  - each Insights article ends with links to related articles plus a relevant page (Employers, Fee Calculator or Candidates);
  - job pages link to Candidates and Specialisms;
  - the Healthcare specialism page links to Opportunities and the Fee Calculator.
- **Links on job listings:** confirm each job card is a real `<a href>` to the job page, so search engines can follow it.
- **No keyword stuffing.** Use only these honest phrases from the brief: UK healthcare recruitment, healthcare recruitment consultancy, recruitment consultants UK, employer recruitment services. No towns or regions until the owner confirms target areas.

### B4. Host-level (for Netlify, in `netlify.toml`)
- Redirect `www.perseustalent.co.uk` to `https://perseustalent.co.uk` (301), with HTTPS forced.
- No trailing-slash duplicates: check that Next's default `trailingSlash: false` holds and canonicals match.

### B5. Owner SEO checklist (add to `DEPLOYMENT.md`; not code)
- Google Search Console: verify the domain via DNS and submit `sitemap.xml`.
- Bing Webmaster Tools: import from Search Console.
- Google Business Profile, as a service-area business with no public address.
- Publish the three draft articles after review, then aim for one useful article a month.
- Put real jobs on the site as soon as you have them; job pages rank in Google's job search.
- Get listed honestly in UK recruitment directories (for example REC membership, if applicable). Never buy links.

---

## Verification
- `npm run verify` passes. It builds into `.next-verify` on port 3400, so it doesn't clash with a dev server.
- **New unit tests:**
  - slug-from-file-name;
  - closed-job behaviour;
  - SEO metadata: titles of 60 characters or fewer, descriptions of 120–155 characters, `og:image` on every page, and robots set to noindex when indexing is off and index when on;
  - JSON-LD required properties;
  - the sitemap excludes admin, draft and closed pages.
- **New browser tests:**
  - `/keystatic` loads locally and shows Jobs, Insights and Specialisms;
  - create a test job in a temporary copy, or create and then delete it, and check it appears on `/opportunities` when open;
  - a closed job's page shows the banner;
  - the `/keystatic` route is noindex.
- **Real admin round trip in the browser on localhost:**
  1. create a draft job through the admin;
  2. set it to Open; it appears on `/opportunities`;
  3. set it to Closed; the banner appears;
  4. delete it.
  
  Clean up afterwards, and leave no test job in `content/`.
- **Generated HTML:** every public page has a title, description, canonical, `og:image` and robots, all correct, with the `NEXT_PUBLIC_ALLOW_INDEXING=true` and live `NEXT_PUBLIC_SITE_URL` set for one build.
- Lighthouse SEO and Accessibility stay at 100.
