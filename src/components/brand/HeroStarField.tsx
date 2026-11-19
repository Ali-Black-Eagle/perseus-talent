"use client";

import React, { useEffect, useRef } from "react";
import { heroFieldStars } from "./perseusStarField";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

const CONSTELLATION_SHIFT = 8; // px, max
const FIELD_SHIFT = 3; // px, max
const LERP = 0.08;

/**
 * Hero-level decorative layer: seeded background star field plus a shooting star.
 * After mount only, it also pauses all hero star animations while the hero is off-screen and drives the gentle
 * mouse depth effect on fine pointers. Place inside the hero section; constellation wrappers opt in to the
 * depth effect with the data-hero-parallax attribute.
 */
export function HeroStarField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const field = fieldRef.current;
    const hero = root?.closest("section");
    if (!root || !field || !hero) return;

    const layers = Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-parallax]"));
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineMq = window.matchMedia("(pointer: fine)");

    let visible = true;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let willChangeOn = false;

    const setWillChange = (on: boolean) => {
      if (on === willChangeOn) return;
      willChangeOn = on;
      const v = on ? "transform" : "";
      field.style.willChange = v;
      layers.forEach((l) => (l.style.willChange = v));
    };

    const apply = () => {
      field.style.transform = `translate3d(${(-cx * FIELD_SHIFT).toFixed(2)}px, ${(-cy * FIELD_SHIFT).toFixed(2)}px, 0)`;
      const t = `translate3d(${(cx * CONSTELLATION_SHIFT).toFixed(2)}px, ${(cy * CONSTELLATION_SHIFT).toFixed(2)}px, 0)`;
      layers.forEach((l) => (l.style.transform = t));
    };

    const tick = () => {
      raf = 0;
      if (!visible) return;
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      if (Math.abs(tx - cx) < 0.001 && Math.abs(ty - cy) < 0.001) {
        cx = tx;
        cy = ty;
        apply();
        if (tx === 0 && ty === 0) setWillChange(false);
        return;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const enabled = () => fineMq.matches && !reduceMq.matches;

    const onMove = (e: MouseEvent) => {
      if (!enabled()) return;
      const r = hero.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      setWillChange(true);
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        visible = entry.isIntersecting;
        hero.classList.toggle("hero-paused", !visible);
        if (!visible) {
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        } else {
          kick();
        }
      },
      { threshold: 0 },
    );
    io.observe(hero);

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      io.disconnect();
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      hero.classList.remove("hero-paused");
      field.style.transform = "";
      layers.forEach((l) => (l.style.transform = ""));
      setWillChange(false);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      data-hero-star-field
    >
      <div ref={fieldRef} className="hs-field absolute -inset-3">
        {heroFieldStars.map((s, i) => (
          <span
            key={i}
            className={`hs-fstar${s.extra ? " max-md:hidden" : ""}`}
            data-field-star
            style={
              {
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: s.gold ? "#D4B577" : "#FFFFFF",
                "--hs-hi": s.hi,
                "--hs-lo": s.lo,
                "--hs-dur": `${s.dur}s`,
                "--hs-delay": `${s.delay}s`,
              } as Vars
            }
          />
        ))}
      </div>
      <div className="hs-shoot max-lg:hidden" data-shooting-star />
    </div>
  );
}
