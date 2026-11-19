import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import {
  createPageMetadata,
  fitTitle,
  fitDescription,
  buildJobDescription,
  buildArticleDescription,
  buildSpecialismDescription,
  buildCategoryMetadata,
  TITLE_SUFFIX,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";
import { INSIGHT_CATEGORIES } from "@/config/insight-categories";
import { getInsights, getJobPages, getSpecialisms, type JobItem, type InsightItem } from "@/lib/content";

const BASE = "https://perseustalent.co.uk";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", BASE);
  vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
});
afterEach(() => vi.unstubAllEnvs());

type OgImage = { url: string; width?: number; height?: number; alt?: string };

function fullTitle(meta: ReturnType<typeof createPageMetadata>): string {
  const og = meta.openGraph as { title?: string };
  return og.title as string;
}

function expectGoodMetadata(meta: ReturnType<typeof createPageMetadata>, label: string) {
  const title = fullTitle(meta);
  expect(title.length, `${label}: title "${title}" is ${title.length} chars`).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
  const description = meta.description as string;
  expect(
    description.length,
    `${label}: description is ${description.length} chars: "${description}"`
  ).toBeGreaterThanOrEqual(MIN_DESCRIPTION_LENGTH);
  expect(description.length, `${label}: description is ${description.length} chars`).toBeLessThanOrEqual(
    MAX_DESCRIPTION_LENGTH
  );
  const images = (meta.openGraph as { images: OgImage[] }).images;
  expect(images[0].url, label).toMatch(/^https:\/\/perseustalent\.co\.uk\//);
  expect((meta.twitter as { card: string }).card).toBe("summary_large_image");
  expect((meta.twitter as { images: OgImage[] }).images[0].url).toBe(images[0].url);
  expect((meta.alternates as { languages: Record<string, string> }).languages["en-GB"]).toBe(
    (meta.alternates as { canonical: string }).canonical
  );
}

describe("fixed pages", () => {
  const entries = Object.entries(pageSeo);

  it.each(entries)("%s has a valid title, description, canonical and share image", (name, seo) => {
    const meta = createPageMetadata(seo);
    expectGoodMetadata(meta, name);
    const expectedCanonical = seo.path === "/" ? BASE : `${BASE}${seo.path}`;
    expect((meta.alternates as { canonical: string }).canonical).toBe(expectedCanonical);
  });

  it("uses a unique description on every page", () => {
    const descriptions = entries.map(([, s]) => s.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("home describes UK healthcare recruitment", () => {
    expect(pageSeo.home.description.toLowerCase()).toContain("uk healthcare recruitment");
  });

  it("the requested titles are in place", () => {
    expect(pageSeo.feeCalculator.title).toBe("Recruitment Fee Calculator — 15% Flat Fee");
    expect(pageSeo.candidates.title).toBe("Healthcare Jobs & Career Opportunities");
    expect(pageSeo.about.title).toBe("About Us — Relationship-Led Recruitment");
    expect(pageSeo.employers.title).toBe("Healthcare Recruitment for Employers");
  });

  it("every public page file takes its metadata from the shared config or a content generator", () => {
    const appDir = path.resolve(__dirname, "../../src/app");
    const skip = ["dev", "styleguide", "keystatic"];
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          if (!skip.includes(e.name) && e.name !== "api") walk(full);
        } else if (e.name === "page.tsx") files.push(full);
      }
    };
    walk(appDir);
    expect(files.length).toBeGreaterThan(10);
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      const ok =
        /createPageMetadata\(pageSeo\.\w+\)/.test(src) ||
        (/generateMetadata/.test(src) && /createPageMetadata\(/.test(src));
      expect(ok, `${path.relative(appDir, f)} must use createPageMetadata`).toBe(true);
    }
  });
});

describe("share image and Twitter card", () => {
  it("always includes the default /opengraph-image unless overridden", () => {
    const meta = createPageMetadata(pageSeo.about);
    const images = (meta.openGraph as { images: OgImage[] }).images;
    expect(images).toHaveLength(1);
    expect(images[0].url).toBe(`${BASE}/opengraph-image`);
    expect(images[0].width).toBe(1200);
    expect(images[0].height).toBe(630);
    expect(images[0].alt).toBeTruthy();
  });

  it("allows an override (articles use their own image)", () => {
    const meta = createPageMetadata({ ...pageSeo.about, image: "/images/insights/job-brief.webp", imageAlt: "A desk" });
    const images = (meta.openGraph as { images: OgImage[] }).images;
    expect(images[0].url).toBe(`${BASE}/images/insights/job-brief.webp`);
    expect(images[0].alt).toBe("A desk");
  });

  it("marks articles as og:type article", () => {
    const meta = createPageMetadata({ ...pageSeo.about, ogType: "article", publishedTime: "2026-11-01" });
    expect((meta.openGraph as { type: string }).type).toBe("article");
  });
});

describe("robots meta", () => {
  it("is noindex, nofollow unless NEXT_PUBLIC_ALLOW_INDEXING is exactly true", () => {
    for (const value of [undefined, "", "false", "TRUE", "1", "yes"]) {
      if (value === undefined) vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
      else vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", value);
      expect(createPageMetadata(pageSeo.about).robots, `value ${String(value)}`).toEqual({
        index: false,
        follow: false,
      });
    }
  });

  it("is index, follow when indexing is on", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect(createPageMetadata(pageSeo.about).robots).toEqual({ index: true, follow: true });
  });

  it("a noIndex page stays noindex even when indexing is on", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect(createPageMetadata({ ...pageSeo.about, noIndex: true }).robots).toEqual({
      index: false,
      follow: false,
    });
  });
});

