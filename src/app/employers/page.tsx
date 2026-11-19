import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { Card } from "@/components/ui/Card";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FeeCalculator } from "@/components/calculator/FeeCalculator";
import { EmployerEnquiryForm } from "@/components/forms/EmployerEnquiryForm";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.employers);

export default function EmployersPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Employers", url: "/employers" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. INTERIOR HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Employers" },
        ]}
        eyebrow="Employer Recruitment Services"
        title="Find the people who move your business forward."
        lead={
          <>
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
          </>
        }
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
      </PageHero>

      {/* 2. OUR RECRUITMENT APPROACH */}
      <Section bg="white">
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
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

      {/* 3. CORE SERVICE PROPOSITIONS (2x2 Image-Led Editorial Grid per Item 12 & 13) */}
      <Section bg="ivory" className="border-t border-b border-line">
        <Container>
          {/* Asymmetric Header (Item 12) */}
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
            <div className="lg:col-span-6">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Structured Quality
              </Eyebrow>
              <Heading level="h2" color="ink">
                Every hire managed with precision.
              </Heading>
            </div>
            <div className="lg:col-span-6">
              <p className="font-sans text-base md:text-lg text-muted leading-relaxed">
                Our structured approach ensures candidate quality, rigorous clinical
                suitability and dedicated communication from mandate to placement.
              </p>
            </div>
          </div>

          {/* 2x2 Image-Led Editorial Grid (No numerals, 16px body text) */}
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1: Understanding Requirements */}
            <Card hoverable={true} className="p-0 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full bg-purple-900">
                <Image
                  src="/images/insights/job-brief.webp"
                  alt="A person writing in a notebook at a desk with a laptop"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 500px, 100vw"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <Heading level="h3" color="ink" className="mb-4">
                    Understanding your requirements
                  </Heading>
                  <p className="font-sans text-base text-muted leading-relaxed">
                    Every successful hire begins with a clear brief. We take time to
                    understand the role, the responsibilities, the team it sits
                    within and the qualities that will help someone succeed in your
                    organisation.
                  </p>
                </div>
              </div>
            </Card>

            {/* Box 2: Identifying Suitable Candidates */}
            <Card hoverable={true} className="p-0 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full bg-purple-900">
                <Image
                  src="/images/specialisms/clinical-care.webp"
                  alt="A clinician examining chest x-rays in a medical office"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 500px, 100vw"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <Heading level="h3" color="ink" className="mb-4">
                    Identifying suitable candidates
                  </Heading>
                  <p className="font-sans text-base text-muted leading-relaxed">
                    We look for professionals whose experience, capabilities and
                    ambitions genuinely align with your requirements, focusing on fit
                    rather than volume.
                  </p>
                </div>
              </div>
            </Card>

            {/* Box 3: Candidate Assessment & Screening */}
            <Card hoverable={true} className="p-0 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full bg-purple-900">
                <Image
                  src="/images/insights/interview-preparation.webp"
                  alt="A desk with notes, a notebook and a coffee, set up for preparation"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 500px, 100vw"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <Heading level="h3" color="ink" className="mb-4">
                    Candidate assessment and screening
                  </Heading>
                  <p className="font-sans text-base text-muted leading-relaxed mb-6">
                    Before introducing a candidate, we review their experience
                    against your brief and discuss the opportunity with them to
                    understand their motivations and suitability.
                  </p>
                  <div className="bg-purple-50/70 border border-gold-500/30 rounded-[2px] p-4 text-xs font-sans text-muted leading-relaxed">
                    <span className="font-semibold text-purple-900 block mb-1">
                      Pre-Employment Verification Framework
                    </span>
                    Standard verification protocols include Right to Work in the UK validation, professional registration checks (e.g. NMC/GMC where applicable), identity confirmation, and verified employment references prior to placement.
                  </div>
                </div>
              </div>
            </Card>

            {/* Box 4: Communication Throughout */}
            <Card hoverable={true} className="p-0 overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[16/9] w-full bg-purple-900">
                <Image
                  src="/images/about/team-partnership.webp"
                  alt="An empty, modern meeting room with a table and chairs"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 500px, 100vw"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <Heading level="h3" color="ink" className="mb-4">
                    Communication throughout the process
                  </Heading>
                  <p className="font-sans text-base text-muted leading-relaxed">
                    You can expect clear, timely updates at each stage, from
                    shortlist to offer, so you always know where your recruitment
                    stands.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 4. OUR PRICING MODEL */}
      <Section bg="white">
        <Container>
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Transparent Pricing Model
              </Eyebrow>
              <Heading level="h2" color="ink">
                A flat 15% recruitment fee. No tiers. No ambiguity.
              </Heading>
              <Ornament color="gold" className="justify-start my-6" />
            </div>

            <div className="lg:col-span-7 space-y-6 text-body font-sans text-base md:text-lg leading-relaxed">
              <p>
                A flat 15% of the successful candidate&apos;s annual gross base
                salary. No tiers and no complicated pricing structures.
              </p>
              <p>
                Final fees, payment terms and applicable conditions are confirmed
                in a written recruitment agreement.
              </p>
              <div className="bg-ivory border border-gold-500/30 rounded-[2px] p-5 text-sm font-sans text-muted leading-relaxed">
                <span className="font-semibold text-purple-900 block mb-1">
                  Transparent Terms of Business
                </span>
                Standard client terms specify a flat 15% recruitment fee on annual base salary, standard 14-day invoice payment terms, and a comprehensive replacement guarantee period confirmed in your written recruitment agreement.
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. EMBEDDED FEE CALCULATOR (White background so purple card pops per Item 13) */}
      <Section
        id="fee-calculator"
        bg="white"
        className="scroll-mt-24 border-t border-b border-line"
      >
        <Container>
          <div data-reveal className="max-w-3xl mb-12">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Instant Estimate
            </Eyebrow>
            <Heading level="h2" color="ink">
              Calculate your recruitment fee in seconds.
            </Heading>
            <p className="text-muted text-base md:text-lg mt-3 leading-relaxed max-w-[54ch]">
              Enter the annual base salary for your intended role to calculate
              the standard 15% recruitment fee.
            </p>
          </div>

          <FeeCalculator variant="embedded" />
        </Container>
      </Section>

      {/* 6. EMPLOYER ENQUIRY FORM */}
      <section
        id="enquiry"
        className="py-16 md:py-28 bg-purple-50 scroll-mt-24 border-b border-line"
      >
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-12">
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
