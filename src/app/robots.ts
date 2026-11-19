import { MetadataRoute } from "next";
import { getSiteUrl, isIndexingAllowed } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /api/ also covers the admin API (/api/keystatic).
      disallow: ["/api/", "/dev/", "/keystatic", "/styleguide"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
