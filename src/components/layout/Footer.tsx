import React from "react";
import Link from "next/link";
import { Phone, Mail, Globe } from "lucide-react";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1C052E] text-white pt-16 pb-8 md:pt-24 md:pb-10 overflow-hidden border-t border-[#C5A15B]/20">
      {/* Constellation watermark bottom-right */}
      <div className="hidden lg:block absolute -right-20 -bottom-20 w-[420px] h-[420px] pointer-events-none opacity-[0.06]">
        <ConstellationGraphic opacity={1} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 md:px-8 xl:px-12">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16">
          {/* Column 1: Brand & Statement (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Logo variant="full" color="light" />
            <p className="font-serif italic text-xl md:text-[22px] text-white/85 leading-snug mt-6 max-w-[28ch]">
              &ldquo;{site.statement}&rdquo;
            </p>
            <p className="font-sans text-xs text-white/60 mt-4 leading-relaxed max-w-[32ch]">
              {site.positioning}
            </p>
          </div>

          {/* Column 2: Navigation Links (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A15B] mb-5">
              Navigate
            </h3>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-[15px] text-white/75 hover:text-white hover:underline hover:decoration-[#C5A15B] underline-offset-4 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={site.navCta.href}
                  className="font-sans text-[15px] text-[#C5A15B] hover:text-[#D4B577] hover:underline underline-offset-4 transition-colors font-medium"
                >
                  {site.navCta.label}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A15B] mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {site.footerServices.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="font-sans text-[15px] text-white/75 hover:text-white hover:underline hover:decoration-[#C5A15B] underline-offset-4 transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Details (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#C5A15B] mb-5">
              Contact
            </h3>
            <div className="space-y-2">
              <a
                href={site.phoneHref}
                className="flex items-center gap-3.5 min-h-[48px] py-2 text-white/80 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A15B] rounded-[2px]"
              >
                <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C5A15B]/50 transition-colors">
                  <Phone className="w-4 h-4 text-[#C5A15B]" strokeWidth={1.5} />
                </div>
                <span className="font-sans text-base">{site.phoneDisplay}</span>
              </a>

              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3.5 min-h-[48px] py-2 text-white/80 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A15B] rounded-[2px]"
              >
                <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C5A15B]/50 transition-colors">
                  <Mail className="w-4 h-4 text-[#C5A15B]" strokeWidth={1.5} />
                </div>
                <span className="font-sans text-base break-all">{site.email}</span>
              </a>

              <a
                href={site.url}
                className="flex items-center gap-3.5 min-h-[48px] py-2 text-white/80 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A15B] rounded-[2px]"
              >
                <div className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#C5A15B]/50 transition-colors">
                  <Globe className="w-4 h-4 text-[#C5A15B]" strokeWidth={1.5} />
                </div>
                <span className="font-sans text-base">{site.urlDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-white/60">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
            {site.legal.map((item, idx) => (
              <React.Fragment key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
                {idx < site.legal.length - 1 && (
                  <span className="text-[#C5A15B]" aria-hidden="true">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div>
            &copy; {currentYear} Perseus Talent. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
