import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms and Conditions",
  description:
    "Website terms and conditions governing the use of Perseus Talent's website, fee calculator, and recruitment enquiry services.",
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Terms and Conditions", url: "/terms" },
  ]);

  return (
    <div className="py-12 bg-white">
      <JsonLd data={breadcrumbs} />
      <Container narrow={true}>
        <div className="mb-8">
          <Eyebrow theme="light" withLine={true} className="mb-2">
            Legal & Compliance
          </Eyebrow>
          <Heading level="h1" color="ink" className="mb-4">
            Terms and Conditions
          </Heading>
          <p className="text-xs text-[#625A6B]">
            Last updated: November 2026 · Website Terms of Use
          </p>
        </div>

        <div className="mb-10 p-4 bg-[#FEF3F2] border border-[#B42318] rounded-[2px] text-xs text-[#B42318]">
          <strong>DRAFT DOCUMENT:</strong> This document represents website terms
          of use and requires professional legal review before publication.
        </div>

        <div className="space-y-8 text-sm md:text-base text-[#3A3242] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website ({site.urlDisplay}), you agree
              to be bound by these Terms and Conditions and our Privacy Policy.
              If you do not agree, please discontinue using this website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
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
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              3. Fee Calculator & Estimates
            </h2>
            <p className="p-4 bg-[#FBF9F6] border border-[#E6E0EB] rounded-[2px] text-xs md:text-sm text-[#625A6B]">
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
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              4. Employer Terms of Business
            </h2>
            <Placeholder
              label="Employer Terms of Business (Separate Document)"
              description="Specific contractual terms regarding candidate introduction fees, candidate rebate/replacement periods, and invoice settlement timelines are governed by separate Perseus Talent Employer Terms of Business provided prior to candidate introduction."
            />
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              5. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, logos, graphics, icons,
              and design system elements, is the intellectual property of Perseus
              Talent and protected by copyright and intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
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
    </div>
  );
}
