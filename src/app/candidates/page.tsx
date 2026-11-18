import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Ornament } from "@/components/ui/Ornament";
import { Card } from "@/components/ui/Card";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { CandidateRegistrationForm } from "@/components/forms/CandidateRegistrationForm";
import { CtaBand } from "@/components/sections/CtaBand";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { site } from "@/config/site";

export const metadata = {
  title: "For Candidates — Career Opportunities in Healthcare",
  description:
    "Register your professional profile with Perseus Talent. We connect talented professionals with meaningful healthcare opportunities across the UK.",
};

const candidateFaqs: AccordionItem[] = [
  {
    id: "fee",
    question: "Do I have to pay to register?",
    answer:
      "No. We do not charge candidates for helping them find work. In accordance with UK employment agency regulations, our recruitment fees are paid entirely by hiring organisations upon successful placement.",
  },
  {
    id: "process",
    question: "What happens after I register?",
    answer:
      "We review your details and CV against our current and upcoming healthcare briefs. Where we have or anticipate a role aligned with your experience and aspirations, a member of our team will be in touch. Registering does not guarantee an interview or placement.",
  },
  {
    id: "cv-sharing",
    question: "Will you share my CV without asking me?",
    answer:
      "No. We will always discuss a specific role and organisation with you before your CV or personal information is submitted to any prospective employer.",
  },
  {
    id: "file-types",
    question: "Which file types can I upload?",
    answer:
      "We accept PDF, DOC, and DOCX documents up to a maximum file size of 4MB.",
  },
  {
    id: "passive",
    question: "I'm not actively looking. Can I still register?",
    answer:
      "Yes. You are welcome to register and let us know what your next career step might look like. We frequently represent discreet, executive, and specialist roles suited to passive professionals.",
  },
  {
    id: "gdpr",
    question: "How is my information used and can I ask for it to be deleted?",
    answer: (
      <span>
        Your personal details and CV are processed solely to evaluate suitability
        for recruitment opportunities, stored securely, and never sold to third
        parties. You may request rectification, access, or permanent erasure of
        your data at any time by contacting our privacy officer at{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-[#1C052E] font-medium underline underline-offset-2 hover:text-[#7A5A20]"
        >
          {site.email}
        </a>
        . For full details, please consult our{" "}
        <Link
          href="/privacy-policy"
          className="text-[#1C052E] font-medium underline underline-offset-2 hover:text-[#7A5A20]"
        >
          Privacy Policy
        </Link>
        .
      </span>
    ),
  },
];

export default function CandidatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ job?: string }>;
}) {
  return <CandidatesContent searchParams={searchParams} />;
}

