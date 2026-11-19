import type { Metadata } from "next";
import { site } from "@/config/site";
import type { JobItem, InsightItem } from "@/lib/content";

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/\/+$/, "");
  }
  return site.url.replace(/\/+$/, "");
}

export function getCanonicalUrl(path: string = "/"): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/") {
    return baseUrl;
  }
  return `${baseUrl}${cleanPath.replace(/\/+$/, "")}`;
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = getCanonicalUrl(path);
  const allowIndexing =
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" && !noIndex;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: allowIndexing
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
        },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
    },
  };
}

// --- JSON-LD Schema Generators ---

/**
 * EmploymentAgency & Organization schema for Perseus Talent.
 * Strict adherence to no-fabrication rule: no postal address until confirmed.
 */
export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["EmploymentAgency", "Organization"],
    name: site.name,
    legalName: site.name,
    url: siteUrl,
    logo: `${siteUrl}/brand/logo.svg`,
    email: site.email,
    telephone: site.phoneHref.replace("tel:", ""),
    description: site.positioning,
    slogan: site.statement,
    priceRange: "15%",
  };
}

/**
 * WebSite schema
 */
export function getWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    description: site.positioning,
    publisher: {
      "@type": "EmploymentAgency",
      name: site.name,
    },
  };
}

/**
 * BreadcrumbList schema for inner pages
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${siteUrl}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

/**
 * Article schema for Insight articles
 */
export function getArticleJsonLd(article: InsightItem) {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/insights/${article.meta.slug}`;
  const imageUrl = article.meta.image
    ? article.meta.image.startsWith("http")
      ? article.meta.image
      : `${siteUrl}${article.meta.image.startsWith("/") ? article.meta.image : `/${article.meta.image}`}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.meta.title,
    description: article.meta.excerpt,
    mainEntityOfPage: canonicalUrl,
    datePublished: article.meta.date,
    dateModified: article.meta.updated || article.meta.date,
    author: {
      "@type": "Organization",
      name: article.meta.author || site.name,
    },
    publisher: {
      "@type": "EmploymentAgency",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/logo.svg`,
      },
    },
    ...(imageUrl ? { image: imageUrl } : {}),
  };
}

/**
 * FAQPage schema for FAQs (e.g. Candidates FAQ section)
 */
export function getFaqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * JobPosting schema for real, open jobs only
 */
export function getJobPostingJsonLd(job: JobItem) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.meta.title,
    description: job.content || job.meta.requiredExperience,
    datePosted: job.meta.datePosted,
    ...(job.meta.validThrough ? { validThrough: job.meta.validThrough } : {}),
    employmentType: job.meta.employmentType.toUpperCase(),
    hiringOrganization: {
      "@type": "Organization",
      name:
        job.meta.employerDisclosed && job.meta.employerName
          ? job.meta.employerName
          : "Perseus Talent",
      sameAs: siteUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.meta.location,
        ...(job.meta.region ? { addressRegion: job.meta.region } : {}),
        addressCountry: "GB",
      },
    },
    ...(job.meta.salaryMin
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "GBP",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.meta.salaryMin,
              maxValue: job.meta.salaryMax || job.meta.salaryMin,
              unitText: "YEAR",
            },
          },
        }
      : {}),
  };
}
