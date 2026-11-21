# Perseus Talent — Visual Assets & Photography Credits

This document tracks all photography and visual assets deployed across the Perseus Talent website, adhering strictly to the brand identity and photography guidelines in `docs/notes/PERSEUS_TALENT_WEBSITE_PLAN.md` (Part D7) and `docs/notes/FRONTEND_DESIGN_FIX_PLAN.md` (P0 Item 2).

In accordance with brand guidelines and trademark protection rules:
- All previous AI-generated placeholders and any images bearing unauthorised NHS logos or reversed text have been replaced.
- All deployed imagery is authentic, licence-free documentary photography using photography licensed for reuse; CC BY 2.0 images are attributed on the public Image Credits page (/image-credits).
- All assets are served in modern WebP format at ≤1600px width (between 36 KB and 195 KB) with descriptive, accurate alt text.

---

## 1. Deployed Editorial Photography

| Asset Path | Location & Usage | Subject & Description | Photographer / Source | Licence | Source URL |
|---|---|---|---|---|---|
| `public/images/home/healthcare-professional.webp` | Homepage (For Candidates panel) | Healthcare professional holding a stethoscope | Bermix Studio | Creative Commons CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Young_female_doctor_showing_stethoscope_closeup.jpg) |
| `public/images/specialisms/clinical-care.webp` | Specialisms page, For Employers page | Clinician examining chest x-rays in a medical office | Bermix Studio | Creative Commons CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Female_doctor_examines_chest_x-rays_in_a_medical_office.jpg) |
| `public/images/about/team-partnership.webp` | About page, Homepage (For Employers panel), For Employers page, Insights | Empty modern meeting room with a table and chairs | Rawpixel Ltd. | CC0 1.0 Universal Public Domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Conference_Meeting_Seminar_Modern_Contemporary_Concept_(32881037371).jpg) |
| `public/images/insights/interview-preparation.webp` | Insights (interview preparation article), For Employers page | Desk with notes, a notebook and a coffee | Pixel.la / Startup Stock Photos | CC0 1.0 Universal Public Domain | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Coffee-desk-notes-workspace_(24243718641).jpg) |
| `public/images/insights/job-brief.webp` | Insights (job brief article), For Employers page | Person writing in a notebook at a desk with a laptop | Shixart1985 | Creative Commons CC BY 2.0 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Person_writing_in_a_notebook_while_sitting_at_a_desk.jpg) |

---

## 2. Proprietary Vector Brand Assets

| Asset Path | Location & Usage | Description | Licence / Status |
|---|---|---|---|
| `brand-source/perseus-logo-original.jpg` | Master artwork (not served) | Owner-supplied Perseus Talent logo, JPEG 1280×853 | Owner-supplied, proprietary brand identity |
| `public/brand/logo-full.svg` (+ `logo-full.png`) | Light-background sections (home intro, About "Our story"), social card | Auto-traced vector of the owner-supplied full logo (transparent background) | Owner-supplied, proprietary brand identity |
| `public/brand/logo-emblem.svg` (+ `logo-emblem-512.png`) | Header, footer, 404 lockup; structured-data logo | Medallion with the Perseus head, cropped from the traced logo | Owner-supplied, proprietary brand identity |
| `src/components/brand/wordmarkPaths.ts` | Header, footer, 404 wordmark | "PERSEUS TALENT" outlines made from Cinzel (Google Fonts) | Cinzel: SIL Open Font License 1.1 |
| `src/app/icon.svg`, `src/app/apple-icon.png` | Browser favicon & touch icon | Emblem on Royal Purple `#1C052E` rounded square | Owner-supplied, proprietary brand identity |
| `src/app/opengraph-image.tsx` | Social Sharing (Open Graph) | Dynamic 1200×630px social card: full logo on ivory with brand statement | Custom dynamic component |

Regenerate all logo files with `npm run brand:logo`.

---

## 3. Brand Photography Guidelines (Part D7)

When replacing or adding photography prior to public release:

1. **Subjects:** Real healthcare professionals in authentic clinical or executive settings, one-to-one consultations, leadership meetings.
2. **Strictly Avoid:**
   - Vector cartoons or flat drawings of faceless figures.
   - Posed, artificial corporate handshakes.
   - Clinical close-ups of syringes, injections, needles, or acute surgical procedures.
   - Stiff stock photography with unnatural white studio backdrops or forced smiles.
   - Fabricated or reversed text, or trademarked NHS logos.
3. **Lighting & Color Grading:**
   - Natural window daylight, authentic documentary realism.
   - Warm, slightly desaturated colour grading (saturation ~85%).
   - Deep plum undertones in the shadows and soft gold ambient highlights, harmonising with the `#1C052E` and `#C5A15B` brand palette.
4. **Implementation Standard:**
   - Next.js `<Image />` component with responsive `sizes` attribute and explicit aspect ratio.
   - Modern formats (WebP).
   - Descriptive `alt` text conveying context and professional tone.
