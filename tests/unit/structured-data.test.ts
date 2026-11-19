import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getOrganizationJsonLd,
  getJobPostingJsonLd,
  getArticleJsonLd,
  getBreadcrumbJsonLd,
  getFaqPageJsonLd,
  getWebSiteJsonLd,
} from "@/lib/seo";
import type { JobItem, InsightItem } from "@/lib/content";

const BASE = "https://perseustalent.co.uk";

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SITE_URL", BASE));
afterEach(() => vi.unstubAllEnvs());

const baseJob: JobItem = {
  meta: {
    title: "Test Open Role",
    slug: "test-open-role",
    employerName: "Test Employer",
    employerDisclosed: true,
    location: "Testville",
    region: "Test Region",
    salaryMin: 40000,
    salaryMax: 50000,
    salaryText: "£40,000 - £50,000 per annum",
    employmentType: "Permanent",
    specialism: "healthcare",
    datePosted: "2026-11-01",
    validThrough: "2026-12-31",
    status: "open",
    requiredExperience: "Three years of experience & more.",
    requiredQualifications: "Registration <required>",
    applicationInstructions: "Apply.",
  },
  content: "## About the role\n\nA **great** role.\n\n- one\n- two\n",
};

describe("JobPosting JSON-LD (Google required and recommended properties)", () => {
  const ld = getJobPostingJsonLd(baseJob) as Record<string, any>;

  it("has the properties Google requires", () => {
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("JobPosting");
    expect(ld.title).toBe("Test Open Role");
    expect(typeof ld.description).toBe("string");
    expect(ld.datePosted).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(ld.hiringOrganization["@type"]).toBe("Organization");
    expect(ld.hiringOrganization.name).toBeTruthy();
    expect(ld.jobLocation["@type"]).toBe("Place");
    expect(ld.jobLocation.address["@type"]).toBe("PostalAddress");
    expect(ld.jobLocation.address.addressCountry).toBe("GB");
  });

  it("has the recommended properties", () => {
    expect(ld.validThrough).toBe("2026-12-31");
    expect(ld.employmentType).toBe("FULL_TIME");
    expect(ld.directApply).toBe(false);
    expect(ld.identifier.value).toBe("test-open-role");
    expect(ld.jobLocation.address.addressLocality).toBe("Testville");
    expect(ld.jobLocation.address.addressRegion).toBe("Test Region");
    expect(ld.baseSalary["@type"]).toBe("MonetaryAmount");
    expect(ld.baseSalary.currency).toBe("GBP");
    expect(ld.baseSalary.value["@type"]).toBe("QuantitativeValue");
    expect(ld.baseSalary.value.minValue).toBe(40000);
    expect(ld.baseSalary.value.maxValue).toBe(50000);
    expect(ld.baseSalary.value.unitText).toBe("YEAR");
  });

  it("renders the description as safe HTML", () => {
    expect(ld.description).toContain("<h2>About the role</h2>");
    expect(ld.description).toContain("<strong>great</strong>");
    expect(ld.description).toContain("<li>one</li>");
    expect(ld.description).toContain("Registration &lt;required&gt;");
    expect(ld.description).toContain("experience &amp; more");
  });

  it("uses Perseus Talent as the hiring organisation unless the employer is disclosed", () => {
    const hidden = getJobPostingJsonLd({
      ...baseJob,
      meta: { ...baseJob.meta, employerDisclosed: false },
    }) as Record<string, any>;
    expect(hidden.hiringOrganization.name).toBe("Perseus Talent");
    expect(hidden.hiringOrganization.sameAs).toBe(BASE);
    const noName = getJobPostingJsonLd({
      ...baseJob,
      meta: { ...baseJob.meta, employerName: undefined },
    }) as Record<string, any>;
    expect(noName.hiringOrganization.name).toBe("Perseus Talent");
    expect(ld.hiringOrganization.name).toBe("Test Employer");
  });

  it("maps employment types to Google's values", () => {
    const map: Record<string, string> = {
      Permanent: "FULL_TIME",
      "Full-time": "FULL_TIME",
      "Part-time": "PART_TIME",
      Contract: "CONTRACTOR",
      Temporary: "TEMPORARY",
    };
    for (const [from, to] of Object.entries(map)) {
      const out = getJobPostingJsonLd({
        ...baseJob,
        meta: { ...baseJob.meta, employmentType: from as JobItem["meta"]["employmentType"] },
      }) as Record<string, any>;
      expect(out.employmentType).toBe(to);
    }
  });

  it("omits baseSalary, validThrough and region when they are not given (nothing invented)", () => {
    const out = getJobPostingJsonLd({
      ...baseJob,
      meta: {
        ...baseJob.meta,
        salaryMin: undefined,
        salaryMax: undefined,
        validThrough: undefined,
        region: undefined,
      },
    }) as Record<string, any>;
    expect(out.baseSalary).toBeUndefined();
    expect(out.validThrough).toBeUndefined();
    expect(out.jobLocation.address.addressRegion).toBeUndefined();
  });

  it("handles a salary with only a maximum", () => {
    const out = getJobPostingJsonLd({
      ...baseJob,
      meta: { ...baseJob.meta, salaryMin: undefined, salaryMax: 50000 },
    }) as Record<string, any>;
    expect(out.baseSalary.value.maxValue).toBe(50000);
    expect(out.baseSalary.value.minValue).toBeUndefined();
  });
});

