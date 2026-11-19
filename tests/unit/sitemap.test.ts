import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import path from "path";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { STATIC_PAGES_LAST_MODIFIED, STATIC_ROUTES } from "@/lib/sitemap-routes";

const FIXTURES = path.resolve(__dirname, "../fixtures/content");
const BASE = "https://perseustalent.co.uk";

beforeEach(() => {
  vi.stubEnv("CONTENT_DIR", FIXTURES);
  vi.stubEnv("SHOW_DRAFTS", "true");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", BASE);
});
afterEach(() => vi.unstubAllEnvs());

describe("sitemap", () => {
  it("excludes /api, /dev, /styleguide, drafts and any job URLs", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    for (const u of urls) {
      expect(u).not.toContain("opportunities");
      expect(u).not.toMatch(/\/api\//);
      expect(u).not.toMatch(/\/dev(\/|$)/);
      expect(u).not.toMatch(/styleguide/);
    }
    expect(urls).not.toContain(`${BASE}/insights/test-draft-article`);
  });

  it("includes published articles and specialisms", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toContain(`${BASE}/insights/test-published-article`);
    expect(urls).toContain(`${BASE}/specialisms/test-specialism`);
    expect(urls).toContain(BASE);
  });

  it("uses fixed dates for static pages and content dates for articles", async () => {
    const entries = await sitemap();
    const byUrl = new Map(entries.map((e) => [e.url, e]));
    for (const route of STATIC_ROUTES) {
      const e = byUrl.get(`${BASE}${route}`);
      expect(e?.lastModified).toEqual(STATIC_PAGES_LAST_MODIFIED);
    }
    expect(STATIC_PAGES_LAST_MODIFIED.getTime()).toBeLessThan(Date.now());
    // The article has updated: 2026-11-03, which wins over date: 2026-11-02.
    expect(byUrl.get(`${BASE}/insights/test-published-article`)?.lastModified).toEqual(new Date("2026-11-03"));
  });

  it("is identical between calls (no build-time 'now')", async () => {
    const a = JSON.stringify(await sitemap());
    const b = JSON.stringify(await sitemap());
    expect(a).toBe(b);
  });
});

describe("robots.txt", () => {
  it("blocks everything while indexing is off", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "false");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("when live: allows the site, hides dev/styleguide/api, links the sitemap", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    const r = robots();
    const rules = r.rules as { allow: string; disallow: string[] };
    expect(rules.allow).toBe("/");
    expect(rules.disallow).toEqual(expect.arrayContaining(["/api/", "/dev/", "/styleguide"]));
    expect(r.sitemap).toBe(`${BASE}/sitemap.xml`);
  });
});
