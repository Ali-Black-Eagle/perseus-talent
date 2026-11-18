import React from "react";
import Link from "next/link";
import { Phone, Mail, Globe } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { ContactTabs } from "@/components/contact/ContactTabs";
import { site } from "@/config/site";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Perseus Talent. Telephone 07555004374 or email Perseustalent@gmail.com. We welcome conversations with employers and professionals across the UK.",
};

export default function ContactPage() {
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
                Contact
              </li>
            </ol>
          </nav>

          <div className="max-w-[760px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Get in Touch
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Let&apos;s start a conversation.
            </Heading>

            <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[50ch]">
              Whether you&apos;re looking to strengthen your team, explore your
              next career opportunity or simply learn more about Perseus Talent,
              we&apos;d be pleased to hear from you.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. OFFICIAL CONTACT DETAILS STRIP */}
      <Section bg="white" className="border-b border-[#E6E0EB]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <a
              href={site.phoneHref}
              className="group p-8 rounded-[4px] border border-[#E6E0EB] bg-[#FBF9F6] hover:border-[#C5A15B] hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.15)] transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-[2px] bg-[#1C052E] text-[#C5A15B] flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#7A5A20] mb-1">
                Telephone
              </span>
              <span className="font-serif text-2xl font-medium text-[#1C052E] group-hover:text-[#7A5A20] transition-colors">
                {site.phoneDisplay}
              </span>
              <span className="text-xs text-[#625A6B] mt-2">
                Direct phone & WhatsApp enquiries
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${site.email}`}
              className="group p-8 rounded-[4px] border border-[#E6E0EB] bg-[#FBF9F6] hover:border-[#C5A15B] hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.15)] transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-[2px] bg-[#1C052E] text-[#C5A15B] flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#7A5A20] mb-1">
                Email Address
              </span>
              <span className="font-sans text-lg md:text-xl font-medium text-[#1C052E] break-all group-hover:text-[#7A5A20] transition-colors">
                {site.email}
              </span>
              <span className="text-xs text-[#625A6B] mt-2">
                Official enquiries & general correspondence
              </span>
            </a>

            {/* Website */}
            <a
              href={site.url}
              className="group p-8 rounded-[4px] border border-[#E6E0EB] bg-[#FBF9F6] hover:border-[#C5A15B] hover:shadow-[0_10px_30px_-12px_rgba(28,5,46,0.15)] transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-[2px] bg-[#1C052E] text-[#C5A15B] flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#7A5A20] mb-1">
                Website
              </span>
              <span className="font-serif text-2xl font-medium text-[#1C052E] group-hover:text-[#7A5A20] transition-colors">
                {site.urlDisplay}
              </span>
              <span className="text-xs text-[#625A6B] mt-2">
                Online portal & fee calculator
              </span>
            </a>
          </div>
        </Container>
      </Section>

      {/* 3. THREE ENQUIRY PATHWAYS (FE14 TAB SET) */}
      <Section bg="ivory" className="border-b border-[#E6E0EB]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
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
