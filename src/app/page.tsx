import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ornament } from "@/components/ui/Ornament";
import { Logo } from "@/components/brand/Logo";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { EightPointStar } from "@/components/brand/EightPointStar";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBand } from "@/components/sections/CtaBand";

import { createPageMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.home);

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. HOMEPAGE HERO (FE6) */}
      <section className="relative overflow-hidden bg-purple-900 text-white flex items-center pt-16 pb-16 lg:pt-24 lg:pb-24 lg:min-h-[min(92vh,880px)]">
        {/* Subtle geometric pattern overlay */}
        <GeometricPattern opacity={0.04} />

        {/* Mobile constellation: top-right behind text at 280px and 25% opacity */}
        <div className="lg:hidden absolute -top-8 -right-8 w-[280px] h-[280px] pointer-events-none opacity-25">
          <ConstellationGraphic opacity={1} />
        </div>

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Columns 1–7: Hero text and actions */}
            <div className="lg:col-span-7">
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
                className="mb-6 max-w-[18ch]"
              >
                {"The right people. The right opportunities. "}
                <span className="italic text-gold-400">A better future.</span>
              </Heading>

              {/* Supporting Copy */}
              <p className="font-sans text-lg md:text-xl text-white/80 leading-relaxed mb-8 md:mb-10 max-w-[44ch]">
                Connecting exceptional talent with organisations shaping the
                future of healthcare.
              </p>

              {/* CTAs with 12px gap */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-12">
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

              {/* Factual Brand Pillars (no extra top border, 8-point stars) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm text-white/70">
                <span>Relationship-led recruitment</span>
                <EightPointStar size={10} className="text-gold-500 shrink-0" aria-hidden="true" />
                <span>Transparent 15% flat fee</span>
                <EightPointStar size={10} className="text-gold-500 shrink-0" aria-hidden="true" />
                <span>Healthcare focus</span>
              </div>
            </div>

            {/* Columns 8–12: Constellation on desktop (about 520px) */}
            <div className="hidden lg:flex lg:col-span-5 justify-end items-center">
              <div className="w-[520px] h-[520px] pointer-events-none opacity-60">
                <ConstellationGraphic opacity={1} />
              </div>
            </div>
          </div>
        </Container>

        {/* Bottom hairline at container width, gold, 30% opacity */}
        <div className="absolute bottom-0 inset-x-0 pointer-events-none">
          <Container>
            <div className="border-b border-gold-500/30 w-full" />
          </Container>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <Section bg="white">
        <Container>
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Our Foundation
              </Eyebrow>
              <Heading level="h2" color="ink" className="leading-tight">
                People are at the heart of every great organisation.
              </Heading>
              <Ornament color="gold" className="justify-start my-6" />
              <div className="mt-8">
                <Logo variant="full" size={280} linkToHome={false} />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-body font-sans text-base md:text-lg leading-relaxed">
              <p>
                At Perseus Talent, we believe exceptional recruitment goes beyond
                filling vacancies. It is about understanding people, recognising
                potential and building connections that create lasting value.
              </p>
              <p>
                We bring organisations and talented professionals together through
                a considered, relationship-led approach to recruitment.
              </p>
              <p className="text-purple-900 font-medium">
                Our focus is simple: understanding what organisations need,
                recognising what professionals can offer and creating
                connections that move careers and businesses forward.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. DUAL AUDIENCE SPLIT */}
      <Section bg="ivory" className="border-t border-b border-line">
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Serving Both Sides of Talent
            </Eyebrow>
            <Heading level="h2" color="ink">
              Dedicated pathways for employers and professionals.
            </Heading>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Employers Card */}
            <div data-reveal className="bg-white border border-line rounded-[4px] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-gold-500 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.18)]">
              <div className="relative aspect-[4/3] w-full bg-purple-900">
                <Image
                  src="/images/about/team-partnership.webp"
                  alt="An empty, modern meeting room with a table and chairs"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 600px, 100vw"
                />
              </div>

              <div className="p-8 md:p-12 flex-1 flex flex-col justify-between">
                <div>
                  <Eyebrow theme="light" withLine={true} className="mb-3">
                    For Employers
                  </Eyebrow>
                  <h2 className="font-serif font-medium text-3xl md:text-[38px] text-purple-900 mb-4 leading-[1.1]">
                    Talent that moves your business forward.
                  </h2>
                  <div className="space-y-4 text-base text-muted leading-relaxed mb-8">
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

                <div className="pt-6 border-t border-line">
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
            </div>

            {/* Candidates Card */}
            <div data-reveal className="bg-white border border-line rounded-[4px] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-gold-500 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.18)]">
              <div className="relative aspect-[4/3] w-full bg-purple-900">
                <Image
                  src="/images/home/healthcare-professional.webp"
                  alt="A healthcare professional holding a stethoscope"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 600px, 100vw"
                />
              </div>

              <div className="p-8 md:p-12 flex-1 flex flex-col justify-between">
                <div>
                  <Eyebrow theme="light" withLine={true} className="mb-3">
                    For Candidates
                  </Eyebrow>
                  <h2 className="font-serif font-medium text-3xl md:text-[38px] text-purple-900 mb-4 leading-[1.1]">
                    Your next opportunity starts here.
                  </h2>
                  <div className="space-y-4 text-base text-muted leading-relaxed mb-8">
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

                <div className="pt-6 border-t border-line">
                  <Button
                    variant="outline-dark"
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
          </div>
        </Container>
      </Section>

      {/* 4. OUR APPROACH */}
      <Section bg="white">
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
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

      {/* 5. PRICING PROMOTION (Purple Band per FE7 / FE8 / Item 15) */}
      <section className="relative overflow-hidden bg-purple-900 text-white py-16 md:py-24 lg:py-32 border-t border-b border-gold-500/30">
        <GeometricPattern opacity={0.04} />

        <Container className="relative z-10">
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
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

            {/* Right 5 Columns (Typographic Feature: 112->180px, no box, no extra eyebrow) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center select-none">
              <div className="font-serif font-medium text-[length:var(--text-stat-feature)] text-gold-500 leading-[0.9] tracking-[-0.02em] mb-4">
                15%
              </div>
              <p className="font-sans text-sm md:text-base text-white/80 max-w-[28ch] leading-relaxed">
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
