import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import path from "path";
import fs from "fs";
import os from "os";
import {
  getInsights,
  getInsightBySlug,
  getSpecialisms,
  getSpecialismBySlug,
} from "@/lib/content";

const FIXTURES = path.resolve(__dirname, "../fixtures/content");

beforeEach(() => {
  vi.stubEnv("CONTENT_DIR", FIXTURES);
  vi.stubEnv("SHOW_DRAFTS", "false");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("slug from file name", () => {
  it("uses the file name when the front matter has no slug", async () => {
    const article = await getInsightBySlug("test-published-article");
    expect(article?.meta.slug).toBe("test-published-article");
    expect(article?.meta.title).toBe("Test Published Article");
    expect((await getSpecialismBySlug("test-specialism"))?.meta.slug).toBe("test-specialism");
  });

  it("still honours an explicit slug in the front matter", async () => {
    vi.stubEnv("SHOW_DRAFTS", "true");
    const draft = await getInsightBySlug("test-draft-article");
    expect(draft?.meta.slug).toBe("test-draft-article");
  });

  it("keeps every real content file valid and gives each one a slug", async () => {
    vi.stubEnv("CONTENT_DIR", "");
    const specialisms = await getSpecialisms();
    expect(specialisms.map((s) => s.meta.slug)).toContain("healthcare");
    const insights = await getInsights();
    expect(insights.length).toBeGreaterThan(0);
    for (const i of insights) expect(i.meta.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("the real content folder holds only insights and specialisms collections", () => {
    const root = path.resolve(__dirname, "../../content");
    const dirs = fs
      .readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    expect(dirs).toEqual(["insights", "specialisms"]);
  });
});

describe("empty optional fields", () => {
  it("treats null and empty strings as not set", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "perseus-content-"));
    try {
      fs.mkdirSync(path.join(tmp, "insights"));
      fs.writeFileSync(
        path.join(tmp, "insights/empty-fields.mdx"),
        '---\ntitle: Empty Fields\nexcerpt: Excerpt\ncategory: Candidate Advice\ndate: 2026-11-02\nupdated: ""\nimage: null\nimageAlt: ""\n---\nBody\n'
      );
      vi.stubEnv("CONTENT_DIR", tmp);
      const article = await getInsightBySlug("empty-fields");
      expect(article).not.toBeNull();
      expect(article?.meta.updated).toBeUndefined();
      expect(article?.meta.image).toBeUndefined();
      expect(article?.meta.imageAlt).toBeUndefined();
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("turns unquoted YAML dates into YYYY-MM-DD strings", async () => {
    const article = await getInsightBySlug("test-published-article");
    expect(article?.meta.date).toBe("2026-11-02");
    expect(article?.meta.updated).toBe("2026-11-03");
  });
});

describe("drafts", () => {
  it("hides draft articles by default and shows them with SHOW_DRAFTS=true", async () => {
    expect((await getInsights()).map((i) => i.meta.slug)).toEqual(["test-published-article"]);
    vi.stubEnv("SHOW_DRAFTS", "true");
    expect((await getInsights()).map((i) => i.meta.slug).sort()).toEqual([
      "test-draft-article",
      "test-published-article",
    ]);
  });

  it("never shows drafts in production, even with SHOW_DRAFTS=true", async () => {
    vi.stubEnv("SHOW_DRAFTS", "true");
    vi.stubEnv("NODE_ENV", "production");
    expect(await getInsightBySlug("test-draft-article")).toBeNull();
    expect((await getInsights()).map((i) => i.meta.slug)).toEqual(["test-published-article"]);
  });

  it("a missing content folder gives an empty list", async () => {
    vi.stubEnv("CONTENT_DIR", path.join(os.tmpdir(), "perseus-does-not-exist"));
    expect(await getInsights()).toEqual([]);
    expect(await getSpecialisms()).toEqual([]);
  });
});

describe("invalid content", () => {
  it("fails loudly with the file name instead of silently dropping the page", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "perseus-content-"));
    try {
      fs.mkdirSync(path.join(tmp, "insights"));
      fs.writeFileSync(path.join(tmp, "insights/broken.mdx"), "---\ntitle: Broken\n---\nBody\n");
      vi.stubEnv("CONTENT_DIR", tmp);
      await expect(getInsights()).rejects.toThrow(/content\/insights\/broken\.mdx/);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
