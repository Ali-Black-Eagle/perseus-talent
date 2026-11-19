"use client";

import React, { useEffect, useRef } from "react";

/**
 * True when the Turnstile challenge is switched on (TURNSTILE_ENABLED=true, mirrored to the browser
 * by next.config.ts) and a public site key is configured.
 */
export const isTurnstileActive =
  process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "true" &&
  Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  /** Increment to request a fresh challenge (tokens are single-use, so reset after a failed submit). */
  resetKey?: number;
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ onToken, resetKey = 0, className = "" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isEnabled = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "true" && Boolean(siteKey);

  useEffect(() => {
    if (!isEnabled || !siteKey || !containerRef.current) return;

    // Load Turnstile script if not already present
    const existingScript = document.getElementById("cf-turnstile-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        clearInterval(interval);
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onToken(token);
            },
            "expired-callback": () => {
              onToken("");
            },
            "error-callback": () => {
              onToken("");
            },
          });
        } catch (e) {
          console.warn("Turnstile render warning:", e);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [isEnabled, siteKey, onToken]);

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // ignore
      }
    }
  }, [resetKey]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`my-4 ${className}`}>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
}
