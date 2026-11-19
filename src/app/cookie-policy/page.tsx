import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.cookiePolicy);

export default function CookiePolicyPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Cookie Policy", url: "/cookie-policy" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      <PageHero
        variant="compact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cookie Policy" },
        ]}
        eyebrow="Legal & Compliance"
        title="Cookie Policy"
        lead="Last updated: November 2026 · Privacy and Electronic Communications Regulations (PECR)"
      />

      <Section bg="white">
        <Container narrow={true}>
          <div className="mb-10 p-4 bg-purple-50 border border-gold-500/30 rounded-[2px] text-xs text-purple-900 leading-relaxed">
            <strong>PRIVACY-FIRST POLICY:</strong> Perseus Talent operates a privacy-first website. We only deploy strictly necessary technical cookies and security tokens required for site operation and anti-spam protection.
          </div>

        <div className="space-y-8 text-sm md:text-base text-body leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device by websites you
              visit. They are widely used to ensure websites function correctly
              and securely.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              2. How Perseus Talent Uses Cookies
            </h2>
            <p className="mb-3">
              We operate a privacy-first website. At launch, Perseus Talent uses{" "}
              <strong>only strictly necessary technical cookies</strong> and
              browser session tokens.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted">
              <li>
                <strong>Security & Anti-Spam:</strong> When anti-bot security
                (such as Cloudflare Turnstile) is active, cryptographic tokens
                are used to prevent malicious automated form spam.
              </li>
              <li>
                <strong>User Session Preferences:</strong> Basic state to
                maintain form step continuity during active browsing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              3. Analytics & Advertising
            </h2>
            <p>
              We do <strong>not</strong> use third-party tracking cookies,
              advertising pixels, or behavioral retargeting cookies. If website
              performance analytics are introduced in the future, we will
              implement an explicit, consent-gated banner requiring opt-in before
              any non-essential cookies are stored.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-purple-900 mb-3">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding our use of cookies, please
              contact us at{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-purple-900 font-medium underline hover:text-gold-text"
              >
                {site.email}
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
