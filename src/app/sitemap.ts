import { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getSpecialisms, getInsights, getJobs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/employers",
    "/candidates",
    "/specialisms",
    "/about",
    "/insights",
    "/contact",
    "/fee-calculator",
    "/opportunities",
    "/privacy-policy",
    "/cookie-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic specialisms
  const specialisms = await getSpecialisms();
  const specialismRoutes = specialisms.map((s) => ({
    url: `${baseUrl}/specialisms/${s.meta.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic published insights (exclude drafts unless SHOW_DRAFTS)
  const insights = await getInsights();
  const insightRoutes = insights
    .filter((i) => i.meta.status === "published")
    .map((i) => ({
      url: `${baseUrl}/insights/${i.meta.slug}`,
      lastModified: new Date(i.meta.date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Dynamic open jobs
  const jobs = await getJobs();
  const jobRoutes = jobs
    .filter((j) => j.meta.status === "open")
    .map((j) => ({
      url: `${baseUrl}/opportunities/${j.meta.slug}`,
      lastModified: new Date(j.meta.datePosted),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  return [
    ...staticRoutes,
    ...specialismRoutes,
    ...insightRoutes,
    ...jobRoutes,
  ];
}
