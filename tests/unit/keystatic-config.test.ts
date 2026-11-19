import { describe, it, expect } from "vitest";
import config from "../../keystatic.config";
import { jobSchema, insightSchema, specialismSchema } from "@/lib/content";
import { INSIGHT_CATEGORIES } from "@/config/insight-categories";
import { isAdminEnabled } from "@/lib/admin";
import { vi } from "vitest";

/**
 * The admin panel writes the front matter that src/lib/content.ts reads. These tests keep the two in step:
 * every field the site needs must have a form field, with matching choices.
 */

type AnyField = { options?: { value: string }[] };
type Collection = { slugField: string; path?: string; format?: { contentField?: string }; schema: Record<string, AnyField> };

const collections = config.collections as unknown as Record<string, Collection>;

function schemaKeys(shape: Record<string, unknown>): string[] {
  return Object.keys(shape);
}

function optionValues(field: AnyField): string[] {
  return (field.options ?? []).map((o) => o.value).sort();
}

describe("Keystatic collections match the Zod schemas", () => {
  it("has the three collections, stored under content/", () => {
    expect(Object.keys(collections).sort()).toEqual(["insights", "jobs", "specialisms"]);
    expect(collections.jobs.path).toBe("content/jobs/*");
    expect(collections.insights.path).toBe("content/insights/*");
    expect(collections.specialisms.path).toBe("content/specialisms/*");
    for (const c of Object.values(collections)) expect(c.slugField).toBe("title");
  });

  it("jobs: every schema field (except the file-name slug) has a form field", () => {
    const keys = schemaKeys(jobSchema.shape).filter((k) => k !== "slug");
    for (const k of keys) expect(collections.jobs.schema, `job field ${k}`).toHaveProperty(k);
    expect(collections.jobs.format?.contentField).toBe("description");
    expect(optionValues(collections.jobs.schema.status)).toEqual([...jobSchema.shape.status.options].sort());
    expect(optionValues(collections.jobs.schema.employmentType)).toEqual([...jobSchema.shape.employmentType.options].sort());
  });

  it("insights: every schema field (except the file-name slug) has a form field", () => {
    const keys = schemaKeys(insightSchema.shape).filter((k) => k !== "slug");
    for (const k of keys) expect(collections.insights.schema, `insight field ${k}`).toHaveProperty(k);
    expect(collections.insights.format?.contentField).toBe("body");
    expect(optionValues(collections.insights.schema.status)).toEqual([...insightSchema.shape.status.removeDefault().options].sort());
    expect(optionValues(collections.insights.schema.category)).toEqual([...INSIGHT_CATEGORIES].sort());
  });

  it("specialisms: every schema field (except the file-name slug) has a form field", () => {
    const keys = schemaKeys(specialismSchema.shape).filter((k) => k !== "slug");
    for (const k of keys) expect(collections.specialisms.schema, `specialism field ${k}`).toHaveProperty(k);
    expect(collections.specialisms.format?.contentField).toBe("body");
    expect(optionValues(collections.specialisms.schema.status)).toEqual([...specialismSchema.shape.status.removeDefault().options].sort());
  });

  it("uses local storage unless GitHub storage is configured", () => {
    expect(config.storage.kind).toBe("local");
  });
});

describe("admin availability", () => {
  it("is on in development, off in production unless KEYSTATIC_STORAGE=github", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("KEYSTATIC_STORAGE", "");
    expect(isAdminEnabled()).toBe(true);

    vi.stubEnv("NODE_ENV", "production");
    expect(isAdminEnabled()).toBe(false);

    vi.stubEnv("KEYSTATIC_STORAGE", "local");
    expect(isAdminEnabled()).toBe(false);

    vi.stubEnv("KEYSTATIC_STORAGE", "github");
    expect(isAdminEnabled()).toBe(true);
    vi.unstubAllEnvs();
  });
});

// Keystatic refuses to open an entry whose front matter has a key it doesn't know
// ("Key on object value ... is not allowed"). Check every real content file against its collection.
describe("Real content files only use keys the admin panel knows", () => {
  it.each(["jobs", "insights", "specialisms"])("content/%s", async (name) => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const matter = (await import("gray-matter")).default;
    const dir = path.join(process.cwd(), "content", name);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")) : [];
    const allowed = Object.keys(collections[name].schema);
    for (const file of files) {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      for (const key of Object.keys(data)) {
        expect(allowed, `${name}/${file} has front-matter key "${key}" the admin panel doesn't know`).toContain(key);
      }
    }
  });
});
