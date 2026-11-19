import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getOrganizationJsonLd,
  getArticleJsonLd,
  getBreadcrumbJsonLd,
  getFaqPageJsonLd,
  getWebSiteJsonLd,
} from "@/lib/seo";
import type { InsightItem } from "@/lib/content";

const BASE = "https://perseustalent.co.uk";

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SITE_URL", BASE));
afterEach(() => vi.unstubAllEnvs());

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
      { name: "Insights", url: "/insights" },
      { name: "Article", url: "/insights/article" },
    ]) as Record<string, any>;
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement.map((i: any) => i.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement[2].item).toBe(`${BASE}/insights/article`);
  });

  it("builds a FAQPage with Question and Answer", () => {
    const ld = getFaqPageJsonLd([{ question: "Q?", answer: "A." }]) as Record<string, any>;
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("A.");
  });
});
