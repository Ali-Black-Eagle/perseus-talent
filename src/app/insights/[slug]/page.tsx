import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Ornament } from "@/components/ui/Ornament";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { Calendar, User, Clock } from "lucide-react";
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
  return {
    title: article.meta.title,
    description: article.meta.excerpt,
  };
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
              <li className="text-white font-medium truncate max-w-[240px] sm:max-w-none" aria-current="page">
                {meta.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-[820px]">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="gold">{meta.category}</Badge>
              {meta.status === "draft" && (
                <Badge variant="draft">Draft — Not Published</Badge>
              )}
            </div>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[24ch]"
            >
              {meta.title}
            </Heading>

            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A15B]" />
                {meta.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C5A15B]" />
                {meta.author}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. ARTICLE PROSE */}
      <Section bg="white">
        <Container narrow={true}>
          {meta.status === "draft" && (
            <div className="mb-10 p-4 bg-[#FEF3F2] border border-[#B42318] rounded-[2px] text-xs text-[#B42318]">
              <strong>DRAFT PREVIEW:</strong> This article is currently in draft
              status for development inspection and has not been publicly
              published.
            </div>
          )}

          <div className="font-serif italic text-xl md:text-2xl text-[#1C052E] leading-relaxed mb-10 pb-8 border-b border-[#E6E0EB]">
            {meta.excerpt}
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-[#3A3242] leading-relaxed whitespace-pre-line">
            {content}
          </div>

          <Ornament color="gold" className="my-12" />

          {/* Share row */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E6E0EB] text-sm">
            <span className="text-[#625A6B]">
              Published by Perseus Talent Consultancy
            </span>
            <Link
              href="/insights"
              className="font-sans font-semibold text-[#1C052E] hover:text-[#7A5A20]"
            >
              ← Back to all insights
            </Link>
          </div>
        </Container>
      </Section>

      {/* 3. CTA */}
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
