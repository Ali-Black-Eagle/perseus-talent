import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { InsightItem } from "@/lib/content";
import { formatDate } from "@/lib/format";

const DEFAULT_ARTICLE_IMAGES: Record<string, { src: string; alt: string }> = {
  "understanding-recruitment-fees": {
    src: "/images/about/team-partnership.webp",
    alt: "An empty, modern meeting room with a table and chairs",
  },
  "writing-a-clear-job-brief": {
    src: "/images/insights/job-brief.webp",
    alt: "A person writing in a notebook at a desk with a laptop",
  },
  "preparing-for-a-healthcare-interview": {
    src: "/images/insights/interview-preparation.webp",
    alt: "A desk with notes, a notebook and a coffee, set up for preparation",
  },
};

const FALLBACK_IMAGE = {
  src: "/images/about/team-partnership.webp",
  alt: "An empty, modern meeting room with a table and chairs",
};

export function getInsightImage(meta: InsightItem["meta"]): { src: string; alt: string } {
  if (meta.image) return { src: meta.image, alt: meta.imageAlt || meta.title };
  return DEFAULT_ARTICLE_IMAGES[meta.slug] || FALLBACK_IMAGE;
}

interface InsightCardProps {
  article: InsightItem;
  className?: string;
  /** Heading level of the card title. Use "h2" when the card is directly under the page's h1. */
  headingLevel?: "h2" | "h3";
}

export function InsightCard({ article, className = "", headingLevel = "h3" }: InsightCardProps) {
  const TitleTag = headingLevel;
  const { meta, content } = article;
  const imageInfo = getInsightImage(meta);

  // Calculate reading time (approx 200 words per minute)
  const wordCount = content ? content.trim().split(/\s+/).length : 500;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return (
    <article
      data-reveal
      className={`group relative bg-white border border-line rounded-[4px] overflow-hidden flex flex-col justify-between transition-[transform,box-shadow,border-color] duration-250 ease-out hover:border-gold-500 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.18)] ${className}`}
    >
      <div>
        {/* 3:2 Aspect ratio image with 1.03 hover zoom */}
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-purple-900">
          <Image
            src={imageInfo.src}
            alt={imageInfo.alt}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 400px, 100vw"
          />
        </div>

        <div className="p-6 md:p-8">
          {/* Gold-text category eyebrow */}
          <span className="text-xs uppercase tracking-[0.16em] font-semibold text-gold-text mb-2.5 block">
            {meta.category}
          </span>

          {/* 2-line title clamp with stretched link */}
          <TitleTag className="font-serif text-2xl font-semibold text-purple-900 mb-3 leading-snug line-clamp-2">
            <Link
              href={`/insights/${meta.slug}`}
              className="hover:text-gold-text transition-colors after:absolute after:inset-0"
            >
              {meta.title}
            </Link>
          </TitleTag>

          {/* 3-line excerpt clamp */}
          <p className="font-sans text-sm text-muted leading-relaxed line-clamp-3">
            {meta.excerpt}
          </p>
        </div>
      </div>

      {/* Meta footer with <time datetime> and reading time */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-muted">
        <time dateTime={meta.date}>{formatDate(meta.date)}</time>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gold-600" aria-hidden="true" />
          <span>{readingTime}</span>
        </span>
      </div>
    </article>
  );
}
