# Next steps plan

**Date:** 19 November 2026
**Live preview:** https://perseus-talent.netlify.app (Netlify project `perseus-talent`, deployed by upload, no Git link yet)

Who does what:
- **Agent** (Sonnet, medium effort): parts A, B and C, which are code changes.
- **Claude** (this session): part D. Reviews the agent's work, redeploys, and sets the non-secret Netlify settings.
- **Owner:** part E, the steps that need the owner's own accounts and secrets.

## A. Fix React error #418 on the live site (hydration mismatch)
- **Symptom:** on https://perseus-talent.netlify.app/ the browser console logs `Minified React error #418` with args `HTML`. That means the server HTML differs from the first client render. The local production build (`npm run verify`) shows no console errors.
- **Find the cause first, then fix it at the source.** Do not just add `suppressHydrationWarning`.
  1. Build with `next build --debug-prerender` or run `next start` locally, and compare.
  2. Fetch the live HTML (`curl https://perseus-talent.netlify.app/`) and compare it with the local `next start` HTML for the same route.
  3. Check the other live routes (`/candidates`, `/employers`, `/insights`, `/about`, `/contact`, `/fee-calculator`) for the same error with Playwright against the live URL.
- **Likely suspects:**
  - anything that depends on time, date or environment during render (footer year, `NODE_ENV`, `process.env` values that differ between build and runtime on Netlify);
  - Netlify-served cached HTML from an older build;
  - the theme or inline `<script>` in `layout.tsx`;
  - the "script tag while rendering React component" warning seen in tests;
  - the hero star components.
- **Prove the fix** with a Playwright check that loads every main route on a local production server and fails on any `pageerror` or console error. Extend the existing "Zero console errors on all routes" e2e test if it doesn't already catch this.
- If the cause can only be confirmed on Netlify, say so in the report. Claude will redeploy and recheck the live site.

## B. Security updates
- **`nodemailer`:** upgrade to the latest version (≥ 10.6.0, a major bump). Read its changelog for breaking changes and update `src/lib/delivery/` accordingly. The email unit tests and the form e2e tests must still pass.
- **`zod`:** upgrade to ≥ 4.6.6.
  - If the project is on zod 3, migrate to 4 following the official migration notes: `.email()`, `.url()`, error maps, `z.string().nonempty` and similar.
  - Check every schema in `src/lib/validation/` and `src/lib/content.ts`.
- Run `npm audit --omit=dev` afterwards. The goal is 0 high/critical. Report anything left and why (for example, dev-only tooling).
- No other dependency changes beyond what these need.

## C. Tidy-ups after removing jobs
1. **Candidates page SEO title:** replace "Healthcare Jobs & Career Opportunities" in `src/config/page-seo.ts`. Use something like "For Candidates — Register Your CV for Healthcare Roles". Keep it within the existing title-length rules, and update the unit test that pins it. Check the description too, and any other page title or description that still promises job listings or vacancies to browse.
2. **Offline HTML:** run `npm run build:offline` (read the script first for what it needs, such as a running server and port) to regenerate `perseus-talent-offline.html`. Confirm with `grep -i opportunities` that no job pages, links or menu entries remain. Generic wording like "the right opportunities" is fine.
3. **Delete `.test-content/`.** It is leftover generated test data and no longer used.
4. **Showcase PDF:** do **not** edit `perseus-partner-showcase.pdf`. Report which pages mention jobs or opportunities, if you can extract its text, so the owner can redo it.

## D. Claude: review and redeploy (not for the agent)
- Review the diff.
- Redeploy to Netlify from a clean `git archive` of HEAD, never from the working folder: `.env.local` holds secrets.
- Recheck the live site for console errors.
- Set the **non-secret** Netlify env vars:

  | Variable | Value | Why |
  |---|---|---|
  | `NEXT_PUBLIC_SITE_URL` | `https://perseus-talent.netlify.app` | Until the real domain is connected |
  | `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | Preview only |
  | `SMTP_USER` | (business address from DEPLOYMENT.md) | |
  | `ENQUIRY_TO_ADDRESS` | (business address from DEPLOYMENT.md) | |
  | `SHOW_DRAFTS` | `false` | |

## E. Owner steps (need your own accounts or secrets)
1. **Forms:**
   - Create a Google App Password (DEPLOYMENT.md section 6).
   - In Netlify, add `SMTP_APP_PASSWORD`, then `FORM_DELIVERY=smtp`.
   - Optionally set up Cloudflare Turnstile (section 7) and add its keys.
   - Trigger a deploy.
2. **GitHub:**
   - Create an empty **private** repository, then either share its URL or sign in to GitHub so Claude can push.
   - Claude then pushes `main` and `feature/site-overhaul` and opens the pull request.
3. **Link Netlify to GitHub:** in Netlify, Project configuration, then Build & deploy, then Link repository (needs your GitHub sign-in).
4. **Domain:** connect `perseustalent.co.uk` (DEPLOYMENT.md section 8). Then change `NEXT_PUBLIC_SITE_URL` to the real domain, and set `NEXT_PUBLIC_ALLOW_INDEXING=true` at launch.
5. **Merge** the pull request into `main` once 1 is done and the preview looks right.

## Checks (agent)
- `npm run lint`, `npm run typecheck`, `npm run test` and `npm run verify` all pass.
- `npm audit --omit=dev` output included in the report.
- No commit, push or deploy. Leave the changes in the working tree.
