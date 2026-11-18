import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ornament } from "@/components/ui/Ornament";
import { Placeholder } from "@/components/ui/Placeholder";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";

export const metadata = {
  title: "About Us — Built on Ambition, Driven by People",
  description:
    "Learn about Perseus Talent: our story, relationship-led recruitment philosophy, core values, and vision for the UK healthcare recruitment industry.",
};

const companyValues = [
  {
    name: "Integrity",
    desc: "Acting honestly, professionally and responsibly.",
  },
  {
    name: "Understanding",
    desc: "Taking the time to understand people and organisations.",
  },
  {
    name: "Excellence",
    desc: "Maintaining high standards throughout the recruitment process.",
  },
  {
    name: "Relationships",
    desc: "Building meaningful professional connections.",
  },
  {
    name: "Ambition",
    desc: "Always looking for opportunities to improve and progress.",
  },
];

export default function AboutPage() {
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
                About Us
              </li>
            </ol>
          </nav>

          <div className="max-w-[800px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Our Organisation
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Built on ambition. Driven by people.
            </Heading>

            <div className="space-y-4 text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[54ch]">
              <p>
                Perseus Talent was established with a clear belief: great
                organisations are built by great people.
              </p>
              <p>
                We approach recruitment as a relationship, not simply a
                transaction.
              </p>
              <p>
                By taking the time to understand both organisations and
                professionals, we aim to create connections that deliver
                meaningful and lasting value.
              </p>
              <p className="text-white font-medium">
                Our ambition is to build a recruitment consultancy recognised
                for its professionalism, attention to detail and commitment to
                people.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. OUR STORY */}
      <Section bg="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Background
              </Eyebrow>
              <Heading level="h2" color="ink">
                Our story
              </Heading>
              <Ornament color="gold" className="justify-start my-6" />
            </div>

            <div className="lg:col-span-7 space-y-6 text-[#3A3242] font-sans text-base md:text-lg leading-relaxed">
              <p>
                In a recruitment industry often dominated by automated matching
                and high-volume transactions, Perseus Talent was founded to
                provide a more considered, relationship-led alternative.
              </p>
              <p>
                We believe that finding exceptional people requires genuine
                listening, industry understanding, and honest counsel. We treat
                every recruitment brief as a tailored partnership, focusing on
                long-term capability and cultural synergy.
              </p>

              {/* Founder placeholder */}
              <Placeholder
                label="Founder details & executive background to be supplied"
                description="Founding date, founder profile, and professional leadership background will be supplied by the business owner. No unverified executive history is published."
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. OUR PHILOSOPHY */}
      <Section bg="ivory" className="border-t border-b border-[#E6E0EB]">
        <Container narrow={true} className="text-center">
          <Eyebrow theme="light" withLine={true} className="mb-3">
            Core Belief
          </Eyebrow>
          <Heading level="h2" color="ink" className="mb-6">
            Our philosophy
          </Heading>
          <p className="font-serif italic text-2xl md:text-3xl text-[#1C052E] leading-snug mb-6 max-w-[34ch] mx-auto">
            &ldquo;Recruitment is a relationship, never a transaction. Quality of
            fit always takes precedence over volume.&rdquo;
          </p>
          <p className="font-sans text-base text-[#625A6B] leading-relaxed max-w-[48ch] mx-auto">
            We measure our success not by the number of CVs sent, but by the
            enduring impact of the placements we facilitate for employers and
            candidates alike.
          </p>
        </Container>
      </Section>

      {/* 4. OUR VALUES */}
      <Section bg="white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Guiding Principles
            </Eyebrow>
            <Heading level="h2" color="ink">
              Our values
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((val) => (
              <Card key={val.name} hoverable={true} className="p-8">
                <div className="w-10 h-10 rounded-[2px] bg-[#F7F3FA] text-[#C5A15B] flex items-center justify-center font-serif text-xl font-bold mb-4">
                  ✦
                </div>
                <h3 className="font-serif font-semibold text-2xl text-[#1C052E] mb-2">
                  {val.name}
                </h3>
                <p className="font-sans text-sm text-[#625A6B] leading-relaxed">
                  {val.desc}
                </p>
              </Card>
            ))}

            {/* Sixth card: The Name & Perseus Symbolism */}
            <Card
              hoverable={true}
              className="p-8 bg-[#1C052E] text-white border-[#1C052E]"
            >
              <div className="w-10 h-10 rounded-[2px] bg-white/10 text-[#C5A15B] flex items-center justify-center font-serif text-xl font-bold mb-4">
                ✦
              </div>
              <h3 className="font-serif font-semibold text-2xl text-[#C5A15B] mb-2">
                The Name
              </h3>
              <p className="font-sans text-sm text-white/80 leading-relaxed">
                Named after the constellation of Perseus, a timeless symbol of
                navigation, guidance, and purposeful direction across uncharted
                horizons.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 5. OUR APPROACH */}
      <Section bg="ivory" className="border-t border-b border-[#E6E0EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              How We Work
            </Eyebrow>
            <Heading level="h2" color="ink">
              Our approach
            </Heading>
          </div>

          <ProcessSteps />
        </Container>
      </Section>

      {/* 6. OUR VISION (Purple Band) */}
      <section className="relative overflow-hidden bg-[#1C052E] text-white py-20 border-b border-[#C5A15B]/30">
        <GeometricPattern opacity={0.04} />

        <Container narrow={true} className="relative z-10 text-center">
          <Eyebrow theme="dark" withLine={true} className="mb-4">
            Our Vision
          </Eyebrow>
          <Heading level="h2" color="white" className="mb-6 leading-tight">
            To build a recruitment consultancy recognised for its
            professionalism, attention to detail and commitment to people.
          </Heading>
          <p className="font-sans text-sm md:text-base text-white/70 max-w-[44ch] mx-auto leading-relaxed">
            Every introduction we facilitate is guided by this enduring
            standard of care and responsibility.
          </p>
        </Container>
      </section>

      {/* 7. CTA */}
      <CtaBand
        bg="purple-50"
        heading="Start a conversation with Perseus Talent."
        copy="Whether you represent a healthcare organisation or are seeking your next career milestone, we welcome the opportunity to connect."
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
