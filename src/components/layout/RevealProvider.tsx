"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Progressive enhancement: add js class to root
    document.documentElement.classList.add("js");

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    // Apply staggered delays to children in [data-reveal-stagger] containers
    document.querySelectorAll("[data-reveal-stagger]").forEach((container) => {
      const staggerChildren = container.querySelectorAll("[data-reveal]");
      staggerChildren.forEach((child, index) => {
        (child as HTMLElement).style.transitionDelay = `${index * 80}ms`;
      });
    });

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [pathname]);

  return <>{children}</>;
}
