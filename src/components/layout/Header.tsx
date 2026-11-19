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
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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

  // Manage mount & 200ms close animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMounted]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close the drawer if the window is widened to the desktop menu (>= 1024px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
    if (href === "/specialisms" && pathname.startsWith("/specialisms")) return true;
    if (href === "/insights" && pathname.startsWith("/insights")) return true;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-[50] w-full bg-purple-900 transition-all duration-200 ${
        isScrolled
          ? "border-b border-white/10 shadow-[0_10px_30px_-12px_rgba(28,5,46,0.35)]"
          : "border-b border-white/5"
      }`}
      style={{ height: "var(--header-h, 72px)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-5 md:px-8 xl:px-12">
        {/* Brand Logo */}
        <Logo variant="lockup" size="header" />

        {/* Desktop Navigation (>= 1024px, plan FE4) */}
        <nav
          className="hidden lg:flex items-center gap-5 xl:gap-6"
          aria-label="Main Navigation"
        >
          {site.nav.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-[14px] xl:text-[15px] whitespace-nowrap font-sans font-medium transition-colors duration-200 group ${
                  active ? "text-white" : "text-white/80 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {/* 1px hover underline 6px below text; 2px active underline permanently */}
                <span
                  className={`absolute left-0 bottom-[-6px] bg-gold-500 transition-transform duration-250 ease-out origin-left ${
                    active
                      ? "h-[2px] w-full scale-x-100"
                      : "h-[1px] w-full scale-x-0 group-hover:scale-x-100"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}

          {/* Calculate Your Fee: compact calculator icon button 1024–1279px (high display scaling), full text from 1280px */}
          <Link
            href={site.navCta.href}
            aria-label={site.navCta.label}
            title={site.navCta.label}
            className="ml-1 xl:ml-4 inline-flex h-11 w-11 xl:w-auto items-center justify-center gap-2 border border-gold-500 xl:px-5 rounded-[2px] font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-500 hover:bg-gold-500 hover:text-purple-900 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900 whitespace-nowrap"
          >
            <Calculator className="h-5 w-5 xl:hidden" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden xl:inline">{site.navCta.label}</span>
          </Link>
        </nav>

        {/* Mobile & Tablet controls (< 1024px) */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Quick calculator icon button on tablet (44x44px per Item 21) */}
          <Link
            href="/fee-calculator"
            className="hidden sm:inline-flex items-center justify-center h-11 w-11 border border-gold-500/60 text-gold-500 rounded-[2px] hover:bg-gold-500 hover:text-purple-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
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
            className="flex h-12 w-12 items-center justify-center rounded-[2px] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
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

      {/* Mobile Drawer Panel (FE4 / Item 21) */}
      {isMounted && (
        <div
          id="mobile-nav"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`fixed inset-x-0 bottom-0 z-[60] flex flex-col justify-between bg-purple-900 overflow-y-auto px-5 py-8 md:px-8 border-t border-white/10 lg:hidden ${
            isClosing ? "mobile-drawer-out" : "mobile-drawer-animate"
          }`}
          style={{ top: "var(--header-h, 72px)" }}
        >
          <GeometricPattern opacity={0.04} />

          <div className="relative z-10 flex flex-col">
            <nav
              className="flex flex-col divide-y divide-white/10"
              aria-label="Mobile Navigation"
            >
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
                    style={{ animationDelay: `${index * 30}ms` }}
                    className="mobile-nav-item flex items-center gap-4 py-4 text-white hover:text-gold-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    <span className="font-sans text-xs text-gold-500 font-semibold tracking-wider">
                      {numeral}
                    </span>
                    <span
                      className={`font-serif text-[30px] font-medium leading-none ${
                        active ? "text-gold-500" : "text-white"
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
                className="flex h-14 w-full items-center justify-center bg-gold-500 text-purple-900 font-sans text-sm font-semibold uppercase tracking-[0.12em] rounded-[2px] shadow-md hover:bg-gold-400 transition-colors"
              >
                {site.navCta.label}
              </Link>
            </div>
          </div>

          {/* Contact Direct Links at bottom of drawer: 48px tall and tappable */}
          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 space-y-2">
            <a
              href={site.phoneHref}
              className="min-h-[48px] flex items-center gap-3.5 text-white/80 hover:text-white py-2 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            >
              <Phone className="h-4 w-4 text-gold-500 shrink-0" strokeWidth={1.5} />
              <span>{site.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="min-h-[48px] flex items-center gap-3.5 text-white/80 hover:text-white py-2 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            >
              <Mail className="h-4 w-4 text-gold-500 shrink-0" strokeWidth={1.5} />
              <span>{site.email}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
