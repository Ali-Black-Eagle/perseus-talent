import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock } from "lucide-react";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { getInsights } from "@/lib/content";

export const metadata = {
  title: "Insights — Perspectives on Healthcare Recruitment & Careers",
  description:
    "Read articles and perspectives from Perseus Talent on healthcare recruitment, employer guidance, interview preparation, and talent acquisition.",
};

const categories = [
  "All",
  "Healthcare Recruitment",
  "Interview Preparation",
  "Employer Guidance",
  "Recruitment Industry",
  "Candidate Advice",
];

export default async function InsightsPage() {
  const articles = await getInsights();
  const featured = articles.find((a) => a.meta.featured) || articles[0];
  const regularArticles = articles.filter(
    (a) => a.meta.slug !== featured?.meta.slug
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
              <li className="text-white font-medium" aria-current="page">
                Insights
              </li>
            </ol>
          </nav>

          <div className="max-w-[760px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Industry Knowledge
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Perspectives on people, careers and recruitment.
            </Heading>

            <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[50ch]">
              Practical advice, market guidance, and strategic commentary for
              healthcare leaders and ambitious professionals.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. MAIN ARTICLES FEED */}
      <Section bg="white">
        <Container>
          {articles.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#E6E0EB] rounded-[4px] bg-[#FBF9F6] max-w-xl mx-auto">
              <p className="font-serif text-2xl text-[#1C052E] mb-2">
                Insights are coming soon.
              </p>
              <p className="text-sm text-[#625A6B] mb-6">
                In the meantime, get in touch with our team to start a
                conversation about your recruitment requirements.
              </p>
              <Button variant="purple" size="md" href="/contact">
                Contact Team
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Article Card */}
              {featured && (
                <div className="border border-[#E6E0EB] rounded-[4px] bg-[#FBF9F6] p-8 md:p-12 shadow-sm transition-all hover:border-[#C5A15B]">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="gold">{featured.meta.category}</Badge>
                    {featured.meta.status === "draft" && (
                      <Badge variant="draft">Draft — Not Published</Badge>
                    )}
                    <span className="text-xs text-[#625A6B] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A15B]" />
                      {featured.meta.date}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1C052E] mb-4">
                    <Link
                      href={`/insights/${featured.meta.slug}`}
                      className="hover:text-[#7A5A20] transition-colors"
                    >
                      {featured.meta.title}
                    </Link>
                  </h2>

                  <p className="font-sans text-base md:text-lg text-[#625A6B] leading-relaxed mb-6 max-w-3xl">
                    {featured.meta.excerpt}
                  </p>

                  <Link
                    href={`/insights/${featured.meta.slug}`}
                    className="font-sans text-sm font-semibold text-[#1C052E] hover:text-[#7A5A20] inline-flex items-center gap-1.5"
                  >
                    Read article →
                  </Link>
                </div>
              )}

              {/* Grid of Other Articles */}
              {regularArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  {regularArticles.map((art) => (
                    <Card
                      key={art.meta.slug}
                      hoverable={true}
                      className="p-8 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="purple">{art.meta.category}</Badge>
                          {art.meta.status === "draft" && (
                            <Badge variant="draft">Draft</Badge>
                          )}
                        </div>

                        <h3 className="font-serif text-2xl font-medium text-[#1C052E] mb-3">
                          <Link
                            href={`/insights/${art.meta.slug}`}
                            className="hover:text-[#7A5A20] transition-colors"
                          >
                            {art.meta.title}
                          </Link>
                        </h3>

                        <p className="font-sans text-sm text-[#625A6B] leading-relaxed mb-6 line-clamp-3">
                          {art.meta.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E6E0EB] flex items-center justify-between text-xs text-[#625A6B]">
                        <span>{art.meta.date}</span>
                        <Link
                          href={`/insights/${art.meta.slug}`}
                          className="font-semibold text-[#1C052E] hover:text-[#7A5A20]"
                        >
                          Read full article →
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
