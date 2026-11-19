import { MetadataRoute } from "next";
import { getSpecialisms, getInsights, getJobs } from "@/lib/content";
import { getSiteUrl } from "@/lib/seo";
import { STATIC_PAGES_LAST_MODIFIED, STATIC_ROUTES } from "@/lib/sitemap-routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: STATIC_PAGES_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const specialisms = await getSpecialisms();
  const specialismRoutes = specialisms.map((s) => ({
    url: `${baseUrl}/specialisms/${s.meta.slug}`,
    lastModified: STATIC_PAGES_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Published articles only, dated by when they were last updated.
  const insights = await getInsights();
  const insightRoutes = insights
    .filter((i) => i.meta.status === "published")
    .map((i) => ({
      url: `${baseUrl}/insights/${i.meta.slug}`,
      lastModified: new Date(String(i.meta.updated ?? i.meta.date)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // Open jobs only (getJobs lists open jobs, and drafts only when drafts are visible locally).
  const jobs = await getJobs();
  const jobRoutes = jobs
    .filter((j) => j.meta.status === "open")
    .map((j) => ({
      url: `${baseUrl}/opportunities/${j.meta.slug}`,
      lastModified: new Date(String(j.meta.datePosted)),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...specialismRoutes, ...insightRoutes, ...jobRoutes];
}
