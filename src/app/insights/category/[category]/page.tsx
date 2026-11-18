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
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { CategoryChips } from "@/components/insights/CategoryChips";
import { Pagination } from "@/components/ui/Pagination";
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

  return {
    title: `${categoryName} — Insights & Perspectives`,
    description: `Read practical guidance, industry analysis and career advice in ${categoryName} from Perseus Talent.`,
  };
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

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-[#1C052E] text-white pt-16 pb-16 md:pt-24 md:pb-20 border-b border-[#C5A15B]/30">
        <GeometricPattern opacity={0.04} />

        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[380px] h-[380px] pointer-events-none opacity-25">
          <ConstellationGraphic opacity={0.6} />
        </div>

        <Container className="relative z-10">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs font-sans text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-[#C5A15B]" aria-hidden="true">
                /
              </li>
              <li>
                <Link
                  href="/insights"
                  className="hover:text-white transition-colors"
                >
                  Insights
                </Link>
              </li>
              <li className="text-[#C5A15B]" aria-hidden="true">
                /
              </li>
              <li className="text-white font-medium" aria-current="page">
                {categoryName}
              </li>
            </ol>
          </nav>

          <div className="max-w-[760px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Category
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              {categoryName}
            </Heading>

            <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[50ch]">
              Articles, market perspectives and practical guidance categorised
              under {categoryName}.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. CATEGORY ARTICLES */}
      <Section bg="white">
        <Container>
          {/* Category Chips Bar */}
          <CategoryChips activeCategory={category} />

          {articles.length === 0 ? (
            /* Empty State for category with no articles */
            <div className="p-12 md:p-16 text-center border border-[#E6E0EB] rounded-[4px] bg-[#FBF9F6] max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#F4F0F7] text-[#7A5A20] flex items-center justify-center text-xl font-bold mx-auto mb-4">
                ✦
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-2">
                No articles published in this category yet.
              </h2>
              <p className="text-sm md:text-base text-[#625A6B] leading-relaxed mb-6">
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
                className="text-xs uppercase tracking-wider text-[#7A5A20] font-semibold"
              >
                Showing {articles.length} article{articles.length === 1 ? "" : "s"} in {categoryName}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((art) => (
                  <Card
                    key={art.meta.slug}
                    hoverable={true}
                    className="p-6 md:p-8 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="purple">{art.meta.category}</Badge>
                        {art.meta.status === "draft" && (
                          <Badge variant="draft">Draft</Badge>
                        )}
                      </div>

                      <h2 className="font-serif text-xl md:text-2xl font-medium text-[#1C052E] mb-3">
                        <Link
                          href={`/insights/${art.meta.slug}`}
                          className="hover:text-[#7A5A20] transition-colors"
                        >
                          {art.meta.title}
                        </Link>
                      </h2>

                      <p className="font-sans text-sm text-[#625A6B] leading-relaxed mb-6 line-clamp-3">
                        {art.meta.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E6E0EB] flex items-center justify-between text-xs text-[#625A6B]">
                      <span>{art.meta.date}</span>
                      <Link
                        href={`/insights/${art.meta.slug}`}
                        className="font-semibold text-[#1C052E] hover:text-[#7A5A20] inline-flex items-center gap-1"
                      >
                        Read article →
                      </Link>
                    </div>
                  </Card>
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
    </div>
  );
}
