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
      disallow: ["/api/", "/dev/", "/styleguide"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
