import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const isLocalhost =
  !siteUrl || siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");

const isDev = process.env.NODE_ENV !== "production";
const turnstileEnabled = process.env.TURNSTILE_ENABLED === "true";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  ...(turnstileEnabled ? ["https://challenges.cloudflare.com"] : []),
].join(" ");

const connectSrc = [
  "'self'",
  ...(turnstileEnabled ? ["https://challenges.cloudflare.com"] : []),
].join(" ");

const frameSrc = [
  "'self'",
  ...(turnstileEnabled ? ["https://challenges.cloudflare.com"] : []),
].join(" ");

const cspDirectives = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src ${connectSrc}`,
  `frame-src ${frameSrc}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

// The admin panel (/keystatic and /api/keystatic) needs GitHub's API, avatars and its own inline styles.
// This looser policy is attached ONLY to those two routes; the public site keeps the strict one above.
const adminCspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Keystatic's interface loads its font (Inter) from Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://*.githubusercontent.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://api.github.com https://github.com https://raw.githubusercontent.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://github.com",
];

const commonHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  ...(!isLocalhost
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const publicHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
  ...commonHeaders,
];

const adminHeaders = [
  { key: "Content-Security-Policy", value: adminCspDirectives.join("; ") },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ...commonHeaders,
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Mirror the server-side switch to the browser so the owner only has to set TURNSTILE_ENABLED.
  env: {
    NEXT_PUBLIC_TURNSTILE_ENABLED: turnstileEnabled ? "true" : "false",
    // Same idea for the admin panel: the owner sets KEYSTATIC_STORAGE / KEYSTATIC_GITHUB_REPO, and the browser
    // copy (read by keystatic.config.ts) follows.
    NEXT_PUBLIC_KEYSTATIC_STORAGE: process.env.KEYSTATIC_STORAGE === "github" ? "github" : "local",
    NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO: process.env.KEYSTATIC_GITHUB_REPO || "",
  },
  // The candidate API route reads content/jobs at runtime; make sure Netlify bundles those files.
  outputFileTracingIncludes: {
    "/api/enquiries/candidate": ["./content/jobs/**/*"],
    // These pages read content files at request time, so Netlify must bundle them too.
    "/opportunities": ["./content/**/*"],
    "/opportunities/[slug]": ["./content/**/*"],
  },
  poweredByHeader: false,
  // Test builds (npm run verify) use their own folder so they never clash with a running `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [
      {
        // Every route EXCEPT the admin panel and its API (they get their own policy below).
        source: "/((?!keystatic(?:/|$)|api/keystatic(?:/|$)).*)",
        headers: publicHeaders,
      },
      { source: "/keystatic/:path*", headers: adminHeaders },
      { source: "/api/keystatic/:path*", headers: adminHeaders },
    ];
  },
};

export default nextConfig;
