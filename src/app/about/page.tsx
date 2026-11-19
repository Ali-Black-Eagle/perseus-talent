import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ornament } from "@/components/ui/Ornament";
import { Logo } from "@/components/brand/Logo";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { EightPointStar } from "@/components/brand/EightPointStar";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.about);

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
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
        eyebrow="Our Organisation"
        title="Built on ambition. Driven by people."
        lead={
          <>
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
          </>
        }
      />

      {/* 2. OUR STORY */}
      <Section bg="white">
        <Container>
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Background
              </Eyebrow>
              <Heading level="h2" color="ink">
                Our story
              </Heading>
              <Ornament color="gold" className="justify-start my-6" />

              <div className="relative aspect-[4/3] w-full rounded-[4px] overflow-hidden border border-gold-500/30 bg-purple-900">
                <Image
                  src="/images/about/team-partnership.webp"
                  alt="An empty, modern meeting room with a table and chairs"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 500px, 100vw"
                />
              </div>

              <div className="pt-4 flex justify-center lg:justify-start">
                <Logo variant="full" size={260} linkToHome={false} />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-body font-sans text-base md:text-lg leading-relaxed pt-2">
              <p>
                In a recruitment industry often dominated by automated matching
                and high-volume transactions, Perseus Talent was founded to
                provide a more considered, relationship-led alternative.
              </p>
              <p>
                We believe that finding exceptional people requires genuine
                listening, industry understanding, and honest counsel. We treat
                every recruitment brief as a tailored partnership, focusing on
                long-term capability and genuine team fit.
              </p>

              {/* Leadership & Dedication Statement */}
              <div className="bg-ivory border-l-2 border-gold-500 p-6 rounded-r-[2px] space-y-3">
                <h3 className="font-serif font-semibold text-xl text-purple-900">
                  Leadership & Dedication
                </h3>
                <p className="text-sm text-muted leading-relaxed font-sans">
                  Perseus Talent operates under private ownership, led by recruitment professionals dedicated to raising standards in UK healthcare talent acquisition. We place high value on discretion, accountability, and the lasting relationships built with both clients and candidates.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. OUR PHILOSOPHY */}
      <Section bg="ivory" className="border-t border-b border-line">
        <Container narrow={true} data-reveal className="text-center">
          <Eyebrow theme="light" withLine={true} className="mb-3">
            Core Belief
          </Eyebrow>
          <Heading level="h2" color="ink" className="mb-6">
            Our philosophy
          </Heading>
          <p className="font-serif italic text-2xl md:text-3xl text-purple-900 leading-snug mb-6 max-w-[34ch] mx-auto">
            &ldquo;Recruitment is a relationship, never a transaction. Quality of
            fit always takes precedence over volume.&rdquo;
          </p>
          <p className="font-sans text-base text-muted leading-relaxed max-w-[48ch] mx-auto">
            We measure our success not by the number of CVs sent, but by the
            enduring impact of the placements we facilitate for employers and
            candidates alike.
          </p>
        </Container>
      </Section>

      {/* 4. OUR VALUES */}
      <Section bg="white">
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Guiding Principles
            </Eyebrow>
            <Heading level="h2" color="ink">
              Our values
            </Heading>
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((val) => (
              <Card key={val.name} hoverable={true} className="p-8">
                <div className="w-10 h-10 rounded-[2px] bg-purple-50 text-gold-text flex items-center justify-center mb-4">
                  <EightPointStar size={18} />
                </div>
                <h3 className="font-serif font-semibold text-2xl text-purple-900 mb-2">
                  {val.name}
                </h3>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  {val.desc}
                </p>
              </Card>
            ))}

            {/* Sixth card: The Name & Perseus Symbolism */}
            <Card
              hoverable={true}
              className="p-8 bg-purple-900 text-white border-purple-900"
            >
              <div className="w-10 h-10 rounded-[2px] bg-white/10 text-gold-500 flex items-center justify-center mb-4">
                <EightPointStar size={18} />
              </div>
              <h3 className="font-serif font-semibold text-2xl text-gold-400 mb-2">
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

      {/* 5. OUR APPROACH (Asymmetric Split per Item 12) */}
      <Section bg="ivory" className="border-t border-b border-line">
        <Container>
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-6">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                How We Work
              </Eyebrow>
              <Heading level="h2" color="ink">
                Our recruitment approach
              </Heading>
            </div>
            <div className="lg:col-span-6">
              <p className="font-sans text-base md:text-lg text-muted leading-relaxed">
                Recruitment built on consultation rather than transaction. We take
                time to understand the people, requirements and ambitions behind each position.
              </p>
            </div>
          </div>

          <ProcessSteps bg="ivory" />
        </Container>
      </Section>

      {/* 6. OUR VISION (Purple Band) */}
      <section className="relative overflow-hidden bg-purple-900 text-white py-20 border-b border-gold-500/30">
        <GeometricPattern opacity={0.04} />

        <Container narrow={true} data-reveal className="relative z-10 text-center">
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
