import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { Placeholder } from "@/components/ui/Placeholder";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { getSpecialismBySlug, getSpecialisms } from "@/lib/content";

export async function generateStaticParams() {
  const specialisms = await getSpecialisms();
  return specialisms.map((s) => ({ slug: s.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getSpecialismBySlug(slug);
  if (!item) return { title: "Specialism Not Found" };
  return createPageMetadata({
    title: `${item.meta.title} Recruitment`,
    description: item.meta.summary,
    path: `/specialisms/${slug}`,
  });
}

export default async function SpecialismDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const specialism = await getSpecialismBySlug(slug);

  if (!specialism) {
    notFound();
  }

  const { meta } = specialism;
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Our Specialisms", url: "/specialisms" },
    { name: meta.title, url: `/specialisms/${slug}` },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
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
                  href="/specialisms"
                  className="hover:text-white transition-colors"
                >
                  Our Specialisms
                </Link>
              </li>
              <li className="text-[#C5A15B]" aria-hidden="true">
                /
              </li>
              <li className="text-white font-medium" aria-current="page">
                {meta.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-[780px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Sector Specialism
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              {meta.title} Recruitment Services
            </Heading>

            <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed mb-8 max-w-[52ch]">
              {meta.summary}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="gold"
                size="lg"
                arrow={true}
                href="/employers#enquiry"
                className="w-full sm:w-auto text-center"
              >
                Discuss Recruitment Requirements
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                href="/candidates#register"
                className="w-full sm:w-auto text-center"
              >
                Register as a Professional
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SECTOR APPROACH & DETAILS */}
      <Section bg="white">
        <Container narrow={true}>
          <div className="prose prose-lg max-w-none space-y-6 text-[#3A3242]">
            <Heading level="h2" color="ink" className="mb-6">
              A Relationship-Led Approach to Healthcare
            </Heading>

            <p className="text-base md:text-lg leading-relaxed">
              Healthcare organisations operate in high-consequence environments
              where clinical capability, leadership, and compassionate
              communication are equally essential. At Perseus Talent, healthcare
              is our primary recruitment specialism.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              We work closely with healthcare providers, clinical leaders, and
              healthcare organisations to understand their specific
              requirements, company culture, and the qualities needed to succeed
              in each role.
            </p>

            <Ornament color="gold" className="justify-start my-8" />

            <Heading level="h3" color="ink" className="mb-4">
              Clinical and Operational Disciplines
            </Heading>

            <p className="text-sm md:text-base text-[#625A6B] leading-relaxed mb-6">
              Our relationship-led model focuses on key professional positions
              where candidate alignment and long-term retention are vital.
            </p>

            {/* Placeholder for specific disciplines to be confirmed */}
            <Placeholder
              label="Specific healthcare disciplines & roles to be confirmed"
              description="Specific healthcare disciplines, clinical specialties, and medical bands recruited for are to be confirmed by Perseus Talent. No invented clinical lists or unverified sector claims are published."
            />
          </div>
        </Container>
      </Section>

      {/* 3. CTA */}
      <CtaBand
        bg="purple-50"
        heading="Discuss your healthcare hiring requirements."
        copy="Contact our healthcare recruitment consultants to discuss your staffing needs or upcoming clinical appointments."
        primaryButton={{
          label: "Discuss Your Recruitment Requirements",
          href: "/employers#enquiry",
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
