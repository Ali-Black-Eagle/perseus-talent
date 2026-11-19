import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { buildSpecialismDescription, createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
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
    description: buildSpecialismDescription(item.meta.title, item.meta.summary),
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

  const { meta, content } = specialism;
  const isHealthcare = slug === "healthcare";
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Our Specialisms", url: "/specialisms" },
    { name: meta.title, url: `/specialisms/${slug}` },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Specialisms", href: "/specialisms" },
          { label: meta.title },
        ]}
        eyebrow="Sector Specialism"
        title={`${meta.title} Recruitment Services`}
        lead={meta.summary}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="gold"
            size="lg"
            arrow={true}
            href="/employers#enquiry"
            className="w-full sm:w-auto text-center"
          >
            Discuss Your Recruitment Needs
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
      </PageHero>

      {/* 2. SECTOR APPROACH & DETAILS */}
      <Section bg="white">
        <Container narrow={true}>
          {!isHealthcare && <ArticleBody content={content} />}
          {isHealthcare && (
          <div className="space-y-6 text-body">
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

            <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
              Our relationship-led model focuses on key professional positions
              where candidate alignment and long-term retention are vital.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-[2px] bg-purple-50/60 border border-line">
                <h4 className="font-serif font-semibold text-lg text-purple-900 mb-1.5">
                  Clinical Nursing & Care Delivery
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  Qualified registered nurses, clinical nurse specialists, ward sisters, charge nurses, and senior care practitioners across general, acute, and community healthcare environments.
                </p>
              </div>
              <div className="p-5 rounded-[2px] bg-purple-50/60 border border-line">
                <h4 className="font-serif font-semibold text-lg text-purple-900 mb-1.5">
                  Clinical Leadership & Management
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  Head of clinical services, matrons, registered managers, clinical directors, and operations managers leading patient care pathways and multidisciplinary healthcare teams.
                </p>
              </div>
              <div className="p-5 rounded-[2px] bg-purple-50/60 border border-line">
                <h4 className="font-serif font-semibold text-lg text-purple-900 mb-1.5">
                  Allied Health Professionals
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  Specialist therapists, radiographers, occupational health advisors, and healthcare practitioners registered with relevant UK regulatory bodies.
                </p>
              </div>
              <div className="p-5 rounded-[2px] bg-purple-50/60 border border-line">
                <h4 className="font-serif font-semibold text-lg text-purple-900 mb-1.5">
                  Governance & Compliance
                </h4>
                <p className="text-sm text-muted leading-relaxed">
                  Quality assurance leads, clinical governance managers, and audit specialists ensuring stringent adherence to UK healthcare standards and regulatory frameworks.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed italic">
              Note: Perseus Talent works on bespoke permanent and fixed-term appointments across independent healthcare providers throughout the United Kingdom.
            </p>

            <p className="text-base text-body leading-relaxed">
              Looking for your next role?{" "}
              <Link
                href="/candidates#register"
                className="font-semibold text-purple-900 underline decoration-gold-500 underline-offset-4 hover:decoration-2"
              >
                Register your CV
              </Link>
              . Hiring? Work out your cost with the{" "}
              <Link
                href="/fee-calculator"
                className="font-semibold text-purple-900 underline decoration-gold-500 underline-offset-4 hover:decoration-2"
              >
                fee calculator
              </Link>
              .
            </p>
          </div>
          )}
        </Container>
      </Section>

      {/* 3. CTA */}
      <CtaBand
        bg="purple-50"
        heading="Discuss your healthcare hiring requirements."
        copy="Contact our healthcare recruitment consultants to discuss your staffing needs or upcoming clinical appointments."
        primaryButton={{
          label: "Discuss Your Recruitment Needs",
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