describe("fitTitle", () => {
  it("leaves short titles alone", () => {
    expect(fitTitle("Contact Our Team")).toBe("Contact Our Team");
  });

  it("shortens long titles so title + suffix is at most 60 characters", () => {
    const long = "A Very Long Article Title About Healthcare Recruitment Fees And How They Work In Practice";
    const fitted = fitTitle(long);
    expect(`${fitted}${TITLE_SUFFIX}`.length).toBeLessThanOrEqual(60);
    expect(fitted.endsWith("…")).toBe(true);
    expect(fitted).not.toMatch(/\s…$/);
  });

  it("cuts before a subtitle when the main title fits", () => {
    expect(fitTitle("Preparing for a Healthcare Interview: A Practical Guide for Clinical Professionals")).toBe(
      "Preparing for a Healthcare Interview"
    );
    expect(fitTitle("Understanding Recruitment Fees — How a Flat-Rate Model Works In Practice")).toBe(
      "Understanding Recruitment Fees"
    );
  });

  it("handles a title with no spaces", () => {
    const fitted = fitTitle("X".repeat(100));
    expect(`${fitted}${TITLE_SUFFIX}`.length).toBeLessThanOrEqual(60);
  });
});

describe("fitDescription", () => {
  it("cuts long text at a sentence end when one fits", () => {
    const text =
      "This is the first sentence and it is deliberately long, so that it ends after the minimum length of one hundred and twenty characters. Second sentence is here and it is also quite long, definitely too long to fit.";
    const out = fitDescription(text);
    expect(out.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    expect(out.endsWith(".")).toBe(true);
  });

  it("cuts at a word with an ellipsis when there is no sentence end", () => {
    const text = "word ".repeat(80);
    const out = fitDescription(text);
    expect(out.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    expect(out.length).toBeGreaterThanOrEqual(MIN_DESCRIPTION_LENGTH);
    expect(out.endsWith("…")).toBe(true);
  });

  it("pads short text from the supplied sentences", () => {
    const out = fitDescription("Short text.", [
      "Padding sentence number one makes it longer.",
      "Padding sentence number two makes it longer still, until the description is long enough to use.",
    ]);
    expect(out.length).toBeGreaterThanOrEqual(MIN_DESCRIPTION_LENGTH);
    expect(out.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
  });
});

describe("generated descriptions", () => {
  it("every Insights category page has a valid title and description", () => {
    for (const category of INSIGHT_CATEGORIES) {
      const { title, description } = buildCategoryMetadata(category);
      const meta = createPageMetadata({ title, description, path: `/insights/category/x` });
      expectGoodMetadata(meta, `category ${category}`);
    }
  });

  it("every real article gets a valid title and description", async () => {
    vi.stubEnv("CONTENT_DIR", "");
    const articles = await getInsights();
    expect(articles.length).toBeGreaterThan(0);
    for (const a of articles) {
      const meta = createPageMetadata({
        title: a.meta.title,
        description: buildArticleDescription(a),
        path: `/insights/${a.meta.slug}`,
      });
      expectGoodMetadata(meta, `article ${a.meta.slug}`);
    }
  });

  it("every real specialism gets a valid description", async () => {
    vi.stubEnv("CONTENT_DIR", "");
    for (const s of await getSpecialisms()) {
      const meta = createPageMetadata({
        title: `${s.meta.title} Recruitment`,
        description: buildSpecialismDescription(s.meta.title, s.meta.summary),
        path: `/specialisms/${s.meta.slug}`,
      });
      expectGoodMetadata(meta, `specialism ${s.meta.slug}`);
    }
  });

  it("jobs: long titles are shortened and the description is 120 to 155 characters", async () => {
    vi.stubEnv("CONTENT_DIR", path.resolve(__dirname, "../fixtures/content"));
    const jobs = await getJobPages();
    expect(jobs.length).toBeGreaterThan(0);
    for (const j of jobs) {
      const meta = createPageMetadata({
        title: j.meta.title,
        description: buildJobDescription(j, "Healthcare"),
        path: `/opportunities/${j.meta.slug}`,
      });
      expectGoodMetadata(meta, `job ${j.meta.slug}`);
    }
    const longJob: JobItem = {
      meta: {
        ...jobs[0].meta,
        title: "Senior Advanced Clinical Practitioner (Emergency Medicine and Urgent Care Services)",
        requiredExperience: "x ".repeat(200),
      },
      content: "",
    };
    expectGoodMetadata(
      createPageMetadata({
        title: longJob.meta.title,
        description: buildJobDescription(longJob, "Healthcare"),
        path: "/opportunities/long",
      }),
      "long job"
    );
  });

  it("articles: a very long title and a short excerpt still produce valid metadata", () => {
    const article: InsightItem = {
      meta: {
        title: "How Healthcare Organisations Can Build A Resilient Hiring Pipeline Across Clinical And Operational Roles",
        slug: "long",
        excerpt: "A short excerpt.",
        category: "Employer Guidance",
        date: "2026-11-01",
        author: "Perseus Talent",
        featured: false,
        status: "published",
      },
      content: "",
    };
    expectGoodMetadata(
      createPageMetadata({
        title: article.meta.title,
        description: buildArticleDescription(article),
        path: "/insights/long",
      }),
      "long article"
    );
  });
});
