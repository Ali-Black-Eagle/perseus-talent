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

export const metadata = {
  title: "The Perseus Fee Calculator — Transparent 15% Recruitment Pricing",
  description:
    "Calculate your healthcare recruitment fee instantly. Straightforward flat 15% rate applied to annual gross base salary with zero hidden fees.",
};

export default function FeeCalculatorPage() {
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
                Calculate Your Fee
              </li>
            </ol>
          </nav>

          <div className="max-w-[760px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              The Perseus Fee Calculator
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Transparent recruitment pricing. No guesswork.
            </Heading>

            <div className="space-y-4 text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[50ch]">
              <p>Calculate your recruitment fee in seconds.</p>
              <p>
                Enter the annual salary of your intended hire and discover your
                estimated recruitment fee using our straightforward 15% flat-rate
                pricing model.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. INTERACTIVE FEE CALCULATOR COMPONENT */}
      <Section bg="white">
        <Container>
          <FeeCalculator initialSalary="40000" variant="standalone" />
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
              How our recruitment fee works
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card hoverable={false} className="p-8">
              <span className="font-serif text-3xl font-medium text-[#C5A15B] mb-3 block">
                15%
              </span>
              <Heading level="h3" color="ink" className="mb-3">
                A single flat rate
              </Heading>
              <p className="font-sans text-sm md:text-base text-[#625A6B] leading-relaxed">
                Our standard fee is always calculated at 15% of the successful
                candidate&apos;s annual gross base salary. We do not use fee
                brackets, sliding scales, or variable percentages based on
                seniority.
              </p>
            </Card>

            <Card hoverable={false} className="p-8">
              <span className="font-serif text-3xl font-medium text-[#C5A15B] mb-3 block">
                Base
              </span>
              <Heading level="h3" color="ink" className="mb-3">
                What counts as base salary?
              </Heading>
              <p className="font-sans text-sm md:text-base text-[#625A6B] leading-relaxed">
                The fee applies exclusively to annual gross base salary before
                tax. It does not automatically include discretionary bonuses,
                commissions, car allowances, relocation expenses, or employee
                benefits.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 4. CTA BAND */}
      <CtaBand
        bg="purple-50"
        heading="Ready to discuss your hiring requirements?"
        copy="Contact our team today with your recruitment brief to discuss timelines, candidate availability, and role specifications."
        primaryButton={{
          label: "Discuss Your Recruitment Needs",
          href: "/employers#enquiry",
          variant: "purple",
        }}
        secondaryButton={{
          label: "View Our Specialisms",
          href: "/specialisms",
          variant: "outline-dark",
        }}
      />
    </div>
  );
}
