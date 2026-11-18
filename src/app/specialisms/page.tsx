import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ornament } from "@/components/ui/Ornament";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { getSpecialisms } from "@/lib/content";

export const metadata = {
  title: "Our Specialisms — Healthcare & Professional Recruitment",
  description:
    "Explore Perseus Talent's recruitment specialisms. Healthcare is our primary area of focus, connecting organisations with dedicated professionals.",
};

export default async function SpecialismsPage() {
  const specialisms = await getSpecialisms();
  const primarySpecialism = specialisms.find((s) => s.meta.primary) || specialisms[0];

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
                Our Specialisms
              </li>
            </ol>
          </nav>

          <div className="max-w-[800px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Sector Expertise
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Specialist knowledge. Meaningful connections.
            </Heading>

            <div className="space-y-4 text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[54ch]">
              <p>Understanding a sector is essential to understanding its people.</p>
              <p>
                Perseus Talent focuses on connecting organisations with
                professionals whose skills, experience and ambitions align with
                their recruitment needs.
              </p>
              <p className="text-white font-medium">
                Healthcare is our primary area of focus, with a structure
                designed to accommodate further professional sectors as the
                business develops.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. FEATURED HEALTHCARE PANEL */}
      <Section bg="white">
        <Container>
          <div className="mb-12">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Primary Specialism
            </Eyebrow>
            <Heading level="h2" color="ink">
              Healthcare Recruitment
            </Heading>
          </div>

          {/* Featured Hero Card */}
          <div className="bg-[#1C052E] text-white rounded-[4px] border border-[#C5A15B]/40 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-[0_24px_60px_-20px_rgba(28,5,46,0.35)]">
            <GeometricPattern opacity={0.03} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-8">
                <span className="inline-block px-3 py-1 bg-white/10 text-[#C5A15B] text-xs font-semibold uppercase tracking-wider rounded-[2px] mb-4">
                  Core Specialism
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight">
                  Dedicated recruitment for clinical and healthcare organisations.
                </h3>
                <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-[50ch]">
                  {primarySpecialism?.meta.summary ||
                    "Connecting healthcare organisations with clinical and operational professionals whose skills and dedication deliver exceptional patient care."}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="gold"
                    size="lg"
                    arrow={true}
                    href="/specialisms/healthcare"
                  >
                    Explore Healthcare Specialism
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    href="/employers#enquiry"
                  >
                    Discuss Healthcare Brief
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 bg-white/5 border border-white/10 rounded-[2px] text-center">
                <span className="font-serif text-2xl font-semibold text-[#C5A15B] block mb-2">
                  15% Flat Fee
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  Transparent recruitment terms applied to annual gross base
                  salary. No tiered fees or surprises.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. FUTURE EXPANSION NOTE */}
      <Section bg="ivory" className="border-t border-b border-[#E6E0EB]">
        <Container narrow={true} className="text-center">
          <Eyebrow theme="light" withLine={true} className="mb-3">
            Sector Expansion
          </Eyebrow>
          <Heading level="h2" color="ink" className="mb-4">
            A growing portfolio of professional disciplines.
          </Heading>
          <p className="text-base text-[#625A6B] leading-relaxed mb-8 max-w-[50ch] mx-auto">
            While healthcare remains our primary dedication, our relationship-led
            methodology is structured to accommodate adjacent executive and
            professional appointments as our client network expands.
          </p>
          <Button variant="outline-dark" size="md" href="/contact">
            Enquire About Other Sectors
          </Button>
        </Container>
      </Section>

      {/* 4. CTA */}
      <CtaBand
        bg="purple-50"
        heading="Discuss your organisation's talent requirements."
        copy="Contact our specialist recruitment consultants to review your current requirements or future talent pipeline."
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
