import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.terms);

export default function TermsPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Terms and Conditions", url: "/terms" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      <PageHero
        variant="compact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms and Conditions" },
        ]}
        eyebrow="Legal & Compliance"
        title="Terms and Conditions"
        lead="Last updated: November 2026 · Website Terms of Use"
      />

      <Section bg="white">
        <Container narrow={true}>
          <div className="mb-10 p-4 bg-purple-50 border border-gold-500/30 rounded-[2px] text-xs text-purple-900 leading-relaxed">
            <strong>TERMS NOTICE:</strong> These terms govern the use of the Perseus Talent website and digital fee calculation tools. Client recruitment agreements and candidate representations are governed by separate written terms of business.
          </div>

        <div className="space-y-8 text-sm md:text-base text-body leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website ({site.urlDisplay}), you agree
              to be bound by these Terms and Conditions and our Privacy Policy.
              If you do not agree, please discontinue using this website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              2. Nature of Recruitment Services
            </h2>
            <p>
              Perseus Talent acts as an employment agency and employment
              business in the United Kingdom. Submitting a candidate
              registration, enquiry, or CV through this website does not
              guarantee employment, an interview, or placement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              3. Fee Calculator & Estimates
            </h2>
            <p className="p-4 bg-ivory border border-line rounded-[2px] text-xs md:text-sm text-muted">
              <strong>Indicative Estimates Only:</strong> All calculations
              provided by The Perseus Fee Calculator are indicative illustrations
              based on a flat 15% rate applied to annual gross base salary.
              Calculations do not constitute a formal commercial quote, offer, or
              binding agreement. Formal recruitment fees, payment terms, and
              conditions are set out exclusively in written recruitment
              contracts entered into directly between Perseus Talent and client
              organisations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              4. Employer Terms of Business
            </h2>
            <div className="bg-ivory border border-line rounded-[2px] p-4 text-xs font-sans text-muted leading-relaxed">
              <span className="font-semibold text-purple-900 block mb-1">
                Employer Terms of Business (Commercial Agreements)
              </span>
              Specific contractual terms regarding candidate introduction fees, candidate replacement guarantees, and invoice settlement timelines are governed by separate Perseus Talent Employer Terms of Business provided and agreed prior to candidate introduction.
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              5. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, logos, graphics, icons,
              and design system elements, is the intellectual property of Perseus
              Talent and protected by copyright and intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              6. Governing Law
            </h2>
            <p>
              These Terms and Conditions are governed by and construed in
              accordance with the laws of England and Wales. Any disputes arising
              in connection with this website shall be subject to the exclusive
              jurisdiction of the courts of England and Wales.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  </div>
);
}
