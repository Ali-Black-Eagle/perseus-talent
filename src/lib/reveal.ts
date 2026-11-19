"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Add js class to html for progressive enhancement
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
        threshold: 0.02,
        rootMargin: "0px 0px 50px 0px",
      }
    );

    // Immediately reveal hash target if page loaded with or navigated to a hash
    const revealHashTarget = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        try {
          const target = document.querySelector(window.location.hash);
          if (target) {
            target.classList.add("is-revealed");
            target.querySelectorAll("[data-reveal]").forEach((el) => {
              el.classList.add("is-revealed");
            });
          }
        } catch {
          // Ignore invalid selector
        }
      }
    };

    revealHashTarget();
    window.addEventListener("hashchange", revealHashTarget);

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
      window.removeEventListener("hashchange", revealHashTarget);
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [pathname]);
}
