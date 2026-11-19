import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Ornament } from "@/components/ui/Ornament";
import { Card } from "@/components/ui/Card";
import { FeeCalculator } from "@/components/calculator/FeeCalculator";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.feeCalculator);

export default function FeeCalculatorPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Fee Calculator", url: "/fee-calculator" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbJsonLd} />

      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Fee Calculator" },
        ]}
        eyebrow="Transparent Pricing"
        title="Transparent recruitment pricing. No guesswork."
        lead="Calculate your recruitment fee in seconds. Enter the annual salary of your intended hire and discover your estimated recruitment fee using our straightforward 15% flat-rate pricing model."
      />

      {/* 2. INTERACTIVE FEE CALCULATOR COMPONENT (Starts empty per Item 7) */}
      <Section bg="white">
        <Container>
          <FeeCalculator variant="standalone" />
        </Container>
      </Section>

      {/* 3. HOW OUR FEE WORKS EXPLAINER (Asymmetric Split per Item 12) */}
      <Section bg="ivory" className="border-t border-b border-line">
        <Container>
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
            <div className="lg:col-span-6">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Clear & Simple
              </Eyebrow>
              <Heading level="h2" color="ink">
                How our fee model works
              </Heading>
            </div>
            <div className="lg:col-span-6">
              <p className="font-sans text-base md:text-lg text-muted leading-relaxed">
                Straightforward recruitment pricing based entirely on candidate base salary,
                with zero hidden fees or tiered complications.
              </p>
            </div>
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable={true} className="p-8">
              <span className="font-serif text-3xl font-semibold text-gold-text mb-4 block">
                15%
              </span>
              <h3 className="font-serif text-xl font-semibold text-purple-900 mb-2">
                Flat percentage rate
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Calculated as a flat 15% of the successful candidate&apos;s
                first-year gross base salary. No tiered complexity, sliding
                scales, or hidden surcharges.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <span className="font-serif text-3xl font-semibold text-gold-text mb-4 block">
                Base
              </span>
              <h3 className="font-serif text-xl font-semibold text-purple-900 mb-2">
                Gross base salary only
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Our calculation applies strictly to the agreed gross base
                salary. Overtime, bonuses, commissions, allowances, and
                pension contributions are excluded.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <span className="font-serif text-3xl font-semibold text-gold-text mb-4 block">
                Terms
              </span>
              <h3 className="font-serif text-xl font-semibold text-purple-900 mb-2">
                Written agreement
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                All assignments proceed under clear written terms confirmed
                prior to introduction. VAT applies at standard UK rates where
                applicable.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 4. CTA */}
      <CtaBand
        heading="Let's find the exceptional talent your organisation needs."
        primaryButton={{
          label: "Discuss Your Recruitment Needs",
          href: "/employers#enquiry",
        }}
        secondaryButton={{
          label: "Contact Our Team",
          href: "/contact",
        }}
        bg="purple-50"
      />
    </div>
  );
}