async function CandidatesContent({
  searchParams,
}: {
  searchParams?: Promise<{ job?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const initialJobSlug = resolved?.job || "";

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
                For Candidates
              </li>
            </ol>
          </nav>

          <div className="max-w-[800px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Professional Representation
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Your next opportunity starts here.
            </Heading>

            <div className="space-y-4 text-base md:text-lg text-white/80 font-sans leading-relaxed mb-8 max-w-[54ch]">
              <p>Your professional journey is unique.</p>
              <p>
                At Perseus Talent, we aim to connect ambitious professionals with
                organisations offering meaningful career opportunities.
              </p>
              <p>
                We take the time to understand your experience, career ambitions
                and what matters to you in your next move.
              </p>
              <p className="text-white font-medium">
                Whether you are actively looking or simply exploring what comes
                next, we welcome the opportunity to connect.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="gold"
                size="lg"
                arrow={true}
                href="#register"
                className="w-full sm:w-auto text-center"
              >
                Register Your Interest
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
          </div>
        </Container>
      </section>

      {/* 2. WHY CONNECT WITH PERSEUS TALENT */}
      <Section bg="white">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Candidate Values
            </Eyebrow>
            <Heading level="h2" color="ink">
              Why connect with Perseus Talent?
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-[#F7F3FA] text-[#C5A15B] flex items-center justify-center font-serif text-xl font-bold mb-4">
                ✦
              </div>
              <h3 className="font-serif font-semibold text-xl text-[#1C052E] mb-3">
                Relationship-led
              </h3>
              <p className="text-sm text-[#625A6B] leading-relaxed">
                A personal, considered consultation. We invest time in
                understanding who you are, beyond a résumé.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-[#F7F3FA] text-[#C5A15B] flex items-center justify-center font-serif text-xl font-bold mb-4">
                ✦
              </div>
              <h3 className="font-serif font-semibold text-xl text-[#1C052E] mb-3">
                Focused on ambition
              </h3>
              <p className="text-sm text-[#625A6B] leading-relaxed">
                We evaluate opportunities against your long-term progression,
                work-life balance, and professional goals.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-[#F7F3FA] text-[#C5A15B] flex items-center justify-center font-serif text-xl font-bold mb-4">
                ✦
              </div>
              <h3 className="font-serif font-semibold text-xl text-[#1C052E] mb-3">
                Honest communication
              </h3>
              <p className="text-sm text-[#625A6B] leading-relaxed">
                Transparent feedback, realistic briefings, and prompt updates at
                every stage of the recruitment process.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-[#F7F3FA] text-[#C5A15B] flex items-center justify-center font-serif text-xl font-bold mb-4">
                ✦
              </div>
              <h3 className="font-serif font-semibold text-xl text-[#1C052E] mb-3">
                Strict confidentiality
              </h3>
              <p className="text-sm text-[#625A6B] leading-relaxed">
                Your profile is never submitted to an employer without your
                prior knowledge and explicit consent.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 3. OUR CANDIDATE APPROACH */}
      <Section bg="ivory" className="border-t border-b border-[#E6E0EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              The Candidate Journey
            </Eyebrow>
            <Heading level="h2" color="ink">
              Our candidate approach
            </Heading>
          </div>

          <ProcessSteps
            steps={[
              {
                number: "01",
                title: "Conversation",
                description:
                  "An introductory discussion to learn about your clinical experience, achievements and professional ambitions.",
              },
              {
                number: "02",
                title: "Understanding Goals",
                description:
                  "We clarify your preferred working arrangements, locations, organisational culture, and salary expectations.",
              },
              {
                number: "03",
                title: "Relevant Roles",
                description:
                  "When a vacancy genuinely matches your brief, we share detailed insight on the role and organisation.",
              },
              {
                number: "04",
                title: "Process Support",
                description:
                  "From interview preparation through offer negotiation, we support you with clear advice and advocacy.",
              },
            ]}
          />
        </Container>
      </Section>

      {/* 4. CAREER OPPORTUNITIES TEASER */}
      <Section bg="white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-8">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Current Vacancies
            </Eyebrow>
            <Heading level="h2" color="ink">
              Career opportunities
            </Heading>
            <p className="text-[#625A6B] text-base mt-2">
              Browse our latest specialist opportunities across UK healthcare.
            </p>
          </div>

          <div className="p-10 border border-[#E6E0EB] rounded-[4px] bg-[#FBF9F6] text-center max-w-xl mx-auto">
            <p className="font-serif text-2xl text-[#1C052E] mb-2">
              New opportunities are on the horizon.
            </p>
            <p className="text-sm text-[#625A6B] mb-6">
              Register your interest below or view our opportunities directory to
              explore upcoming roles as they open.
            </p>
            <Button variant="outline-dark" size="md" href="/opportunities">
              View All Opportunities
            </Button>
          </div>
        </Container>
      </Section>

      {/* 5. CANDIDATE REGISTRATION + CV FORM */}
      <section
        id="register"
        className="py-16 md:py-28 bg-[#F7F3FA] scroll-mt-24 border-t border-b border-[#E6E0EB]"
      >
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Registration & CV Submission
            </Eyebrow>
            <Heading level="h2" color="ink">
              Register Your Profile
            </Heading>
          </div>

          <CandidateRegistrationForm initialJobSlug={initialJobSlug} />
        </Container>
      </section>

      {/* 6. CANDIDATE FAQS */}
      <Section bg="white">
        <Container narrow={true}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Candidate Questions
            </Eyebrow>
            <Heading level="h2" color="ink">
              Frequently asked questions
            </Heading>
          </div>

          <Accordion items={candidateFaqs} />
        </Container>
      </Section>

      {/* 7. CANDIDATE CTA BAND */}
      <CtaBand
        bg="purple"
        heading="Let's take the next step together."
        copy="Register your CV today to be considered for relevant healthcare opportunities as they arise."
        primaryButton={{
          label: "Register Your Interest",
          href: "#register",
          variant: "gold",
        }}
        secondaryButton={{
          label: "Explore Opportunities",
          href: "/opportunities",
          variant: "outline-light",
        }}
      />
    </div>
  );
}
