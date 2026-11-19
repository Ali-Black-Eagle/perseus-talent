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
import { EightPointStar } from "@/components/brand/EightPointStar";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd, getFaqPageJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.candidates);

const candidateFaqs: AccordionItem[] = [
  {
    id: "fee",
    question: "Do I have to pay to register?",
    answer:
      "No. We do not charge candidates for helping them find work.",
  },
  {
    id: "process",
    question: "What happens after I register?",
    answer:
      "We review your details and CV against the roles we are recruiting for. Where we have a role aligned with your experience and aspirations, a member of our team will be in touch. Registering does not guarantee an interview or placement.",
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
      "We accept PDF, DOC, and DOCX documents up to a maximum file size of 3MB.",
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
          className="text-purple-900 font-medium underline underline-offset-2 hover:text-gold-text"
        >
          {site.email}
        </a>
        . For full details, please consult our{" "}
        <Link
          href="/privacy-policy"
          className="text-purple-900 font-medium underline underline-offset-2 hover:text-gold-text"
        >
          Privacy Policy
        </Link>
        .
      </span>
    ),
  },
];

export default function CandidatesPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Candidates", url: "/candidates" },
  ]);

  const faqJsonLd = getFaqPageJsonLd([
    {
      question: "Do I have to pay to register?",
      answer:
        "No. We do not charge candidates for helping them find work.",
    },
    {
      question: "What happens after I register?",
      answer:
        "We review your details and CV against the roles we are recruiting for. Where we have a role aligned with your experience and aspirations, a member of our team will be in touch. Registering does not guarantee an interview or placement.",
    },
    {
      question: "Will you share my CV without asking me?",
      answer:
        "No. We will always discuss a specific role and organisation with you before your CV or personal information is submitted to any prospective employer.",
    },
    {
      question: "Which file types can I upload?",
      answer:
        "We accept PDF, DOC, and DOCX files up to 3MB in size. We verify the file format when uploading to maintain system integrity.",
    },
    {
      question: "What healthcare roles do you recruit for?",
      answer:
        "We focus on clinical, nursing, allied health and healthcare operational roles across the UK.",
    },
    {
      question: "How is my information used and can I ask for it to be deleted?",
      answer:
        "Your personal details and CV are processed solely to evaluate suitability for recruitment opportunities, stored securely, and never sold to third parties. You may request rectification, access, or permanent erasure of your data at any time by contacting our privacy officer at Perseustalent@gmail.com.",
    },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={[breadcrumbs, faqJsonLd]} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Candidates" },
        ]}
        eyebrow="Professional Representation"
        title="Your next opportunity starts here."
        lead={
          <>
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
          </>
        }
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="gold"
            size="lg"
            arrow={true}
            href="#register"
            className="w-full sm:w-auto text-center"
          >
            Register Your CV
          </Button>
        </div>
      </PageHero>

      {/* 2. WHY CONNECT WITH PERSEUS TALENT (Asymmetric Split per Item 12) */}
      <Section bg="white">
        <Container>
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-6">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Candidate Values
              </Eyebrow>
              <Heading level="h2" color="ink">
                Why connect with Perseus Talent?
              </Heading>
            </div>
            <div className="lg:col-span-6">
              <p className="font-sans text-base md:text-lg text-muted leading-relaxed">
                We believe career progression deserves personal representation,
                uncompromising confidentiality and honest consultation at every stage.
              </p>
            </div>
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-purple-50 text-gold-text flex items-center justify-center mb-4">
                <EightPointStar size={18} />
              </div>
              <h3 className="font-serif font-semibold text-xl text-purple-900 mb-3">
                Relationship-led
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                A personal, considered consultation. We invest time in
                understanding who you are, beyond a CV.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-purple-50 text-gold-text flex items-center justify-center mb-4">
                <EightPointStar size={18} />
              </div>
              <h3 className="font-serif font-semibold text-xl text-purple-900 mb-3">
                Focused on ambition
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                We evaluate opportunities against your long-term progression,
                work-life balance, and professional goals.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-purple-50 text-gold-text flex items-center justify-center mb-4">
                <EightPointStar size={18} />
              </div>
              <h3 className="font-serif font-semibold text-xl text-purple-900 mb-3">
                Honest communication
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Transparent feedback, realistic briefings, and prompt updates at
                every stage of the recruitment process.
              </p>
            </Card>

            <Card hoverable={true} className="p-8">
              <div className="w-10 h-10 rounded-[2px] bg-purple-50 text-gold-text flex items-center justify-center mb-4">
                <EightPointStar size={18} />
              </div>
              <h3 className="font-serif font-semibold text-xl text-purple-900 mb-3">
                Confidentiality
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                We will always discuss a specific role and organisation with you
                before your CV or personal details are submitted to any
                prospective employer, ensuring complete transparency and mutual agreement.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 3. OUR CANDIDATE APPROACH */}
      <Section bg="ivory" className="border-t border-b border-line">
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
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

      {/* 5. CANDIDATE REGISTRATION + CV FORM */}
      <section
        id="register"
        className="py-16 md:py-28 bg-purple-50 scroll-mt-24 border-t border-b border-line"
      >
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              Registration & CV Submission
            </Eyebrow>
            <Heading level="h2" color="ink">
              Register Your Profile
            </Heading>
          </div>

          <CandidateRegistrationForm />
        </Container>
      </section>

      {/* 6. CANDIDATE FAQS */}
      <Section bg="white">
        <Container narrow={true}>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
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
          label: "Register Your CV",
          href: "#register",
          variant: "gold",
        }}
      />
    </div>
  );
}
