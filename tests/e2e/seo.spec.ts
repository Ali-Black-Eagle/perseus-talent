import { test, expect, type Page, type APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * SEO checks on the generated HTML of every public page.
 *
 * Works against any running build (npm run verify uses the build on port 3400). To check a build made for the
 * live site, set SEO_EXPECT_INDEXING=true and SEO_EXPECT_SITE_URL=https://perseustalent.co.uk (see DEPLOYMENT.md).
 */

const EXPECT_INDEXING = process.env.SEO_EXPECT_INDEXING; // "true" | "false" | undefined (either, but consistent)
const EXPECT_SITE_URL = process.env.SEO_EXPECT_SITE_URL;

function publishedArticleSlugs(): string[] {
  const dir = path.join(process.cwd(), "content", "insights");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .filter((f) => /^status:\s*"?published"?\s*$/m.test(fs.readFileSync(path.join(dir, f), "utf8")))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

const STATIC_PAGES = [
  "/",
  "/employers",
  "/candidates",
  "/fee-calculator",
  "/contact",
  "/about",
  "/specialisms",
  "/specialisms/healthcare",
  "/opportunities",
  "/insights",
  "/insights/category/employer-guidance",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/image-credits",
];

interface PageSeoData {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogTitle: string;
  twitterCard: string;
  robots: string;
  lang: string;
  h1Count: number;
  headingLevels: number[];
  imagesWithoutAlt: string[];
  jsonLdTypes: string[];
  jsonLdValid: boolean;
}

async function collect(page: Page): Promise<PageSeoData> {
  return page.evaluate(() => {
    const meta = (sel: string) => document.querySelector(sel)?.getAttribute("content") ?? "";
    const types: string[] = [];
    let valid = true;
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try {
        const data = JSON.parse(s.textContent || "");
        for (const item of Array.isArray(data) ? data : [data]) {
          const t = item["@type"];
          (Array.isArray(t) ? t : [t]).forEach((x: string) => types.push(x));
        }
      } catch {
        valid = false;
      }
    });
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      ogImage: meta('meta[property="og:image"]'),
      ogTitle: meta('meta[property="og:title"]'),
      twitterCard: meta('meta[name="twitter:card"]'),
      robots: meta('meta[name="robots"]'),
      lang: document.documentElement.lang,
      h1Count: document.querySelectorAll("h1").length,
      headingLevels: Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) =>
        Number(h.tagName.slice(1))
      ),
      imagesWithoutAlt: Array.from(document.querySelectorAll("img"))
        .filter((i) => !i.hasAttribute("alt"))
        .map((i) => i.getAttribute("src") || ""),
      jsonLdTypes: types,
      jsonLdValid: valid,
    };
  });
}

