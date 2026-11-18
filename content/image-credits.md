# Perseus Talent — Visual Assets & Photography Credits

This document tracks all photography and visual assets deployed across the Perseus Talent website, adhering strictly to the brand identity and photography guidelines in `PERSEUS_TALENT_WEBSITE_PLAN.md` (Part D7) and `REMAINING_WORK_PLAN - Copy.md` (Item 1).

In accordance with the brand guidelines, all illustrations and cartoon drawings have been removed. The website uses authentic, editorial documentary photography featuring healthcare professionals in real settings, executive consultations, and leadership environments with natural light, warm desaturated colour grading, deep plum undertones, and soft gold ambient highlights.

---

## 1. Deployed Editorial Photography

| Asset Path | Location & Usage | Aspect Ratio | Subject & Description | Licence / Origin | Status |
|---|---|---|---|---|---|
| `public/images/home/executive-consultation.jpg` | Homepage Dual Audience (For Employers) | 4:3 | Executive recruitment consultation between a senior healthcare recruitment consultant and an NHS hospital trust executive in a modern, light-filled boardroom overlooking green parkland. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |
| `public/images/home/healthcare-professional.jpg` | Homepage Dual Audience (For Candidates) | 4:3 | Senior British clinical director / NHS healthcare leader in tailored executive dress, standing in a contemporary hospital pavilion with glass balustrades and natural daylight. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |
| `public/images/specialisms/clinical-care.jpg` | Specialisms Directory & Healthcare Detail Page | 4:3 | Dedicated UK healthcare clinical specialist in navy scrubs with stethoscope and lanyard, standing in a modern, calm consultation suite bathed in morning daylight. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |
| `public/images/about/team-partnership.jpg` | About Us Page (Our Story Split) | 4:3 | Senior executive recruitment partners collaborating in an elegant London consulting office with Georgian sash windows, reviewing candidate dossiers under warm afternoon light. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |
| `public/images/employers/leadership.jpg` | For Employers & Feature Panels | 16:9 | Senior British healthcare trust chief executive / medical director in tailored executive attire in a modern hospital executive pavilion overlooking London parkland. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |
| `public/images/candidates/career-consultation.jpg` | For Candidates & Career Panels | 4:3 | One-to-one confidential career consultation between an advisor and a clinical candidate seated in leather armchairs in a quiet, light-filled London consulting suite. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |
| `public/images/insights/interview-preparation.jpg` | Insights Hub & Interview Preparation Article | 3:2 | Healthcare leader in a calm, oak-panelled architectural waiting study, calmly reviewing an executive dossier before an NHS trust panel interview. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |
| `public/images/insights/job-brief.jpg` | Insights Hub & Job Brief Writing Article | 3:2 | Specialist recruitment consultant reviewing and drafting a clinical vacancy brief on a solid oak desk in a sunlit London architectural studio. | Editorial Licence / High-Resolution Documentary Asset | Deployed (Subject to owner pre-launch approval) |

---

## 2. Proprietary Vector Brand Assets

| Asset Path | Location & Usage | Description | Licence / Status |
|---|---|---|---|
| `public/brand/logo.svg` | Header & Footer Wordmark | "PERSEUS TALENT" with Cormorant Garamond serif typography | Custom proprietary brand identity |
| `public/brand/monogram.svg` | Brand Mark & Monogram | Geometric 8-point star and Perseus constellation star fragment | Custom proprietary brand identity |
| `src/app/icon.svg` | Browser Favicon & Touch Icon | Pale gold monogram on Royal Purple `#1C052E` | Custom proprietary brand identity |
| `src/app/opengraph-image.tsx` | Social Sharing (Open Graph) | Dynamic 1200×630px social card with constellation graphic | Custom dynamic component |

---

## 3. Brand Photography Guidelines (Part D7)

When replacing or adding photography prior to public release:

1. **Subjects:** Real healthcare professionals in authentic clinical or executive settings, one-to-one consultations, leadership meetings.
2. **Strictly Avoid:**
   - Vector cartoons or flat drawings of faceless figures.
   - Posed, artificial corporate handshakes.
   - Clinical close-ups of syringes, injections, needles, or acute surgical procedures.
   - Stiff stock photography with unnatural white studio backdrops or forced smiles.
3. **Lighting & Color Grading:**
   - Natural window daylight, authentic documentary realism.
   - Warm, slightly desaturated colour grading (saturation ~85%).
   - Deep plum undertones in the shadows and soft gold ambient highlights, harmonising with the `#1C052E` and `#C5A15B` brand palette.
4. **Implementation Standard:**
   - Next.js `<Image />` component with responsive `sizes` attribute and explicit aspect ratio.
   - Modern formats (WebP/AVIF auto-negotiation).
   - Descriptive `alt` text conveying context and professional tone.
