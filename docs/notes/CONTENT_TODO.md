# Perseus Talent — Content & Business Information Checklist

This document tracks all real-world business details, legal confirmations, and assets to be supplied by the business owner before public launch. Per the website plan, **no fabrication** is used anywhere on the site — missing details are rendered as clearly labelled editable placeholders with dashed gold borders.

---

## 1. Brand & Visual Assets
- [x] **Logo:** Owner-supplied logo is integrated (auto-traced SVG in `public/brand/`, regenerate with `npm run brand:logo`). Optional: supply the original vector (SVG/AI/PDF) to replace the traced version.
- [ ] **Brand Photography:** Review and approve or replace the placeholder/royalty-free professional healthcare photography selected for launch.

## 2. Corporate & Legal Information
- [ ] **Legal Entity Structure:** Confirm whether trading as a Sole Trader or Private Limited Company (Ltd).
- [ ] **Company Registration Number:** (If Ltd) To be added to legal notices and footer.
- [ ] **Registered Office Address:** To be supplied for legal notices and ICO registry.
- [ ] **ICO Registration Number:** Information Commissioner's Office data protection register reference.
- [ ] **VAT Registration Status:** Calculator VAT display is **OFF by default** (`site.fee.vat.enabled: false`). Provide VAT registration number and enable flag when registered.
- [ ] **Legal Review:** Professional legal review of draft `Privacy Policy`, `Cookie Policy`, and website `Terms of Use`.
- [ ] **Employer Terms of Business:** Formal recruitment contract, fee invoice payment terms (e.g., 14/30 days), and rebate/replacement policy.

## 3. Team & Company Background
- [ ] **Founder Biography & Photo:** Founder name, executive summary, professional portrait for `/about`.
- [ ] **Founding Date & Origin Story:** Verified background narrative for the "Our story" section on `/about`.

## 4. Specialisms & Disciplines
- [ ] **Healthcare Disciplines:** Specific clinical and non-clinical roles/bands recruited (e.g. Nursing, Allied Health Professionals, Healthcare Management).
- [ ] **Target Geographies:** Specific UK regions or nationwide remit.
- [ ] **Future Specialisms:** Any secondary sectors planned beyond Healthcare.

## 5. Candidate Screening & Operations
- [ ] **Pre-employment Checks:** Confirm exact screening carried out prior to introduction (e.g. Right to Work in the UK, professional registration checks, DBS, reference verification).
- [ ] **Candidate Communications Policy:** Confirmation of candidate notification SLAs.
- [ ] **Data Retention Schedule:** Defined retention period for candidate CVs and registration data (e.g. 12 or 24 months before consent refresh).

## 6. Infrastructure & Deployment
- [ ] **Domain & DNS:** Purchase and point `perseustalent.co.uk` to host (e.g. Vercel Pro or Netlify).
- [ ] **Business Email Routing:** Create domain mailbox (e.g. `hello@perseustalent.co.uk`) or generate Google App Password for `Perseustalent@gmail.com` to enable live SMTP delivery.
- [ ] **Cloudflare Turnstile:** Add production Turnstile site key and secret key when domain is active.
