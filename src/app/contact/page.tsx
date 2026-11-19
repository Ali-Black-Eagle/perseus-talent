import React from "react";
import Link from "next/link";
import { Phone, Mail, Globe } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/layout/PageHero";
import { ContactTabs } from "@/components/contact/ContactTabs";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.contact);

export default function ContactPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        eyebrow="Get in Touch"
        title="Let's start a conversation."
        lead="Whether you're looking to strengthen your team, explore your next career opportunity or simply learn more about Perseus Talent, we'd be pleased to hear from you."
      />

      {/* 2. OFFICIAL CONTACT DETAILS STRIP (Asymmetric Split per Item 12) */}
      <Section bg="white" className="border-b border-line">
        <Container>
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
            <div className="lg:col-span-6">
              <Eyebrow theme="light" withLine={true} className="mb-3">
                Direct Channels
              </Eyebrow>
              <Heading level="h2" color="ink">
                Official communication channels
              </Heading>
            </div>
            <div className="lg:col-span-6">
              <p className="font-sans text-base md:text-lg text-muted leading-relaxed">
                Connect directly with our consultancy team via telephone, email or explore
                our digital resources and fee calculator online.
              </p>
            </div>
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <a
              href={site.phoneHref}
              className="group p-8 rounded-[4px] border border-line bg-ivory hover:border-gold-500 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.15)] transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-[2px] bg-purple-900 text-gold-500 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gold-text mb-1">
                Telephone
              </span>
              <span className="font-serif text-2xl font-medium text-purple-900 group-hover:text-gold-text transition-colors">
                {site.phoneDisplay}
              </span>
              <span className="text-xs text-muted mt-2">
                Direct telephone enquiries
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${site.email}`}
              className="group p-8 rounded-[4px] border border-line bg-ivory hover:border-gold-500 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.15)] transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-[2px] bg-purple-900 text-gold-500 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gold-text mb-1">
                Email Address
              </span>
              <span className="font-sans text-lg md:text-xl font-medium text-purple-900 break-all group-hover:text-gold-text transition-colors">
                {site.email}
              </span>
              <span className="text-xs text-muted mt-2">
                Official enquiries & general correspondence
              </span>
            </a>

            {/* Website */}
            <a
              href={site.url}
              className="group p-8 rounded-[4px] border border-line bg-ivory hover:border-gold-500 hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.15)] transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-[2px] bg-purple-900 text-gold-500 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gold-text mb-1">
                Website
              </span>
              <span className="font-serif text-2xl font-medium text-purple-900 group-hover:text-gold-text transition-colors">
                {site.urlDisplay}
              </span>
              <span className="text-xs text-muted mt-2">
                Recruitment fee calculator & resources
              </span>
            </a>
          </div>
        </Container>
      </Section>

      {/* 3. THREE ENQUIRY PATHWAYS (FE14 TAB SET) */}
      <Section bg="purple-50" className="border-b border-line">
        <Container>
          <div data-reveal className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow theme="light" withLine={true} className="mb-3">
              How May We Help?
            </Eyebrow>
            <Heading level="h2" color="ink">
              Choose your enquiry pathway
            </Heading>
          </div>

          <ContactTabs />
        </Container>
      </Section>
    </div>
  );
}
