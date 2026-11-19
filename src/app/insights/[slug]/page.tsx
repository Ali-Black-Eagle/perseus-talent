import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Ornament } from "@/components/ui/Ornament";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { formatDate } from "@/lib/format";
import { Calendar, User, Clock } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import Image from "next/image";
import {
  buildArticleDescription,
  createPageMetadata,
  getBreadcrumbJsonLd,
  getArticleJsonLd,
} from "@/lib/seo";
import { getInsightImage, InsightCard } from "@/components/insights/InsightCard";
import { getInsightBySlug, getInsights } from "@/lib/content";

export async function generateStaticParams() {
  const articles = await getInsights();
  return articles.map((a) => ({ slug: a.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return createPageMetadata({
    title: article.meta.title,
    description: buildArticleDescription(article),
    path: `/insights/${slug}`,
    ogType: "article",
    // Articles use their own image when they have one; otherwise the branded default is used.
    image: article.meta.image,
    imageAlt: article.meta.image ? article.meta.imageAlt || article.meta.title : undefined,
    publishedTime: String(article.meta.date),
    modifiedTime: String(article.meta.updated || article.meta.date),
    noIndex: article.meta.status !== "published",
  });
}

function getNextStep(category: string): { lead: string; label: string; href: string } {
  switch (category) {
    case "Candidate Advice":
    case "Career Development":
    case "Interview Preparation":
      return {
        lead: "Looking for your next healthcare role? Visit our",
        label: "Candidates page",
        href: "/candidates",
      };
    case "Recruitment Industry":
      return {
        lead: "Want to see how a flat-rate model works for your organisation? Try the",
        label: "Fee Calculator",
        href: "/fee-calculator",
      };
    default:
      return {
        lead: "Hiring in healthcare? See how we work with",
        label: "Employers",
        href: "/employers",
      };
  }
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  const { meta, content } = article;
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Insights", url: "/insights" },
    { name: meta.title, url: `/insights/${slug}` },
  ]);
  const articleJsonLd = getArticleJsonLd(article);
  const heroImage = meta.image ? getInsightImage(meta) : null;

  // Related articles: same category first, then the most recent others.
  const allArticles = (await getInsights()).filter((a) => a.meta.slug !== slug);
  const related = [
    ...allArticles.filter((a) => a.meta.category === meta.category),
    ...allArticles.filter((a) => a.meta.category !== meta.category),
  ].slice(0, 3);
  const nextStep = getNextStep(meta.category);

  return (
    <div className="flex flex-col">
      <JsonLd data={[breadcrumbs, articleJsonLd]} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: meta.title },
        ]}
        eyebrow={meta.category}
        title={meta.title}
      >
        {meta.status === "draft" && (
          <div className="mb-4">
            <Badge variant="draft">Draft — Not Published</Badge>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-white/70">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold-500" />
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gold-500" />
            {meta.author}
          </span>
        </div>
      </PageHero>

      {/* 2. ARTICLE PROSE */}
      <Section bg="white">
        <Container narrow={true}>
          {meta.status === "draft" && (
            <div className="mb-10 p-4 bg-error-bg border border-error rounded-[2px] text-xs text-error">
              <strong>DRAFT PREVIEW:</strong> This article is currently in draft
              status for development inspection and has not been publicly
              published.
            </div>
          )}

          <div className="font-serif italic text-xl md:text-2xl text-purple-900 leading-relaxed mb-10 pb-8 border-b border-line">
            {meta.excerpt}
          </div>

          {heroImage && (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[2px] bg-purple-900 mb-10">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 760px, 100vw"
              />
            </div>
          )}

          <ArticleBody content={content} />

          <Ornament color="gold" className="my-12" />

          {/* Share row */}
          <div className="flex items-center justify-between pt-6 border-t border-line text-sm">
            <span className="text-muted">
              Published by Perseus Talent Consultancy
            </span>
            <Link
              href="/insights"
              className="font-sans font-semibold text-purple-900 hover:text-gold-text"
            >
              ← Back to all insights
            </Link>
          </div>
        </Container>
      </Section>

      {/* 3. RELATED ARTICLES AND NEXT STEP */}
      <Section bg="ivory" className="border-t border-line">
        <Container>
          <Heading level="h2" color="ink" className="mb-8">
            Keep reading
          </Heading>
          {related.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {related.map((a) => (
                <InsightCard key={a.meta.slug} article={a} />
              ))}
            </div>
          )}
          <p className="text-base text-body leading-relaxed">
            {nextStep.lead}{" "}
            <Link
              href={nextStep.href}
              className="font-semibold text-purple-900 underline decoration-gold-500 underline-offset-4 hover:decoration-2"
            >
              {nextStep.label}
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* 4. CTA */}
      <CtaBand
        bg="purple-50"
        heading="Discuss your organisation's talent requirements."
        copy="Contact our healthcare recruitment consultants to start a conversation about your hiring objectives."
        primaryButton={{
          label: "Contact Our Team",
          href: "/contact",
          variant: "purple",
        }}
        secondaryButton={{
          label: "Calculate Your Fee",
          href: "/fee-calculator",
          variant: "outline-dark",
        }}
      />
    </div>
  );
}
