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
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');`,
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
