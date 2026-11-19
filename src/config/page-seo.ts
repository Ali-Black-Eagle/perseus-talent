/**
 * Titles and meta descriptions for the fixed pages, kept in one place so they can be checked by tests.
 *
 * Rules (also enforced by tests/unit/seo-metadata.test.ts):
 * - the title plus " | Perseus Talent" is at most 60 characters (the home page title is used as written);
 * - the description is 120 to 155 characters, unique, and includes the page's main phrase;
 * - only honest phrases from the brief are used: UK healthcare recruitment, healthcare recruitment
 *   consultancy, recruitment consultants UK, employer recruitment services. No towns or regions.
 */
export interface PageSeo {
  title: string;
  description: string;
  path: string;
  /** Home only: the title is already complete. */
  absoluteTitle?: boolean;
}

export const pageSeo = {
  home: {
    title: "Perseus Talent | UK Healthcare Recruitment Consultancy",
    absoluteTitle: true,
    description:
      "Perseus Talent is a UK healthcare recruitment consultancy connecting organisations with exceptional professionals. Transparent 15% flat fee.",
    path: "/",
  },
  employers: {
    title: "Healthcare Recruitment for Employers",
    description:
      "Employer recruitment services from Perseus Talent: relationship-led UK healthcare recruitment at a transparent 15% flat fee.",
    path: "/employers",
  },
  candidates: {
    title: "Healthcare Jobs & Career Opportunities",
    description:
      "Register your profile with Perseus Talent, a UK healthcare recruitment consultancy, and connect with meaningful healthcare opportunities.",
    path: "/candidates",
  },
  feeCalculator: {
    title: "Recruitment Fee Calculator — 15% Flat Fee",
    description:
      "Calculate your healthcare recruitment fee instantly. A straightforward flat 15% rate applied to annual gross base salary, with zero hidden fees.",
    path: "/fee-calculator",
  },
  contact: {
    title: "Contact Our Team",
    description:
      "Contact Perseus Talent on 07555004374 or Perseustalent@gmail.com. We welcome conversations with UK healthcare employers and professionals.",
    path: "/contact",
  },
  about: {
    title: "About Us — Relationship-Led Recruitment",
    description:
      "Learn about Perseus Talent, a UK healthcare recruitment consultancy: our story, relationship-led approach, core values and vision for the industry.",
    path: "/about",
  },
  specialisms: {
    title: "Healthcare Recruitment Specialisms",
    description:
      "Explore the recruitment specialisms of Perseus Talent. Healthcare is our primary focus, connecting UK organisations with dedicated professionals.",
    path: "/specialisms",
  },
  insights: {
    title: "Healthcare Recruitment Insights & Advice",
    description:
      "Articles from Perseus Talent on healthcare recruitment, employer guidance, interview preparation and talent acquisition for UK organisations.",
    path: "/insights",
  },
  privacyPolicy: {
    title: "Privacy Policy",
    description:
      "How Perseus Talent processes, stores and protects candidate CVs and employer enquiries under UK GDPR and the Data Protection Act 2018.",
    path: "/privacy-policy",
  },
  cookiePolicy: {
    title: "Cookie Policy",
    description:
      "The Perseus Talent Cookie Policy explains our minimal, privacy-first use of the cookies and technologies that are necessary to run this website.",
    path: "/cookie-policy",
  },
  terms: {
    title: "Terms and Conditions",
    description:
      "Terms and conditions governing use of the Perseus Talent website, fee calculator and recruitment enquiry services for employers and candidates.",
    path: "/terms",
  },
  imageCredits: {
    title: "Image Credits",
    description:
      "Attribution and licence details for the photography used on the Perseus Talent website, a UK healthcare recruitment consultancy.",
    path: "/image-credits",
  },
} satisfies Record<string, PageSeo>;
