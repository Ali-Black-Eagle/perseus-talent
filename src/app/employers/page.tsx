import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FeeCalculator } from "@/components/calculator/FeeCalculator";
import { EmployerEnquiryForm } from "@/components/forms/EmployerEnquiryForm";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "For Employers — Healthcare Recruitment",
  description:
    "Partner with Perseus Talent to identify and secure exceptional healthcare professionals. Relationship-led recruitment with a transparent 15% flat fee.",
  path: "/employers",
});

export default function EmployersPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "For Employers", url: "/employers" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. INTERIOR HERO */}
      <section className="relative overflow-hidden bg-[#1C052E] text-white pt-16 pb-16 md:pt-24 md:pb-20 border-b border-[#C5A15B]/30">
        <GeometricPattern opacity={0.04} />

        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[380px] h-[380px] pointer-events-none opacity-25">
          <ConstellationGraphic opacity={0.6} />
        </div>

        <Container className="relative z-10">
          {/* Breadcrumb */}
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
                For Employers
              </li>
            </ol>
          </nav>

          <div className="max-w-[800px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Employer Recruitment Services
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Find the people who move your business forward.
            </Heading>

            <div className="space-y-4 text-base md:text-lg text-white/80 font-sans leading-relaxed mb-8 max-w-[54ch]">
              <p>
                The right people make a meaningful difference to every
                organisation.
              </p>
              <p>
                At Perseus Talent, we work with employers to understand their
                requirements and connect them with professionals who bring the
                experience, capabilities and potential needed to contribute to
                their organisation.
              </p>
              <p className="text-white font-medium">
                We believe successful recruitment starts with understanding the
                people behind the position.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="gold"
                size="lg"
                arrow={true}
                href="#enquiry"
                className="w-full sm:w-auto text-center"
              >
                Discuss Your Recruitment Needs
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                href="#fee-calculator"
                className="w-full sm:w-auto text-center"
              >
                Calculate Your Fee
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. OUR RECRUITMENT APPROACH */}
      <Section bg="white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Our Methodology
            </Eyebrow>
            <Heading level="h2" color="ink">
              Our recruitment approach
            </Heading>
          </div>

          <ProcessSteps
            steps={[
              {
                number: "01",
                title: "Understand",
                description:
                  "We take time to understand the organisation, the position, the team structure and the qualities required for success.",
              },
              {
                number: "02",
                title: "Identify",
                description:
                  "We look for professionals whose experience, capabilities and ambitions genuinely align with your requirements.",
              },
              {
                number: "03",
                title: "Connect",
                description:
                  "We introduce well-matched candidates with honest appraisals, facilitating productive interview and evaluation conversations.",
              },
              {
                number: "04",
                title: "Deliver",
                description:
                  "We support the recruitment process through offer management and onboarding with clear, responsive communication.",
              },
            ]}
          />
        </Container>
      </Section>

      {/* 3. CORE SERVICE PROPOSITIONS (2x2 Editorial Grid) */}
      <Section bg="ivory" className="border-t border-b border-[#E6E0EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Structured Quality
            </Eyebrow>
            <Heading level="h2" color="ink">
              Every hire managed with precision.
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1: Understanding Requirements */}
            <Card hoverable={true} className="p-8 md:p-10">
              <span className="font-serif text-3xl font-medium text-[#C5A15B] mb-4 block">
                01
              </span>
              <Heading level="h3" color="ink" className="mb-4">
                Understanding your requirements
              </Heading>
              <p className="font-sans text-sm md:text-base text-[#625A6B] leading-relaxed">
                Every successful hire begins with a clear brief. We take time to
                understand the role, the responsibilities, the team it sits
                within and the qualities that will help someone succeed in your
                organisation.
              </p>
            </Card>

            {/* Box 2: Identifying Suitable Candidates */}
            <Card hoverable={true} className="p-8 md:p-10">
              <span className="font-serif text-3xl font-medium text-[#C5A15B] mb-4 block">
                02
              </span>
              <Heading level="h3" color="ink" className="mb-4">
                Identifying suitable candidates
              </Heading>
              <p className="font-sans text-sm md:text-base text-[#625A6B] leading-relaxed">
                We look for professionals whose experience, capabilities and
                ambitions genuinely align with your requirements, focusing on fit
                rather than volume.
              </p>
            </Card>

            {/* Box 3: Candidate Assessment & Screening */}
            <Card hoverable={true} className="p-8 md:p-10">
              <span className="font-serif text-3xl font-medium text-[#C5A15B] mb-4 block">
                03
              </span>
              <Heading level="h3" color="ink" className="mb-4">
                Candidate assessment and screening
              </Heading>
              <p className="font-sans text-sm md:text-base text-[#625A6B] leading-relaxed mb-6">
                Before introducing a candidate, we review their experience
                against your brief and discuss the opportunity with them to
                understand their motivations and suitability.
              </p>
              <Placeholder
                label="Screening checks to be confirmed"
                description="Specific pre-employment verification steps (e.g. Right to Work in the UK, professional registration checks, or references) will be confirmed by Perseus Talent in the recruitment agreement."
              />
            </Card>

            {/* Box 4: Communication Throughout */}
            <Card hoverable={true} className="p-8 md:p-10">
              <span className="font-serif text-3xl font-medium text-[#C5A15B] mb-4 block">
                04
              </span>
              <Heading level="h3" color="ink" className="mb-4">
                Communication throughout the process
              </Heading>
              <p className="font-sans text-sm md:text-base text-[#625A6B] leading-relaxed">
                You can expect clear, timely updates at each stage, from
                shortlist to offer, so you always know where your recruitment
                stands.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 4. OUR PRICING MODEL */}
      <Section bg="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Transparent Pricing Model
              </Eyebrow>
              <Heading level="h2" color="ink">
                A flat 15% recruitment fee. No tiers. No ambiguity.
              </Heading>
              <Ornament color="gold" className="justify-start my-6" />
            </div>

            <div className="lg:col-span-7 space-y-6 text-[#3A3242] font-sans text-base md:text-lg leading-relaxed">
              <p>
                A flat 15% of the successful candidate&apos;s annual gross base
                salary. No tiers and no complicated pricing structures.
              </p>
              <p>
                Final fees, payment terms and applicable conditions are confirmed
                in a written recruitment agreement before recruitment begins.
              </p>
              <Placeholder
                label="Terms of Business & Payment Terms"
                description="Standard invoice payment terms (e.g. 14 or 30 days) and rebate/replacement policy to be confirmed in Perseus Talent employer terms of business."
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. EMBEDDED FEE CALCULATOR */}
      <section
        id="fee-calculator"
        className="py-16 md:py-24 bg-[#1C052E] text-white scroll-mt-24 border-t border-b border-[#C5A15B]/30"
      >
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow theme="dark" withLine={true} className="mb-3">
              Instant Estimate
            </Eyebrow>
            <Heading level="h2" color="white">
              Recruitment Fee Calculator
            </Heading>
            <p className="text-white/80 text-sm md:text-base mt-2">
              Enter the annual base salary for your intended role to calculate
              the standard 15% fee.
            </p>
          </div>

          <FeeCalculator variant="embedded" />
        </Container>
      </section>

      {/* 6. EMPLOYER ENQUIRY FORM */}
      <section
        id="enquiry"
        className="py-16 md:py-28 bg-[#F7F3FA] scroll-mt-24 border-b border-[#E6E0EB]"
      >
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Begin a Search
            </Eyebrow>
            <Heading level="h2" color="ink">
              Register Your Recruitment Brief
            </Heading>
          </div>

          <EmployerEnquiryForm />
        </Container>
      </section>

      {/* 7. EMPLOYER CTA BAND */}
      <CtaBand
        bg="white"
        heading="Let's find your next great hire."
        copy="Speak with a consultant today to review your current vacancies or upcoming hiring plans."
        primaryButton={{
          label: "Discuss Your Recruitment Needs",
          href: "#enquiry",
          variant: "purple",
        }}
        secondaryButton={{
          label: "Calculate Your Fee",
          href: "#fee-calculator",
          variant: "outline-dark",
        }}
      />
    </div>
  );
}
