import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

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
  datePosted: z.string(),
  validThrough: z.string().optional(),
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
  date: z.string(),
  updated: z.string().optional(),
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

export async function getSpecialisms(): Promise<SpecialismItem[]> {
  const dir = path.join(process.cwd(), "content", "specialisms");
  try {
    const files = await fs.readdir(dir);
    const mdxFiles = files.filter(
      (f) => (f.endsWith(".mdx") || f.endsWith(".md")) && !f.startsWith("_")
    );

    const items: SpecialismItem[] = [];
    for (const file of mdxFiles) {
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const meta = specialismSchema.parse(data);
      items.push({ meta, content });
    }

    return items.sort((a, b) => a.meta.order - b.meta.order);
  } catch {
    return [];
  }
}

export async function getSpecialismBySlug(
  slug: string
): Promise<SpecialismItem | null> {
  const specialisms = await getSpecialisms();
  return specialisms.find((s) => s.meta.slug === slug) || null;
}

export async function getJobs(): Promise<JobItem[]> {
  const dir = path.join(process.cwd(), "content", "jobs");
  try {
    const files = await fs.readdir(dir);
    const mdxFiles = files.filter(
      (f) => (f.endsWith(".mdx") || f.endsWith(".md")) && !f.startsWith("_")
    );

    const items: JobItem[] = [];
    for (const file of mdxFiles) {
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const meta = jobSchema.parse(data);
      // Only include open jobs unless SHOW_DRAFTS is true
      if (meta.status === "open" || process.env.SHOW_DRAFTS === "true") {
        items.push({ meta, content });
      }
    }

    return items.sort(
      (a, b) =>
        new Date(b.meta.datePosted).getTime() -
        new Date(a.meta.datePosted).getTime()
    );
  } catch {
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<JobItem | null> {
  const jobs = await getJobs();
  return jobs.find((j) => j.meta.slug === slug) || null;
}

export async function getInsights(): Promise<InsightItem[]> {
  const dir = path.join(process.cwd(), "content", "insights");
  try {
    const files = await fs.readdir(dir);
    const mdxFiles = files.filter(
      (f) => (f.endsWith(".mdx") || f.endsWith(".md")) && !f.startsWith("_")
    );

    const items: InsightItem[] = [];
    for (const file of mdxFiles) {
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const meta = insightSchema.parse(data);
      // Filter drafts according to SHOW_DRAFTS
      if (meta.status === "published" || process.env.SHOW_DRAFTS === "true") {
        items.push({ meta, content });
      }
    }

    return items.sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );
  } catch {
    return [];
  }
}

export async function getInsightBySlug(slug: string): Promise<InsightItem | null> {
  const insights = await getInsights();
  return insights.find((i) => i.meta.slug === slug) || null;
}
