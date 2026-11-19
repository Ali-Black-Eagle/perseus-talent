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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Mirror the server-side switch to the browser so the owner only has to set TURNSTILE_ENABLED.
  env: {
    NEXT_PUBLIC_TURNSTILE_ENABLED: turnstileEnabled ? "true" : "false",
  },
  poweredByHeader: false,
  // Test builds (npm run verify) use their own folder so they never clash with a running `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    // Job listings were removed from the site; send old links to the candidate registration page.
    return [
      { source: "/opportunities", destination: "/candidates", permanent: true },
      { source: "/opportunities/:slug*", destination: "/candidates", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: publicHeaders }];
  },
};

export default nextConfig;
