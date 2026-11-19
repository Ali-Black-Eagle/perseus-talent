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
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "The Perseus Fee Calculator — Transparent 15% Recruitment Pricing",
  description:
    "Calculate your healthcare recruitment fee instantly. Straightforward flat 15% rate applied to annual gross base salary with zero hidden fees.",
  path: "/fee-calculator",
});

export default function FeeCalculatorPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Fee Calculator", url: "/fee-calculator" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbJsonLd} />

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
                Fee Calculator
              </li>
            </ol>
          </nav>

          <div className="max-w-[760px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Transparent Pricing
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Transparent recruitment pricing. No guesswork.
            </Heading>

            <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[50ch]">
              We believe great partnerships start with clarity. Use our
              straightforward calculator to estimate your recruitment investment
              based on our flat 15% fee structure.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. INTERACTIVE FEE CALCULATOR COMPONENT (Starts empty per Item 7) */}
      <Section bg="white">
        <Container>
          <FeeCalculator variant="standalone" />
        </Container>
      </Section>

      {/* 3. HOW OUR FEE WORKS EXPLAINER */}
      <Section bg="ivory" className="border-t border-b border-[#E6E0EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Clear & Simple
            </Eyebrow>
            <Heading level="h2" color="ink">
              How our fee model works
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable={true} className="p-8">
              <span className="font-serif text-3xl font-bold text-[#C5A15B] mb-4 block">
                15%
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#1C052E] mb-2">
                Flat percentage rate
              </h3>
              <p className="text-sm text-[#625A6B] leading-relaxed">
                Applied strictly to the successful candidate&apos;s annual gross
                base salary. No tiered complexity, sliding scales or hidden
                surcharges.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <span className="font-serif text-3xl font-bold text-[#C5A15B] mb-4 block">
                0%
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#1C052E] mb-2">
                Excludes variable pay
              </h3>
              <p className="text-sm text-[#625A6B] leading-relaxed">
                Our fee calculation excludes overtime, bonuses, commissions, car
                allowances, pension contributions and other employee benefits.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <span className="font-serif text-3xl font-bold text-[#C5A15B] mb-4 block">
                Success
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#1C052E] mb-2">
                Pay only on placement
              </h3>
              <p className="text-sm text-[#625A6B] leading-relaxed">
                Fees become payable only when you successfully hire a candidate
                introduced by Perseus Talent, subject to agreed terms.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 4. CTA */}
      <CtaBand
        heading="Let's find the exceptional talent your organisation needs."
        primaryButton={{
          label: "Discuss Recruitment Needs",
          href: "/employers#enquiry",
          variant: "gold",
        }}
        secondaryButton={{
          label: "Contact Team",
          href: "/contact",
          variant: "outline-light",
        }}
        bg="purple"
      />
    </div>
  );
}
