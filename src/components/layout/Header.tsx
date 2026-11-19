"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Calculator } from "lucide-react";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { GeometricPattern } from "@/components/brand/GeometricPattern";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Monitor scroll for subtle shadow & border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll, manage focus trap and inert background when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Mark background main and footer as inert
      const mainEl = document.getElementById("main-content");
      const footerEl = document.querySelector("footer");
      mainEl?.setAttribute("inert", "");
      footerEl?.setAttribute("inert", "");

      // Move focus to first navigation link
      const focusTimer = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          toggleRef.current?.focus();
          return;
        }

        // Focus trap inside drawer
        if (e.key === "Tab" && menuRef.current) {
          const focusable = menuRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = "";
        mainEl?.removeAttribute("inert");
        footerEl?.removeAttribute("inert");
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Active link matching
  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/candidates" && pathname.startsWith("/opportunities")) return true;
    if (href === "/specialisms" && pathname.startsWith("/specialisms")) return true;
    if (href === "/insights" && pathname.startsWith("/insights")) return true;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-[50] w-full bg-[#1C052E] transition-all duration-200 ${
        isScrolled
          ? "border-b border-white/10 shadow-[0_10px_30px_-12px_rgba(28,5,46,0.35)]"
          : "border-b border-white/5"
      }`}
      style={{ height: "var(--header-h, 72px)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-5 md:px-8 xl:px-12">
        {/* Brand Logo */}
        <Logo variant="full" color="light" />

        {/* Desktop Navigation (>= 1280px) */}
        <nav
          className="hidden xl:flex items-center gap-8 2xl:gap-10"
          aria-label="Main Navigation"
        >
          {site.nav.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-[15px] font-sans font-medium transition-colors duration-200 group ${
                  active ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {/* Gold underline growing from left on hover, permanent when active */}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-[#C5A15B] transition-transform duration-250 ease-out origin-left ${
                    active
                      ? "w-full scale-x-100"
                      : "w-full scale-x-0 group-hover:scale-x-100"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}

          {/* Calculate Your Fee button */}
          <Link
            href={site.navCta.href}
            className="ml-4 inline-flex h-11 items-center justify-center border border-[#C5A15B] px-5 rounded-[2px] font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-[#C5A15B] hover:bg-[#C5A15B] hover:text-[#1C052E] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C052E] whitespace-nowrap"
          >
            {site.navCta.label}
          </Link>
        </nav>

        {/* Mobile & Tablet controls (< 1280px) */}
        <div className="flex items-center gap-3 xl:hidden">
          {/* Quick calculator icon button on tablet */}
          <Link
            href="/fee-calculator"
            className="hidden sm:inline-flex items-center justify-center h-10 w-10 border border-[#C5A15B]/60 text-[#C5A15B] rounded-[2px] hover:bg-[#C5A15B] hover:text-[#1C052E] transition-colors"
            aria-label="Open Fee Calculator"
          >
            <Calculator className="w-5 h-5" strokeWidth={1.5} />
          </Link>

          {/* Hamburger toggle button */}
          <button
            ref={toggleRef}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            className="flex h-12 w-12 items-center justify-center rounded-[2px] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A15B]"
          >
            <div className="relative flex h-5 w-6 flex-col justify-between">
              <span
                className={`block h-[1.5px] w-6 bg-white transition-all duration-250 ${
                  isOpen ? "translate-y-[9px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-white transition-opacity duration-200 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-white transition-all duration-250 ${
                  isOpen ? "-translate-y-[9px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel (FE4 / Item 8) */}
      {isOpen && (
        <div
          id="mobile-nav"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-x-0 bottom-0 z-[60] flex flex-col justify-between bg-[#1C052E] overflow-y-auto px-5 py-8 md:px-8 border-t border-white/10 xl:hidden mobile-drawer-animate"
          style={{ top: "var(--header-h, 72px)" }}
        >
          <GeometricPattern opacity={0.04} />

          <div className="relative z-10 flex flex-col">
            <nav className="flex flex-col divide-y divide-white/10" aria-label="Mobile Navigation">
              {site.nav.map((item, index) => {
                const active = isLinkActive(item.href);
                const numeral = String(index + 1).padStart(2, "0");
                return (
                  <Link
                    key={item.href}
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-center gap-4 py-4 text-white hover:text-[#C5A15B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A15B]"
                  >
                    <span className="font-sans text-xs text-[#C5A15B]/70 font-semibold tracking-wider">
                      {numeral}
                    </span>
                    <span
                      className={`font-serif text-2xl md:text-3xl font-medium ${
                        active ? "text-[#C5A15B]" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Prominent CTA */}
            <div className="mt-8 pt-4">
              <Link
                href={site.navCta.href}
                onClick={() => setIsOpen(false)}
                className="flex h-14 w-full items-center justify-center bg-[#C5A15B] text-[#1C052E] font-sans text-sm font-semibold uppercase tracking-[0.12em] rounded-[2px] shadow-md hover:bg-[#D4B577] transition-colors"
              >
                {site.navCta.label}
              </Link>
            </div>
          </div>

          {/* Contact Direct Links at bottom of drawer */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 space-y-3">
            <a
              href={site.phoneHref}
              className="flex items-center gap-3 text-white/80 hover:text-white py-2 text-sm font-medium"
            >
              <Phone className="h-4 w-4 text-[#C5A15B]" strokeWidth={1.5} />
              <span>{site.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 text-white/80 hover:text-white py-2 text-sm font-medium"
            >
              <Mail className="h-4 w-4 text-[#C5A15B]" strokeWidth={1.5} />
              <span>{site.email}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
