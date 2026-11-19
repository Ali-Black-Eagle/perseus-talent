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
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";
import { getSpecialisms } from "@/lib/content";

export const metadata = createPageMetadata(pageSeo.specialisms);

export default async function SpecialismsPage() {
  const specialisms = await getSpecialisms();
  const primarySpecialism = specialisms.find((s) => s.meta.primary) || specialisms[0];
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Our Specialisms", url: "/specialisms" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Specialisms" },
        ]}
        eyebrow="Sector Expertise"
        title="Specialist knowledge. Meaningful connections."
        lead={
          <>
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
          </>
        }
      />

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

          {/* Featured Hero Card with 7/5 Split */}
          <div className="bg-purple-900 text-white rounded-[4px] border border-gold-500/40 overflow-hidden relative shadow-[0_24px_60px_-20px_rgba(28,5,46,0.35)]">
            <GeometricPattern opacity={0.03} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight">
                    Dedicated recruitment for clinical and healthcare organisations.
                  </h3>
                  <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-[50ch]">
                    {primarySpecialism?.meta.summary ||
                      "Connecting healthcare organisations with clinical and operational professionals whose skills and dedication deliver exceptional patient care."}
                  </p>
                </div>

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

              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-purple-800">
                <Image
                  src="/images/specialisms/clinical-care.webp"
                  alt="A clinician examining chest x-rays in a medical office"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 500px, 100vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. FUTURE EXPANSION NOTE (Render only if more than one active specialism) */}
      {specialisms.length > 1 && (
        <Section bg="ivory" className="border-t border-b border-line">
          <Container narrow={true} className="text-center">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Sector Expansion
            </Eyebrow>
            <Heading level="h2" color="ink" className="mb-4">
              A growing portfolio of professional disciplines.
            </Heading>
            <p className="text-base text-muted leading-relaxed mb-8 max-w-[50ch] mx-auto">
              While healthcare remains our primary dedication, our relationship-led
              methodology is structured to accommodate adjacent executive and
              professional appointments.
            </p>
            <Button variant="outline-dark" size="md" href="/contact">
              Enquire About Other Sectors
            </Button>
          </Container>
        </Section>
      )}

      {/* 4. CTA */}
      <CtaBand
        bg="purple-50"
        heading="Discuss your organisation's talent requirements."
        copy="Contact our specialist recruitment consultants to review your current requirements or future talent pipeline."
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
