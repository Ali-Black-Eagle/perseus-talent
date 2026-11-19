import type { Metadata } from "next";
import { site } from "@/config/site";
import type { InsightItem } from "@/lib/content";

export const TITLE_SUFFIX = " | Perseus Talent";
export const MAX_TITLE_LENGTH = 60;
export const MIN_DESCRIPTION_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 155;
/** The shared, branded social image (src/app/opengraph-image.tsx). */
export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";
export const OG_IMAGE_ALT = "Perseus Talent — UK Healthcare Recruitment Consultancy";

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

/** Search engines may index the site only when NEXT_PUBLIC_ALLOW_INDEXING is exactly "true". */
export function isIndexingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}

function absoluteUrl(urlOrPath: string): string {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  return `${getSiteUrl()}${urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`}`;
}

/**
 * Shortens a page title so that "<title> | Perseus Talent" is at most 60 characters
 * (Google truncates longer titles). Cuts at a word boundary and adds an ellipsis.
 */
export function fitTitle(title: string, suffix: string = TITLE_SUFFIX): string {
  const clean = title.replace(/\s+/g, " ").trim();
  const max = MAX_TITLE_LENGTH - suffix.length;
  if (clean.length <= max) return clean;
  // Prefer a clean break before a subtitle ("Main title: subtitle", "Main title - subtitle").
  const subtitleAt = clean.search(/\s*(?::\s|\s[—–-]\s)/);
  if (subtitleAt >= 12 && subtitleAt <= max) return clean.slice(0, subtitleAt).trim();
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > 12 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–—]+$/, "");
  return `${base}…`;
}

/**
 * Builds a meta description of 120 to 155 characters.
 * Longer text is cut at the last sentence end (or word) that fits; shorter text is extended
 * with the optional `padding` sentences, in order, until it is long enough.
 */
export function fitDescription(text: string, padding: string[] = []): string {
  let out = text.replace(/\s+/g, " ").trim();
  for (const extra of padding) {
    if (out.length >= MIN_DESCRIPTION_LENGTH) break;
    const next = `${out.replace(/\s*$/, "")} ${extra.trim()}`;
    if (next.length <= MAX_DESCRIPTION_LENGTH) out = next;
  }
  if (out.length <= MAX_DESCRIPTION_LENGTH) return out;

  const window = out.slice(0, MAX_DESCRIPTION_LENGTH);
  // Prefer ending on a full sentence.
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (sentenceEnd + 1 >= MIN_DESCRIPTION_LENGTH) return window.slice(0, sentenceEnd + 1);
  // Otherwise cut at a word and add an ellipsis (still within the limit).
  const cut = out.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > MIN_DESCRIPTION_LENGTH ? cut.slice(0, lastSpace) : cut).replace(
    /[\s,;:.\-–—]+$/,
    ""
  );
  return `${base}…`;
}

export interface PageMetadataOptions {
  /** Page title WITHOUT the "| Perseus Talent" suffix (it is added automatically). */
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  /** Use the title exactly as given (no suffix). Used by the home page. */
  absoluteTitle?: boolean;
  /** Social image: a path or full URL. Defaults to the branded /opengraph-image. */
  image?: string;
  imageAlt?: string;
  /** "article" for Insights articles; everything else is "website". */
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  absoluteTitle = false,
  image,
  imageAlt,
  ogType = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const canonical = getCanonicalUrl(path);
  const indexable = isIndexingAllowed() && !noIndex;
  const shortTitle = absoluteTitle ? title : fitTitle(title);
  const fullTitle = absoluteTitle ? title : `${shortTitle}${TITLE_SUFFIX}`;
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE_PATH);
  const alt = imageAlt || OG_IMAGE_ALT;
  const images = [{ url: imageUrl, width: 1200, height: 630, alt }];

  return {
    title: absoluteTitle ? { absolute: title } : shortTitle,
    description,
    alternates: {
      canonical,
      languages: { "en-GB": canonical },
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.name,
      locale: "en_GB",
      images,
      ...(ogType === "article"
        ? {
            type: "article" as const,
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: imageUrl, alt }],
    },
  };
}

// --- JSON-LD Schema Generators ---

/**
 * EmploymentAgency schema for Perseus Talent (rendered on every page).
 * No postal address and no social profiles: none have been supplied (no-fabrication rule).
 */
export function getOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-emblem-512.png`,
    email: site.email,
    telephone: site.phoneHref.replace("tel:", ""),
    description: site.positioning,
    slogan: site.statement,
    areaServed: "GB",
    knowsAbout: ["Healthcare recruitment"],
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
    inLanguage: "en-GB",
    description: site.positioning,
    publisher: {
      "@type": "EmploymentAgency",
      name: site.name,
      url: siteUrl,
    },
  };
}

/**
 * BreadcrumbList schema for inner pages
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/**
 * Article schema for Insight articles (Google's Article structured data).
 */
export function getArticleJsonLd(article: InsightItem) {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/insights/${article.meta.slug}`;
  const imageUrl = absoluteUrl(article.meta.image || DEFAULT_OG_IMAGE_PATH);
  const published = String(article.meta.date);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    // Google recommends headlines of 110 characters or fewer.
    headline: article.meta.title.slice(0, 110),
    description: article.meta.excerpt,
    image: [imageUrl],
    datePublished: published,
    dateModified: String(article.meta.updated || published),
    author: {
      "@type": "Organization",
      name: article.meta.author || site.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/logo-emblem-512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    inLanguage: "en-GB",
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

// --- Generated titles and descriptions for content pages ---

/** Meta description for an article: its excerpt, trimmed to 155 characters (padded if too short). */
export function buildArticleDescription(article: InsightItem): string {
  return fitDescription(article.meta.excerpt, [
    "Insights from Perseus Talent, a UK healthcare recruitment consultancy.",
    "Read more from Perseus Talent.",
    "Advice for UK healthcare teams.",
  ]);
}

/** Meta description for a specialism page, from its summary. */
export function buildSpecialismDescription(title: string, summary: string): string {
  return fitDescription(summary, [
    `${title} recruitment from Perseus Talent, a UK healthcare recruitment consultancy.`,
    "Recruitment from Perseus Talent.",
    "Advice for UK healthcare teams.",
  ]);
}

/** Title and description for an Insights category page. */
export function buildCategoryMetadata(categoryName: string) {
  return {
    title: `${categoryName} — Insights`,
    description: fitDescription(
      `Read practical guidance, industry analysis and career advice in ${categoryName} from Perseus Talent.`,
      ["Insights from a UK healthcare recruitment consultancy.", "UK healthcare recruitment insights."]
    ),
  };
}
