import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ornament } from "@/components/ui/Ornament";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBand } from "@/components/sections/CtaBand";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. HOMEPAGE HERO */}
      <section className="relative overflow-hidden bg-[#1C052E] text-white min-h-[min(92vh,880px)] flex items-center pt-20 pb-16 md:pt-24 md:pb-20 border-b border-[#C5A15B]/30">
        {/* Subtle geometric pattern overlay */}
        <GeometricPattern opacity={0.04} />

        {/* Constellation graphic: positioned right on desktop, top-right behind text on mobile */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[340px] md:w-[460px] lg:w-[560px] h-[340px] md:h-[460px] lg:h-[560px] pointer-events-none opacity-25 lg:opacity-60 translate-x-12 lg:translate-x-0">
          <ConstellationGraphic opacity={0.9} />
        </div>

        <Container className="relative z-10">
          <div className="max-w-[760px]">
            {/* Eyebrow */}
            <div className="mb-4">
              <Eyebrow theme="dark" withLine={true}>
                UK Healthcare Recruitment Consultancy
              </Eyebrow>
            </div>

            {/* Main Headline */}
            <Heading
              level="display"
              color="white"
              className="mb-6 tracking-tight"
            >
              The right people. The right opportunities.{" "}
              <span className="italic text-[#D4B577]">A better future.</span>
            </Heading>

            {/* Supporting Copy */}
            <p className="font-sans text-lg md:text-xl text-white/80 leading-relaxed mb-8 md:mb-10 max-w-[44ch]">
              Connecting exceptional talent with organisations shaping the
              future of healthcare.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14">
              <Button
                variant="gold"
                size="lg"
                arrow={true}
                href="/employers"
                className="w-full sm:w-auto text-center"
              >
                Find Talent
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                href="/opportunities"
                className="w-full sm:w-auto text-center"
              >
                Explore Opportunities
              </Button>
            </div>

            {/* Factual Brand Pillars */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm text-white/70">
              <span>Relationship-led recruitment</span>
              <span className="text-[#C5A15B]" aria-hidden="true">
                ✦
              </span>
              <span>Transparent 15% flat fee</span>
              <span className="text-[#C5A15B]" aria-hidden="true">
                ✦
              </span>
              <span>Healthcare focus</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <Section bg="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Our Foundation
              </Eyebrow>
              <Heading level="h2" color="ink" className="leading-tight">
                People are at the heart of every great organisation.
              </Heading>
              <Ornament color="gold" className="justify-start my-6" />
            </div>

            <div className="lg:col-span-7 space-y-6 text-[#3A3242] font-sans text-base md:text-lg leading-relaxed">
              <p>
                At Perseus Talent, we believe exceptional recruitment goes beyond
                filling vacancies. It is about understanding people, recognising
                potential and building connections that create lasting value.
              </p>
              <p>
                We bring organisations and talented professionals together through
                a considered, relationship-led approach to recruitment.
              </p>
              <p className="text-[#1C052E] font-medium">
                Our focus is simple: understanding what organisations need,
                recognising what professionals can offer and creating
                connections that move careers and businesses forward.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. DUAL AUDIENCE SPLIT */}
      <Section bg="ivory" className="border-t border-b border-[#E6E0EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Serving Both Sides of Talent
            </Eyebrow>
            <Heading level="h2" color="ink">
              Dedicated pathways for employers and professionals.
            </Heading>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Employers Card */}
            <div className="bg-white border border-[#E6E0EB] rounded-[4px] p-8 md:p-12 flex flex-col justify-between transition-all duration-200 hover:border-[#C5A15B] hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.18)]">
              <div>
                <Eyebrow theme="light" withLine={true} className="mb-3">
                  For Employers
                </Eyebrow>
                <Heading level="h3" color="ink" className="mb-4">
                  Talent that moves your business forward.
                </Heading>
                <div className="space-y-4 text-sm md:text-base text-[#625A6B] leading-relaxed mb-8">
                  <p>Finding the right person can make all the difference.</p>
                  <p>
                    We work with organisations to understand their recruitment
                    requirements and identify professionals whose experience,
                    capabilities and ambitions align with their needs.
                  </p>
                  <p>
                    From understanding the role to identifying suitable
                    candidates, our approach is built around communication,
                    attention to detail and finding the right fit.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E6E0EB]">
                <Button
                  variant="purple"
                  size="md"
                  arrow={true}
                  href="/employers"
                  className="w-full sm:w-auto"
                >
                  Recruit With Perseus
                </Button>
              </div>
            </div>

            {/* Candidates Card */}
            <div className="bg-white border border-[#E6E0EB] rounded-[4px] p-8 md:p-12 flex flex-col justify-between transition-all duration-200 hover:border-[#C5A15B] hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.18)]">
              <div>
                <Eyebrow theme="light" withLine={true} className="mb-3">
                  For Candidates
                </Eyebrow>
                <Heading level="h3" color="ink" className="mb-4">
                  Your next opportunity starts here.
                </Heading>
                <div className="space-y-4 text-sm md:text-base text-[#625A6B] leading-relaxed mb-8">
                  <p>Your career deserves more than a job search.</p>
                  <p>
                    We believe every professional has a unique combination of
                    experience, ambition and potential.
                  </p>
                  <p>
                    Our aim is to connect talented people with opportunities
                    that support their professional development and future
                    ambitions.
                  </p>
                  <p>
                    Whether you are actively exploring new opportunities or
                    considering your next career move, Perseus Talent is here to
                    help you take the next step.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E6E0EB]">
                <Button
                  variant="purple"
                  size="md"
                  arrow={true}
                  href="/opportunities"
                  className="w-full sm:w-auto"
                >
                  Explore Opportunities
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. OUR APPROACH */}
      <Section bg="white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Our Methodology
            </Eyebrow>
            <Heading level="h2" color="ink">
              A more considered approach to recruitment.
            </Heading>
          </div>

          <ProcessSteps />
        </Container>
      </Section>

      {/* 5. PRICING PROMOTION (Purple Band) */}
      <section className="relative overflow-hidden bg-[#1C052E] text-white py-20 md:py-28 border-t border-b border-[#C5A15B]/30">
        <GeometricPattern opacity={0.04} />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left 7 Columns */}
            <div className="lg:col-span-7">
              <Eyebrow theme="dark" withLine={true} className="mb-4">
                Transparent Pricing
              </Eyebrow>
              <Heading
                level="h2"
                color="white"
                className="mb-6 leading-tight max-w-[20ch]"
              >
                Recruitment pricing without the guesswork.
              </Heading>

              <div className="space-y-4 text-white/80 font-sans text-base md:text-lg leading-relaxed mb-8 max-w-[48ch]">
                <p>
                  We believe recruitment fees should be straightforward and
                  transparent.
                </p>
                <p>
                  Our standard recruitment fee is calculated at a flat rate of
                  15% of the successful candidate&apos;s annual gross base salary.
                </p>
                <p className="text-white font-medium">
                  Use the Perseus Fee Calculator to receive an immediate
                  estimate.
                </p>
              </div>

              <div>
                <Button
                  variant="gold"
                  size="lg"
                  arrow={true}
                  href="/fee-calculator"
                  className="w-full sm:w-auto"
                >
                  Calculate Your Fee
                </Button>
              </div>
            </div>

            {/* Right 5 Columns (Typographic Feature) */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-center justify-center p-8 lg:p-12 rounded-[4px] bg-white/5 border border-white/10 text-center select-none">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#C5A15B] font-semibold mb-2">
                Standard Recruitment Fee
              </span>
              <div className="font-serif font-medium text-[88px] sm:text-[112px] lg:text-[140px] text-[#C5A15B] leading-[0.9] tracking-tight mb-4">
                15%
              </div>
              <p className="font-sans text-xs sm:text-sm text-white/80 max-w-[28ch] leading-relaxed">
                of the successful candidate&apos;s annual gross base salary
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. FINAL CTA BAND */}
      <CtaBand
        bg="purple-50"
        heading="Great opportunities begin with a conversation."
        copy="Whether you're looking to strengthen your organisation or take the next step in your career, let's start a conversation."
        primaryButton={{
          label: "Contact Our Team",
          href: "/contact",
          variant: "purple",
        }}
        secondaryButton={{
          label: "Explore Opportunities",
          href: "/opportunities",
          variant: "outline-dark",
        }}
      />
    </div>
  );
}
