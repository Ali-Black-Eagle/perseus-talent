import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { EightPointStar } from "@/components/brand/EightPointStar";
import { PageHero } from "@/components/layout/PageHero";
import { CategoryChips } from "@/components/insights/CategoryChips";
import { InsightCard } from "@/components/insights/InsightCard";
import { Pagination } from "@/components/ui/Pagination";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCategoryMetadata, createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import {
  INSIGHT_CATEGORIES,
  slugifyCategory,
  getInsightsByCategory,
  getCategoryFromSlug,
} from "@/lib/insights";

const ARTICLES_PER_PAGE = 9;

export async function generateStaticParams() {
  return INSIGHT_CATEGORIES.map((category) => ({
    category: slugifyCategory(category),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = getCategoryFromSlug(category) || category;

  return createPageMetadata({
    ...buildCategoryMetadata(categoryName),
    path: `/insights/category/${category}`,
  });
}

export default async function InsightCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page } = await searchParams;

  const categoryName = getCategoryFromSlug(category);
  if (!categoryName) {
    notFound();
  }

  const { articles } = await getInsightsByCategory(category);

  // Pagination calculation
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE
  );

  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Insights", url: "/insights" },
    { name: categoryName, url: `/insights/category/${category}` },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: categoryName },
        ]}
        eyebrow="Category"
        title={categoryName}
        lead={`Articles, market perspectives and practical guidance categorised under ${categoryName}.`}
      />

      {/* 2. CATEGORY ARTICLES */}
      <Section bg="white">
        <Container>
          {/* Category Chips Bar */}
          <CategoryChips activeCategory={category} />

          {articles.length === 0 ? (
            /* Empty State for category with no articles */
            <div className="p-12 md:p-16 text-center border border-line rounded-[4px] bg-ivory max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-gold-text flex items-center justify-center mx-auto mb-4">
                <EightPointStar size={20} className="text-gold-text" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-2">
                No articles published in this category yet.
              </h2>
              <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
                Our editorial team regularly produces guidance for healthcare
                employers and clinical professionals. Explore other categories or
                browse all published insights.
              </p>
              <Button variant="purple" size="md" href="/insights">
                Browse All Insights
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              <p
                aria-live="polite"
                className="text-xs uppercase tracking-wider text-gold-text font-semibold"
              >
                Showing {articles.length} article{articles.length === 1 ? "" : "s"} in {categoryName}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((art) => (
                  <InsightCard key={art.meta.slug} article={art} headingLevel="h2" />
                ))}
              </div>

              {/* Pagination controls when > 9 articles */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={`/insights/category/${category}`}
                />
              )}
            </div>
          )}
        </Container>
      </Section>

      {/* 3. CTA BAND */}
      <CtaBand
        bg="purple-50"
        heading="Looking for specialised healthcare recruitment?"
        copy="Whether you represent a healthcare organisation or are seeking your next career milestone, our team is here to support you."
        primaryButton={{
          label: "Discuss Your Recruitment Needs",
          href: "/employers#enquiry",
        }}
        secondaryButton={{
          label: "Contact Our Team",
          href: "/contact",
        }}
      />
    </div>
  );
}
