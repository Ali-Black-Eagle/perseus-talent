import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.privacyPolicy);

export default function PrivacyPolicyPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      <PageHero
        variant="compact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
        eyebrow="Legal & Compliance"
        title="Privacy Policy"
        lead="Last updated: November 2026 · UK GDPR & Data Protection Act 2018"
      />

      <Section bg="white">
        <Container narrow={true}>
          {/* Compliance Notice */}
          <div className="mb-10 p-4 bg-purple-50 border border-gold-500/30 rounded-[2px] text-xs text-purple-900 leading-relaxed">
            <strong>COMPLIANCE NOTICE:</strong> This privacy policy governs data collection and processing across Perseus Talent digital services in accordance with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.
          </div>

        <div className="space-y-8 text-sm md:text-base text-body leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              1. Who We Are
            </h2>
            <p className="mb-4">
              Perseus Talent is a UK recruitment consultancy specialising in
              healthcare staffing and talent acquisition (&ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We operate the website at{" "}
              <Link href="/" className="text-purple-900 font-medium underline">
                {site.urlDisplay}
              </Link>
              .
            </p>
            <div className="bg-ivory border border-line rounded-[2px] p-4 text-xs font-sans text-muted leading-relaxed">
              <span className="font-semibold text-purple-900 block mb-1">
                Data Controller Information
              </span>
              Perseus Talent acts as Data Controller for personal data processed through this website. Statutory company registration and ICO data protection registration references are available on written request to{" "}
              <a href={`mailto:${site.email}`} className="text-purple-900 font-medium underline">
                {site.email}
              </a>
              .
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              2. What Personal Data We Collect
            </h2>
            <p className="mb-3">
              Depending on whether you engage with us as a prospective candidate,
              client organisation, or general enquirer, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted">
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
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              3. Lawful Bases for Processing
            </h2>
            <p>
              We process personal data in compliance with Article 6 of the UK
              GDPR under the following lawful bases:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-muted">
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
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              4. Candidate Data and Sharing with Employers
            </h2>
            <p className="font-medium text-purple-900">
              We will never submit your CV or personal details to a prospective
              employer without first discussing the specific vacancy with you and
              obtaining your explicit agreement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
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
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              6. Data Retention Schedule
            </h2>
            <div className="bg-ivory border border-line rounded-[2px] p-4 text-xs font-sans text-muted leading-relaxed">
              <span className="font-semibold text-purple-900 block mb-1">
                Standard Retention Schedule
              </span>
              Candidate CVs and personal profiles are retained for an active period of up to 24 months, after which we will contact you to request consent renewal or securely delete your records in accordance with UK GDPR principles. Employer enquiries are retained for the duration of the recruitment relationship.
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              7. Your Legal Rights
            </h2>
            <p className="mb-2">
              Under UK data protection legislation, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted">
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
                className="text-purple-900 font-medium underline hover:text-gold-text"
              >
                {site.email}
              </a>
              . You also have the right to lodge a complaint with the UK
              Information Commissioner&apos;s Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gold-text"
              >
                ico.org.uk
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  </div>
);
}
