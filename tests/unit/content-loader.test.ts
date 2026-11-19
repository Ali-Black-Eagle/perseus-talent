import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import path from "path";
import fs from "fs";
import os from "os";
import {
  getJobs,
  getJobPages,
  getJobBySlug,
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
  it("uses the file name when the front matter has no slug (Keystatic style)", async () => {
    const job = await getJobBySlug("test-open-role");
    expect(job?.meta.slug).toBe("test-open-role");
    expect(job?.meta.title).toBe("Test Open Role");
  });

  it("still honours an explicit slug in the front matter (existing files)", async () => {
    vi.stubEnv("SHOW_DRAFTS", "true");
    const job = await getJobBySlug("test-draft-role");
    expect(job?.meta.slug).toBe("test-draft-role");
  });

  it("works for insights and specialisms too", async () => {
    expect((await getInsightBySlug("test-published-article"))?.meta.title).toBe("Test Published Article");
    expect((await getSpecialismBySlug("test-specialism"))?.meta.title).toBe("Test Specialism");
  });

  it("keeps every real content file valid and gives each one a slug", async () => {
    vi.stubEnv("CONTENT_DIR", "");
    const specialisms = await getSpecialisms();
    expect(specialisms.map((s) => s.meta.slug)).toContain("healthcare");
    const insights = await getInsights();
    expect(insights.length).toBeGreaterThan(0);
    for (const i of insights) expect(i.meta.slug).toMatch(/^[a-z0-9-]+$/);
    // The real content folder must never hold a made-up or test vacancy.
    expect(
      fs.existsSync(path.resolve(__dirname, "../../content/jobs/lead-clinical-nurse-specialist.mdx"))
    ).toBe(false);
  });
});

describe("Keystatic empty optional fields", () => {
  it("treats null and empty strings as not set", async () => {
    const job = await getJobBySlug("test-closed-role");
    expect(job).not.toBeNull();
    expect(job?.meta.region).toBeUndefined();
    expect(job?.meta.salaryMin).toBeUndefined();
    expect(job?.meta.salaryText).toBeUndefined();
    expect(job?.meta.employerName).toBeUndefined();
    expect(job?.meta.validThrough).toBeUndefined();
  });

  it("turns unquoted YAML dates into YYYY-MM-DD strings", async () => {
    const job = await getJobBySlug("test-open-role");
    expect(job?.meta.datePosted).toBe("2026-11-01");
    expect(job?.meta.validThrough).toBe("2026-12-31");
  });
});

describe("job lifecycle", () => {
  it("lists only open jobs on /opportunities", async () => {
    const slugs = (await getJobs()).map((j) => j.meta.slug);
    expect(slugs).toEqual(["test-open-role"]);
  });

  it("closed jobs are not listed but keep their page", async () => {
    expect((await getJobs()).some((j) => j.meta.slug === "test-closed-role")).toBe(false);
    const closed = await getJobBySlug("test-closed-role");
    expect(closed?.meta.status).toBe("closed");
    expect((await getJobPages()).map((j) => j.meta.slug)).toContain("test-closed-role");
  });

  it("hides drafts everywhere by default", async () => {
    expect(await getJobBySlug("test-draft-role")).toBeNull();
    expect((await getJobPages()).map((j) => j.meta.slug)).not.toContain("test-draft-role");
  });

  it("shows drafts locally only when SHOW_DRAFTS=true", async () => {
    vi.stubEnv("SHOW_DRAFTS", "true");
    expect((await getJobs()).map((j) => j.meta.slug)).toContain("test-draft-role");
    expect(await getJobBySlug("test-draft-role")).not.toBeNull();
  });

  it("never shows drafts in production, even with SHOW_DRAFTS=true", async () => {
    vi.stubEnv("SHOW_DRAFTS", "true");
    vi.stubEnv("NODE_ENV", "production");
    expect((await getJobs()).map((j) => j.meta.slug)).toEqual(["test-open-role"]);
    expect(await getJobBySlug("test-draft-role")).toBeNull();
    expect(await getInsightBySlug("test-draft-article")).toBeNull();
  });

  it("an empty or closed-only folder gives an empty list", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "perseus-content-"));
    try {
      fs.mkdirSync(path.join(tmp, "jobs"));
      fs.copyFileSync(
        path.join(FIXTURES, "jobs/test-closed-role.mdx"),
        path.join(tmp, "jobs/test-closed-role.mdx")
      );
      vi.stubEnv("CONTENT_DIR", tmp);
      expect(await getJobs()).toEqual([]);
      expect((await getJobPages()).length).toBe(1);
      vi.stubEnv("CONTENT_DIR", path.join(tmp, "does-not-exist"));
      expect(await getJobs()).toEqual([]);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});

describe("insight drafts", () => {
  it("hides draft articles by default and shows them with SHOW_DRAFTS=true", async () => {
    expect((await getInsights()).map((i) => i.meta.slug)).toEqual(["test-published-article"]);
    vi.stubEnv("SHOW_DRAFTS", "true");
    expect((await getInsights()).map((i) => i.meta.slug).sort()).toEqual([
      "test-draft-article",
      "test-published-article",
    ]);
  });
});

describe("invalid content", () => {
  it("fails loudly with the file name instead of silently dropping the page", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "perseus-content-"));
    try {
      fs.mkdirSync(path.join(tmp, "jobs"));
      fs.writeFileSync(path.join(tmp, "jobs/broken.mdx"), "---\ntitle: Broken\nstatus: open\n---\nBody\n");
      vi.stubEnv("CONTENT_DIR", tmp);
      await expect(getJobs()).rejects.toThrow(/content\/jobs\/broken\.mdx/);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