describe("Article JSON-LD", () => {
  const article: InsightItem = {
    meta: {
      title: "Writing a Clear Job Brief",
      slug: "writing-a-clear-job-brief",
      excerpt: "How to write a good brief.",
      category: "Employer Guidance",
      date: "2026-11-05",
      updated: "2026-11-06",
      author: "Perseus Talent",
      image: "/images/insights/job-brief.webp",
      imageAlt: "A desk",
      featured: false,
      status: "published",
    },
    content: "",
  };

  it("has headline, image, dates, author, publisher with logo, and mainEntityOfPage", () => {
    const ld = getArticleJsonLd(article) as Record<string, any>;
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe("Writing a Clear Job Brief");
    expect(ld.image).toEqual([`${BASE}/images/insights/job-brief.webp`]);
    expect(ld.datePublished).toBe("2026-11-05");
    expect(ld.dateModified).toBe("2026-11-06");
    expect(ld.author["@type"]).toBe("Organization");
    expect(ld.author.name).toBe("Perseus Talent");
    expect(ld.publisher["@type"]).toBe("Organization");
    expect(ld.publisher.logo.url).toBe(`${BASE}/brand/logo-emblem-512.png`);
    expect(ld.mainEntityOfPage["@id"]).toBe(`${BASE}/insights/writing-a-clear-job-brief`);
  });

  it("falls back to the branded default image and the published date", () => {
    const ld = getArticleJsonLd({
      ...article,
      meta: { ...article.meta, image: undefined, updated: undefined },
    }) as Record<string, any>;
    expect(ld.image).toEqual([`${BASE}/opengraph-image`]);
    expect(ld.dateModified).toBe("2026-11-05");
  });

  it("caps the headline at 110 characters", () => {
    const ld = getArticleJsonLd({
      ...article,
      meta: { ...article.meta, title: "T".repeat(200) },
    }) as Record<string, any>;
    expect(ld.headline.length).toBeLessThanOrEqual(110);
  });
});

describe("EmploymentAgency JSON-LD", () => {
  const ld = getOrganizationJsonLd() as Record<string, any>;

  it("has the agreed properties", () => {
    expect(ld["@type"]).toBe("EmploymentAgency");
    expect(ld.name).toBe("Perseus Talent");
    expect(ld.url).toBe(BASE);
    expect(ld.logo).toBe(`${BASE}/brand/logo-emblem-512.png`);
    expect(ld.email).toBe("Perseustalent@gmail.com");
    expect(ld.telephone).toBe("+447555004374");
    expect(ld.areaServed).toBe("GB");
    expect(ld.knowsAbout).toEqual(["Healthcare recruitment"]);
  });

  it("has no address and no social links (none were supplied)", () => {
    expect(ld.address).toBeUndefined();
    expect(ld.sameAs).toBeUndefined();
    expect(JSON.stringify(ld)).not.toMatch(/facebook|linkedin|twitter|instagram/i);
  });

  it("website schema is valid", () => {
    const site = getWebSiteJsonLd() as Record<string, any>;
    expect(site["@type"]).toBe("WebSite");
    expect(site.url).toBe(BASE);
  });
});

describe("BreadcrumbList and FAQPage JSON-LD", () => {
  it("builds absolute, numbered breadcrumb items", () => {
    const ld = getBreadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Opportunities", url: "/opportunities" },
      { name: "Role", url: "/opportunities/role" },
    ]) as Record<string, any>;
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement.map((i: any) => i.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement[2].item).toBe(`${BASE}/opportunities/role`);
  });

  it("builds a FAQPage with Question and Answer", () => {
    const ld = getFaqPageJsonLd([{ question: "Q?", answer: "A." }]) as Record<string, any>;
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("A.");
  });
});
