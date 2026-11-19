# PERSEUS TALENT — Website Codebase

Premium, responsive website for **Perseus Talent**, a UK recruitment consultancy specialising in healthcare staffing and talent acquisition.

Built from scratch in strict accordance with `PERSEUS_TALENT_WEBSITE_PLAN.md`.

---

## 1. Quick Start (Localhost-First)

The website is engineered to run locally on Windows 11 with **zero paid services and zero external accounts required**.

### Prerequisites
- Node.js 20+ (developed on Node 24.20)
- npm 10+ (developed on npm 11.19)
- Git

### Installation & Execution (PowerShell)
```powershell
# 1. Install dependencies
npm install

# 2. Configure local environment (already preconfigured with localhost defaults)
Copy-Item .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Next.js development server on `http://localhost:3000`. |
| `npm run dev:lan` | Runs dev server on `0.0.0.0:3000` for testing on mobile devices on the same Wi-Fi. |
| `npm run build` | Compiles optimized static pages and server routes for production. |
| `npm start` | Starts the production build locally on `http://localhost:3000`. |
| `npm run test` | Runs unit tests (Vitest) for fee calculation, phone validation, and CV file verification. |
| `npm run typecheck` | Validates TypeScript types across all components, schemas, and routes (`tsc --noEmit`). |
| `npm run check:links` | Crawls all 17 site routes to ensure zero broken links. |
| `npm run verify` | Full verification pipeline: lint, typecheck, unit tests, content audit, then a production build tested in the browser on port 3400. |

---

## 3. Key Local Development Routes

- **Design System Style Guide:** [http://localhost:3000/styleguide](http://localhost:3000/styleguide)  
  *Presents all color tokens, typography scales, buttons, card variants, and interactive calculator states (404 in production).*
- **Local Submissions Inspector:** [http://localhost:3000/dev/submissions](http://localhost:3000/dev/submissions)  
  *Inspects form enquiries and downloads test CVs captured in `.local-submissions/` (404 in production).*

---

## 4. How Form Enquiries Work

Forms operate through a pluggable delivery adapter controlled by `FORM_DELIVERY` in `.env.local`:

1. **`FORM_DELIVERY=local` (Default):**  
   Enquiries and uploaded CV files are saved directly to `./.local-submissions/` on your computer. CV files are validated with magic-byte checks and saved outside `public/`. Submissions can be inspected at `/dev/submissions`.
2. **`FORM_DELIVERY=smtp` (Real Gmail Sending from Localhost):**  
   To send real notification emails from localhost without a custom domain:
   - Generate a **Google App Password** for `Perseustalent@gmail.com` (requires 2-Step Verification).
   - In `.env.local`, set:
     ```env
     FORM_DELIVERY=smtp
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=465
     SMTP_USER=Perseustalent@gmail.com
     SMTP_APP_PASSWORD=your_16_char_app_password
     ```
   - Restart the dev server. Enquiries and candidate CV attachments will now be emailed directly to `Perseustalent@gmail.com`.
3. **`FORM_DELIVERY=resend` (Production Live Domain):**  
   Configured after `perseustalent.co.uk` domain ownership and DNS (SPF/DKIM/DMARC) are established.

---

## 5. Adding New Content

Content is data-driven using MDX/Markdown files with front-matter validated by Zod at build time.

Insights and Specialisms are MDX files in `content/`, edited in code (there is no admin panel). The site does not list job vacancies: candidates register their CV on `/candidates`.

### How to Add an Insight Article
1. Create a file in `content/insights/<slug>.mdx`:
   ```yaml
   ---
   title: "Clinical Staffing Strategies for 2027"
   slug: "clinical-staffing-strategies"
   excerpt: "Key staffing considerations for modern healthcare providers."
   category: "Healthcare Recruitment"
   date: "2026-11-18"
   author: "Perseus Talent"
   status: "published"
   ---

   Article markdown body goes here.
   ```
2. Set `status: "published"` to publish to `/insights`. Set `status: "draft"` to keep it hidden. Drafts are visible only when running locally with `SHOW_DRAFTS=true`, never on the live site. Also add `imageAlt` (a short description of the image).

### How to Add a New Specialism
Create `content/specialisms/<slug>.mdx` with `title, slug, summary, order, primary: false, status: 'active'`. It will automatically appear in `/specialisms` and `sitemap.xml`.

---

## 6. Going Live (Future Deployment)

When domain registration (`perseustalent.co.uk`) and hosting (Vercel Pro or Netlify) are ready:
1. Connect this Git repository to Vercel Pro or Netlify.
2. In the hosting dashboard, configure production environment variables:
   ```env
   NEXT_PUBLIC_SITE_URL=https://perseustalent.co.uk
   NEXT_PUBLIC_ALLOW_INDEXING=true
   FORM_DELIVERY=smtp    # or resend once domain DKIM is verified
   ENQUIRY_TO_ADDRESS=Perseustalent@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=Perseustalent@gmail.com
   SMTP_APP_PASSWORD=...
   TURNSTILE_ENABLED=true
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
   TURNSTILE_SECRET_KEY=...
   SHOW_DRAFTS=false
   ```
3. Deploy. No code changes are required.

---

## 7. Business Information Checklist

Refer to `CONTENT_TODO.md` for corporate details, registered addresses, and legal review sign-offs to supply prior to public release.
