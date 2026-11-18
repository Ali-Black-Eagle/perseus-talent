import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/config/site";

export const metadata = {
  title: "Privacy Policy — Perseus Talent",
  description:
    "Perseus Talent Privacy Policy explaining how we process, store, and protect candidate CVs and employer enquiries under UK GDPR and the Data Protection Act 2018.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-white">
      <Container narrow={true}>
        <div className="mb-8">
          <Eyebrow theme="light" withLine={true} className="mb-2">
            Legal & Compliance
          </Eyebrow>
          <Heading level="h1" color="ink" className="mb-4">
            Privacy Policy
          </Heading>
          <p className="text-xs text-[#625A6B]">
            Last updated: November 2026 · UK GDPR & Data Protection Act 2018
          </p>
        </div>

        {/* Mandatory Legal Review Banner */}
        <div className="mb-10 p-4 bg-[#FEF3F2] border border-[#B42318] rounded-[2px] text-xs text-[#B42318]">
          <strong>DRAFT DOCUMENT:</strong> This document is a draft prepared for
          initial operational review and requires formal legal sign-off before
          public deployment.
        </div>

        <div className="space-y-8 text-sm md:text-base text-[#3A3242] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              1. Who We Are
            </h2>
            <p className="mb-4">
              Perseus Talent is a UK recruitment consultancy specialising in
              healthcare staffing and talent acquisition (&ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We operate the website at{" "}
              <Link href="/" className="text-[#1C052E] font-medium underline">
                {site.urlDisplay}
              </Link>
              .
            </p>
            <Placeholder
              label="Legal Entity & ICO Registration Reference"
              description="Confirmed registered company name, company number, registered address, and Information Commissioner's Office (ICO) data controller registration number to be supplied."
            />
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              2. What Personal Data We Collect
            </h2>
            <p className="mb-3">
              Depending on whether you engage with us as a prospective candidate,
              client organisation, or general enquirer, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#625A6B]">
              <li>
                <strong>Identity and Contact Data:</strong> Full name, business or
                personal email address, telephone number, and geographical location.
              </li>
              <li>
                <strong>Candidate Career Data:</strong> Curricula Vitae (CVs),
                employment history, professional qualifications, clinical
                specialisms, and current job titles.
              </li>
              <li>
                <strong>Employer Recruitment Data:</strong> Company name, hiring
                briefs, role specifications, and expected salary parameters.
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type, and
                anti-spam challenge tokens used to protect our forms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              3. Lawful Bases for Processing
            </h2>
            <p>
              We process personal data in compliance with Article 6 of the UK
              GDPR under the following lawful bases:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-[#625A6B]">
              <li>
                <strong>Consent:</strong> When a candidate registers their CV and
                consents to being considered for relevant opportunities.
              </li>
              <li>
                <strong>Steps Prior to Entering a Contract:</strong> When an
                employer requests recruitment terms or candidate introductions.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> To communicate regarding
                submitted enquiries, safeguard site security, and prevent spam.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              4. Candidate Data and Sharing with Employers
            </h2>
            <p className="font-medium text-[#1C052E]">
              We will never submit your CV or personal details to a prospective
              employer without first discussing the specific vacancy with you and
              obtaining your explicit agreement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              5. CV Upload Transmission & Storage
            </h2>
            <p>
              CV files submitted through our online registration are validated for
              file integrity and transmitted securely. We do not store CVs in
              publicly accessible web directories. On development localhost, files
              are captured in private local storage; in production, submissions are
              routed via encrypted email delivery.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              6. Data Retention Schedule
            </h2>
            <Placeholder
              label="Data Retention Periods"
              description="Specific data retention periods (e.g. reviewing candidate profiles every 12 to 24 months before requesting consent renewal) to be formally confirmed."
            />
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              7. Your Legal Rights
            </h2>
            <p className="mb-2">
              Under UK data protection legislation, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#625A6B]">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request rectification of inaccurate or incomplete data.</li>
              <li>Request erasure of your personal data (&ldquo;right to be forgotten&rdquo;).</li>
              <li>Object to or restrict the processing of your data.</li>
              <li>Withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us by email at{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-[#1C052E] font-medium underline hover:text-[#7A5A20]"
              >
                {site.email}
              </a>
              . You also have the right to lodge a complaint with the UK
              Information Commissioner&apos;s Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#7A5A20]"
              >
                ico.org.uk
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
