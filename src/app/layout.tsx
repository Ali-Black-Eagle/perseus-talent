import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageSeo } from "@/config/page-seo";
import { createPageMetadata, getOrganizationJsonLd, getWebSiteJsonLd, getSiteUrl } from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = getSiteUrl();

const HEAD_BOOTSTRAP_SCRIPT = `document.documentElement.classList.add('js');(function(){function c(){var h=document.head,n=h.firstChild,x;while(n){x=n.nextSibling;if(n.nodeType===3&&!n.data.trim())h.removeChild(n);n=x}}c();document.addEventListener('DOMContentLoaded',c)})();`;

export const viewport: Viewport = {
  themeColor: "#1C052E",
  width: "device-width",
  initialScale: 1,
};

// Defaults for every route (including the 404 page). Pages replace these through createPageMetadata,
// which always keeps the share image, the Twitter card and the robots rule.
const defaults = createPageMetadata({ ...pageSeo.home, path: "/" });

export const metadata: Metadata = {
  ...defaults,
  metadataBase: new URL(siteUrl),
  title: {
    default: pageSeo.home.title,
    template: "%s | Perseus Talent",
  },
  // A page that does not set its own canonical must not claim to be the home page.
  alternates: undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = getOrganizationJsonLd();
  const websiteJsonLd = getWebSiteJsonLd();

  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable}`}
    >
      <head>
        {/*
          1. Marks the page as script-enabled (used by the reveal animations in globals.css).
          2. Removes whitespace-only text nodes from <head>. Netlify's edge injects "
<!-- ... -->" right
             after <meta charset>; the stray text node is not in React's tree, so hydrating <head> fails
             with React error #418. The script runs during parsing, before hydration, and only touches
             nodes that React never rendered (React emits no whitespace between head elements).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: HEAD_BOOTSTRAP_SCRIPT,
          }}
        />
        <JsonLd data={[orgJsonLd, websiteJsonLd]} />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans text-body bg-white antialiased selection:bg-gold-500 selection:text-purple-900"
      >
        <SiteChrome footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
