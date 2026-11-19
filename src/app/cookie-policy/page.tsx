import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Cookie Policy",
  description:
    "Perseus Talent Cookie Policy explaining our minimal, privacy-first use of necessary technologies and cookies.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Cookie Policy", url: "/cookie-policy" },
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
            Cookie Policy
          </Heading>
          <p className="text-xs text-[#625A6B]">
            Last updated: November 2026 · Privacy and Electronic Communications Regulations (PECR)
          </p>
        </div>

        <div className="mb-10 p-4 bg-[#FEF3F2] border border-[#B42318] rounded-[2px] text-xs text-[#B42318]">
          <strong>DRAFT DOCUMENT:</strong> This document requires legal sign-off
          prior to formal commercial launch.
        </div>

        <div className="space-y-8 text-sm md:text-base text-[#3A3242] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device by websites you
              visit. They are widely used to ensure websites function correctly
              and securely.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              2. How Perseus Talent Uses Cookies
            </h2>
            <p className="mb-3">
              We operate a privacy-first website. At launch, Perseus Talent uses{" "}
              <strong>only strictly necessary technical cookies</strong> and
              browser session tokens.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#625A6B]">
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
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
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
            <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding our use of cookies, please
              contact us at{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-[#1C052E] font-medium underline hover:text-[#7A5A20]"
              >
                {site.email}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
