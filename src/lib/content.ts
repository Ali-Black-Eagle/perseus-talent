import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Where the content lives. Defaults to ./content. CONTENT_DIR lets tests (and local previews) point the
 * loaders at a different folder, for example tests/fixtures/content, without touching real content.
 */
export function getContentRoot(): string {
  return path.resolve(process.cwd(), process.env.CONTENT_DIR || "content");
}

/**
 * Drafts are never shown on the live site. Locally they are shown only when SHOW_DRAFTS=true.
 */
export function draftsVisible(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.SHOW_DRAFTS === "true";
}

const dateStringSchema = z.union([
  z.string(),
  z.date().transform((d) => d.toISOString().split("T")[0]),
]);

// --- Specialism Schema ---
export const specialismSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  order: z.number().default(1),
  primary: z.boolean().default(false),
  status: z.enum(["active", "coming-soon"]).default("active"),
  image: z.string().optional(),
});

export type SpecialismMeta = z.infer<typeof specialismSchema>;

export interface SpecialismItem {
  meta: SpecialismMeta;
  content: string;
}

// --- Job Schema ---
export const jobSchema = z.object({
  title: z.string(),
  slug: z.string(),
  employerName: z.string().optional(),
  employerDisclosed: z.boolean().default(false),
  location: z.string(),
  region: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryText: z.string().optional(),
  employmentType: z.enum([
    "Permanent",
    "Contract",
    "Temporary",
    "Part-time",
    "Full-time",
  ]),
  specialism: z.string(),
  datePosted: dateStringSchema,
  validThrough: dateStringSchema.optional(),
  status: z.enum(["open", "closed", "draft"]),
  requiredExperience: z.string(),
  requiredQualifications: z.string().optional(),
  applicationInstructions: z.string().optional(),
});

export type JobMeta = z.infer<typeof jobSchema>;

export interface JobItem {
  meta: JobMeta;
  content: string;
}

// --- Insight Schema ---
export const insightSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  category: z.string(),
  date: dateStringSchema,
  updated: dateStringSchema.optional(),
  author: z.string().default("Perseus Talent"),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("published"),
});

export type InsightMeta = z.infer<typeof insightSchema>;

export interface InsightItem {
  meta: InsightMeta;
  content: string;
}

// --- Content Loaders ---

type Loaded = { data: Record<string, unknown>; content: string; file: string };

/** Keystatic writes empty optional fields as null or "". Treat them as "not set". */
function stripEmpty(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([, v]) => v !== null && v !== undefined && !(typeof v === "string" && v.trim() === "")
    )
  );
}

/**
 * Reads every .mdx/.md file in content/<collection> (ignoring files that start with "_").
 * The slug comes from the file name when the front matter has none, so both Keystatic's
 * file-name slugs and older files with an explicit slug work.
 */
async function readCollection(collection: string): Promise<Loaded[]> {
  const dir = path.join(getContentRoot(), collection);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const items: Loaded[] = [];
  for (const file of files.sort()) {
    if (!(file.endsWith(".mdx") || file.endsWith(".md")) || file.startsWith("_")) continue;
    const raw = await fs.readFile(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const fileSlug = file.replace(/\.(mdx|md)$/, "");
    const cleaned = stripEmpty(data);
    const slug =
      typeof cleaned.slug === "string" && cleaned.slug.trim() !== ""
        ? cleaned.slug
        : fileSlug;
    items.push({ data: { ...cleaned, slug }, content, file: `content/${collection}/${file}` });
  }
  return items;
}

function parseOrThrow<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, item: Loaded): T {
  const result = schema.safeParse(item.data);
  if (!result.success) {
    const problems = result.error.issues
      .map((i) => `${i.path.join(".") || "(file)"}: ${i.message}`)
      .join("; ");
    // A broken file should stop the build rather than silently disappear from the live site.
    throw new Error(`Invalid content in ${item.file}: ${problems}`);
  }
  return result.data;
}

export async function getSpecialisms(): Promise<SpecialismItem[]> {
  const items = (await readCollection("specialisms")).map((l) => ({
    meta: parseOrThrow(specialismSchema, l),
    content: l.content,
  }));
  return items.sort((a, b) => a.meta.order - b.meta.order);
}

export async function getSpecialismBySlug(
  slug: string
): Promise<SpecialismItem | null> {
  const specialisms = await getSpecialisms();
  return specialisms.find((s) => s.meta.slug === slug) || null;
}

async function loadAllJobs(): Promise<JobItem[]> {
  return (await readCollection("jobs")).map((l) => ({
    meta: parseOrThrow(jobSchema, l),
    content: l.content,
  }));
}

function byDatePostedDesc(a: JobItem, b: JobItem): number {
  return new Date(b.meta.datePosted).getTime() - new Date(a.meta.datePosted).getTime();
}

/**
 * Jobs LISTED on /opportunities: open jobs (and drafts when drafts are visible).
 * Closed jobs are not listed.
 */
export async function getJobs(): Promise<JobItem[]> {
  const showDrafts = draftsVisible();
  return (await loadAllJobs())
    .filter((j) => j.meta.status === "open" || (showDrafts && j.meta.status === "draft"))
    .sort(byDatePostedDesc);
}

/**
 * Jobs that have a page: everything listed, plus closed jobs. A closed job keeps its page
 * (with a "no longer accepting applications" banner) so old links and shared URLs do not break.
 */
export async function getJobPages(): Promise<JobItem[]> {
  const showDrafts = draftsVisible();
  return (await loadAllJobs())
    .filter((j) => j.meta.status !== "draft" || showDrafts)
    .sort(byDatePostedDesc);
}

export async function getJobBySlug(slug: string): Promise<JobItem | null> {
  const jobs = await getJobPages();
  return jobs.find((j) => j.meta.slug === slug) || null;
}

export async function getInsights(): Promise<InsightItem[]> {
  const showDrafts = draftsVisible();
  return (await readCollection("insights"))
    .map((l) => ({ meta: parseOrThrow(insightSchema, l), content: l.content }))
    .filter((i) => i.meta.status === "published" || showDrafts)
    .sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );
}

export async function getInsightBySlug(slug: string): Promise<InsightItem | null> {
  const insights = await getInsights();
  return insights.find((i) => i.meta.slug === slug) || null;
}