function expectGoodPage(data: PageSeoData, route: string, expectNoindex = false) {
  const ctx = `${route} -> "${data.title}"`;
  expect(data.title.length, `title length for ${ctx}`).toBeGreaterThan(0);
  expect(data.title.length, `title length for ${ctx}`).toBeLessThanOrEqual(60);
  expect(data.description.length, `description length for ${route}: ${data.description}`).toBeGreaterThanOrEqual(120);
  expect(data.description.length, `description length for ${route}: ${data.description}`).toBeLessThanOrEqual(155);
  expect(data.canonical, `canonical for ${route}`).toMatch(/^https?:\/\//);
  expect(data.canonical, `canonical for ${route} has no trailing slash`).not.toMatch(/.\/$/);
  expect(data.canonical.endsWith(route === "/" ? data.canonical : route), `canonical ${data.canonical} matches ${route}`).toBe(true);
  if (EXPECT_SITE_URL) expect(data.canonical.startsWith(EXPECT_SITE_URL)).toBe(true);
  expect(data.ogImage, `og:image for ${route}`).toMatch(/^https?:\/\/.+/);
  expect(data.ogTitle.length, `og:title for ${route}`).toBeGreaterThan(0);
  expect(data.ogTitle.length, `og:title for ${route}`).toBeLessThanOrEqual(60);
  expect(data.twitterCard).toBe("summary_large_image");
  expect(data.lang).toBe("en-GB");
  expect(data.h1Count, `exactly one h1 on ${route}`).toBe(1);
  // Headings in order: never skip a level going down (h2 -> h4).
  let prev = 0;
  for (const level of data.headingLevels) {
    expect(level, `heading order on ${route}: ${data.headingLevels.join(",")}`).toBeLessThanOrEqual(prev + 1);
    prev = level;
  }
  expect(data.imagesWithoutAlt, `images without alt on ${route}`).toEqual([]);
  expect(data.jsonLdValid, `JSON-LD parses on ${route}`).toBe(true);
  expect(data.jsonLdTypes, `EmploymentAgency on ${route}`).toContain("EmploymentAgency");
  expect(data.jsonLdTypes).toContain("WebSite");
  if (expectNoindex) {
    expect(data.robots).toBe("noindex, nofollow");
  } else if (EXPECT_INDEXING === "true") {
    expect(data.robots, `robots for ${route}`).toBe("index, follow");
  } else if (EXPECT_INDEXING === "false") {
    expect(data.robots, `robots for ${route}`).toBe("noindex, nofollow");
  } else {
    expect(["index, follow", "noindex, nofollow"]).toContain(data.robots);
  }
}

async function indexingFromRobotsTxt(request: APIRequestContext): Promise<boolean> {
  const txt = await (await request.get("/robots.txt")).text();
  return !/^Disallow:\s*\/\s*$/m.test(txt);
}

test.describe("SEO on every public page", () => {
  for (const route of STATIC_PAGES) {
    test(`page SEO: ${route}`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      const data = await collect(page);
      expectGoodPage(data, route);
      if (route === "/candidates") expect(data.jsonLdTypes).toContain("FAQPage");
      if (route !== "/") expect(data.jsonLdTypes).toContain("BreadcrumbList");
    });
  }

  for (const slug of publishedArticleSlugs()) {
    test(`article SEO: /insights/${slug}`, async ({ page }) => {
      const route = `/insights/${slug}`;
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      const data = await collect(page);
      expectGoodPage(data, route);
      expect(data.jsonLdTypes).toContain("Article");
      expect(data.jsonLdTypes).toContain("BreadcrumbList");
      // Own image or the branded default, never missing.
      expect(data.ogImage).toMatch(/\/(opengraph-image|images\/)/);
      // Ends with related articles and a relevant page.
      const links = await page.locator("main a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || ""));
      expect(links.some((h) => /^\/insights\/[a-z0-9-]+$/.test(h) && h !== route), "related article link").toBe(true);
      expect(links.some((h) => ["/employers", "/fee-calculator", "/candidates"].includes(h)), "relevant page link").toBe(true);
    });
  }

  test("robots meta matches robots.txt", async ({ page, request }) => {
    await page.goto("/about");
    const robots = (await collect(page)).robots;
    const indexing = await indexingFromRobotsTxt(request);
    expect(robots).toBe(indexing ? "index, follow" : "noindex, nofollow");
  });
});

test.describe("job pages", () => {
  test("open job: JobPosting, apply link, internal links, valid headings", async ({ page }) => {
    const route = "/opportunities/test-open-role";
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    const data = await collect(page);
    expectGoodPage(data, route);
    expect(data.jsonLdTypes).toContain("JobPosting");
    expect(data.jsonLdTypes).toContain("BreadcrumbList");
    await expect(page.getByRole("link", { name: /Apply for this role/ })).toBeVisible();
    await expect(page.getByTestId("closed-banner")).toHaveCount(0);
    const hrefs = await page.locator("main a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || ""));
    expect(hrefs.some((h) => h.startsWith("/candidates"))).toBe(true);
    expect(hrefs.some((h) => h.startsWith("/specialisms"))).toBe(true);
  });

  test("open job JSON-LD has Google's required properties", async ({ page }) => {
    await page.goto("/opportunities/test-open-role");
    const jobPosting = await page.evaluate(() => {
      for (const s of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
        const data = JSON.parse(s.textContent || "");
        for (const item of Array.isArray(data) ? data : [data]) if (item["@type"] === "JobPosting") return item;
      }
      return null;
    });
    expect(jobPosting).not.toBeNull();
    expect(jobPosting.title).toBe("Test Open Role");
    expect(jobPosting.description).toContain("<");
    expect(jobPosting.datePosted).toBe("2026-11-01");
    expect(jobPosting.validThrough).toBe("2026-12-31");
    expect(jobPosting.employmentType).toBe("FULL_TIME");
    expect(jobPosting.hiringOrganization.name).toBe("Test Employer");
    expect(jobPosting.jobLocation.address.addressCountry).toBe("GB");
    expect(jobPosting.baseSalary.currency).toBe("GBP");
    expect(jobPosting.directApply).toBe(false);
    expect(jobPosting.identifier.value).toBe("test-open-role");
  });

  test("closed job keeps its page with a banner, no apply button, no JobPosting, noindex", async ({ page }) => {
    const res = await page.goto("/opportunities/test-closed-role");
    expect(res?.status()).toBe(200);
    await expect(page.getByTestId("closed-banner")).toContainText("This role is no longer accepting applications");
    await expect(page.getByRole("link", { name: /Apply/ })).toHaveCount(0);
    const data = await collect(page);
    expect(data.robots).toBe("noindex, nofollow");
    expect(data.jsonLdTypes).not.toContain("JobPosting");
    expect(data.h1Count).toBe(1);
  });

  test("draft job is never visible on a production build", async ({ request }) => {
    const res = await request.get("/opportunities/test-draft-role");
    expect(res.status()).toBe(404);
  });

  test("list shows only open jobs, as real links", async ({ page, request }) => {
    await page.goto("/opportunities");
    const link = page.locator('a[href="/opportunities/test-open-role"]').first();
    await expect(link).toBeVisible();
    await expect(page.locator('a[href="/opportunities/test-closed-role"]')).toHaveCount(0);
    await expect(page.locator('a[href="/opportunities/test-draft-role"]')).toHaveCount(0);
    // The sitemap is built at deploy time from content/ (which holds no test jobs), so here we only check that
    // closed and draft jobs never appear. Open jobs in the sitemap are covered by the unit tests and the admin test.
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("test-closed-role");
    expect(sitemap).not.toContain("test-draft-role");
  });
});

test.describe("healthcare specialism internal links", () => {
  test("links to Opportunities and the Fee Calculator", async ({ page }) => {
    await page.goto("/specialisms/healthcare");
    const hrefs = await page.locator("main a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || ""));
    expect(hrefs).toContain("/opportunities");
    expect(hrefs).toContain("/fee-calculator");
  });
});

test.describe("admin is hidden on a production build", () => {
  test("/keystatic answers 404 and noindex when GitHub storage is not configured", async ({ request }) => {
    const res = await request.get("/keystatic");
    expect(res.status()).toBe(404);
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
    const sub = await request.get("/keystatic/collection/jobs");
    expect(sub.status()).toBe(404);
  });

  test("/api/keystatic answers 404 and noindex", async ({ request }) => {
    const res = await request.get("/api/keystatic/tree", { headers: { "no-cors": "1" } });
    expect(res.status()).toBe(404);
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("the public site keeps its strict CSP (no GitHub allowance)", async ({ request }) => {
    const csp = (await request.get("/about")).headers()["content-security-policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).not.toContain("github");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  test("robots.txt and the sitemap never mention the admin, /dev or /styleguide", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const bad of ["keystatic", "/dev", "styleguide", "/api/"]) expect(sitemap).not.toContain(bad);
    const txt = await (await request.get("/robots.txt")).text();
    if (/Allow:/i.test(txt)) {
      for (const must of ["/api/", "/dev/", "/keystatic", "/styleguide"]) expect(txt).toContain(`Disallow: ${must}`);
      expect(txt).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
    } else {
      expect(txt).toMatch(/Disallow:\s*\/\s*$/m);
    }
  });
});
