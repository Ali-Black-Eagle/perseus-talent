export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  url: string;
  urlDisplay: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  industry: string;
  market: string;
  primarySpecialism: string;
  positioning: string;
  statement: string;
  fee: {
    rate: number;
    rateDisplay: string;
    currency: string;
    vat: {
      enabled: boolean;
      rate: number;
    };
    salaryMin: number;
    salaryMax: number;
  };
  forms: {
    cvMaxBytes: number;
    cvTypes: string[];
  };
  nav: NavItem[];
  navCta: NavItem;
  footerServices: NavItem[];
  legal: NavItem[];
}

export const site: SiteConfig = {
  name: "Perseus Talent",
  url: "https://perseustalent.co.uk",
  urlDisplay: "Perseustalent.co.uk",
  email: "Perseustalent@gmail.com",
  phoneDisplay: "07555004374",
  phoneHref: "tel:+447555004374",
  industry: "Recruitment and talent acquisition",
  market: "United Kingdom",
  primarySpecialism: "Healthcare recruitment",
  positioning:
    "A premium, relationship-led recruitment consultancy connecting talented professionals with organisations seeking exceptional people.",
  statement: "The right people. The right opportunities. A better future.",
  fee: {
    rate: 0.15,
    rateDisplay: "15%",
    currency: "GBP",
    vat: {
      enabled: false,
      rate: 0.2,
    },
    salaryMin: 1000,
    salaryMax: 10_000_000,
  },
  forms: {
    cvMaxBytes: 3 * 1024 * 1024, // 3MB (Netlify functions accept ~6MB requests incl. encoding overhead)
    cvTypes: ["pdf", "doc", "docx"],
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Employers", href: "/employers" },
    { label: "Candidates", href: "/candidates" },
    { label: "Our Specialisms", href: "/specialisms" },
    { label: "About Us", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ],
  navCta: {
    label: "Calculate Your Fee",
    href: "/fee-calculator",
  },
  footerServices: [
    { label: "Employer Recruitment", href: "/employers" },
    { label: "Healthcare Recruitment", href: "/specialisms/healthcare" },
    { label: "Candidate Registration", href: "/candidates#register" },
    { label: "Current Opportunities", href: "/opportunities" },
    { label: "Fee Calculator", href: "/fee-calculator" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Image Credits", href: "/image-credits" },
  ],
};
