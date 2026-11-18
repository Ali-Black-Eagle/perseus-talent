import { getInsights, type InsightItem } from "@/lib/content";

export const INSIGHT_CATEGORIES = [
  "Healthcare Recruitment",
  "Recruitment Industry",
  "Employer Guidance",
  "Candidate Advice",
  "Career Development",
  "Interview Preparation",
  "Talent Acquisition",
  "Professional Insights",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCategoryFromSlug(slug: string): string | undefined {
  const normalized = slug.toLowerCase().trim();
  return INSIGHT_CATEGORIES.find(
    (cat) => slugifyCategory(cat) === normalized
  );
}

export async function getInsightsByCategory(
  categorySlugOrName: string
): Promise<{ categoryName: string; articles: InsightItem[] }> {
  const articles = await getInsights();
  const matchedName =
    getCategoryFromSlug(categorySlugOrName) || categorySlugOrName;

  const filtered = articles.filter(
    (a) =>
      a.meta.category.toLowerCase().trim() === matchedName.toLowerCase().trim() ||
      slugifyCategory(a.meta.category) === slugifyCategory(categorySlugOrName)
  );

  return {
    categoryName: matchedName,
    articles: filtered,
  };
}
