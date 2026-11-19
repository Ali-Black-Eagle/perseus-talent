import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock } from "lucide-react";
import { CategoryChips } from "@/components/insights/CategoryChips";
import { InsightCard, getInsightImage } from "@/components/insights/InsightCard";
import { formatDate } from "@/lib/format";
import { Pagination } from "@/components/ui/Pagination";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";
import { getInsights } from "@/lib/content";

export const metadata = createPageMetadata(pageSeo.insights);

const ARTICLES_PER_PAGE = 9;

export default async function InsightsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const articles = await getInsights();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const pageParam = resolvedSearchParams.page;
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Insights", url: "/insights" },
  ]);

  const featured = articles.find((a) => a.meta.featured) || articles[0];
  const regularArticles = articles.filter(
    (a) => a.meta.slug !== featured?.meta.slug
  );

  // Pagination for regular articles
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const totalPages = Math.ceil(regularArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedRegularArticles = regularArticles.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE
  );

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Insights" },
        ]}
        eyebrow="Industry Knowledge"
        title="Perspectives on people, careers and recruitment."
        lead="Practical advice, market guidance, and strategic commentary for healthcare leaders and ambitious professionals."
      />

      {/* 2. MAIN ARTICLES FEED */}
      <Section bg="white">
        <Container>
          {/* Category Chips Bar (§G6 and §FE13) */}
          <CategoryChips activeCategory="all" />

          {articles.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-line rounded-[4px] bg-ivory max-w-xl mx-auto">
              <p className="font-serif text-2xl text-purple-900 mb-2">
                Insights are coming soon.
              </p>
              <p className="text-sm text-muted mb-6">
                In the meantime, get in touch with our team to start a
                conversation about your recruitment requirements.
              </p>
              <Button variant="purple" size="md" href="/contact">
                Contact Our Team
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Article Card (7/5 split with 16:10 image per Item 17) */}
              {featured && currentPage === 1 && (
                <article
                  data-reveal
                  className="group relative border border-line rounded-[4px] bg-ivory overflow-hidden shadow-sm transition-[transform,box-shadow,border-color] duration-250 ease-out hover:border-gold-500 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.18)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                    {/* Columns 1–7: Content */}
                    <div className="lg:col-span-7 p-8 md:p-12 xl:p-14 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-xs uppercase tracking-[0.16em] font-semibold text-gold-text">
                            {featured.meta.category}
                          </span>
                          {featured.meta.status === "draft" && (
                            <Badge variant="draft">Draft — Not Published</Badge>
                          )}
                        </div>

                        <h2 className="font-serif text-3xl md:text-4xl font-medium text-purple-900 mb-4 leading-tight">
                          <Link
                            href={`/insights/${featured.meta.slug}`}
                            className="hover:text-gold-text transition-colors after:absolute after:inset-0"
                          >
                            {featured.meta.title}
                          </Link>
                        </h2>

                        <p className="font-sans text-base md:text-lg text-muted leading-relaxed mb-6 max-w-2xl">
                          {featured.meta.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-line/60 flex items-center gap-6 text-xs text-muted">
                        <time dateTime={featured.meta.date}>{formatDate(featured.meta.date)}</time>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold-600" aria-hidden="true" />
                          <span>
                            {Math.max(
                              1,
                              Math.ceil(
                                (featured.content?.trim().split(/\s+/).length || 500) / 200
                              )
                            )}{" "}
                            min read
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Columns 8–12: 16:10 Image with 1.03 hover zoom */}
                    <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full aspect-[16/10] lg:aspect-auto overflow-hidden bg-purple-900">
                      <Image
                        src={getInsightImage(featured.meta).src}
                        alt={getInsightImage(featured.meta).alt}
                        fill
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 500px, 100vw"
                      />
                    </div>
                  </div>
                </article>
              )}

              {/* Grid of Other Articles using InsightCard (3:2 image, 2-line title, 3-line excerpt, stretched link) */}
              {paginatedRegularArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                  {paginatedRegularArticles.map((art) => (
                    <InsightCard key={art.meta.slug} article={art} />
                  ))}
                </div>
              )}

              {/* Pagination when > 9 regular articles */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/insights"
                />
              )}
            </div>
          )}
        </Container>
      </Section>

      {/* 3. CTA BAND (Item 17) */}
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
