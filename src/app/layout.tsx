import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { site } from "@/config/site";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#1C052E",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Perseus Talent | UK Healthcare Recruitment Consultancy",
    template: "%s | Perseus Talent",
  },
  description: site.positioning,
  robots: allowIndexing
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
      },
  openGraph: {
    title: "Perseus Talent | UK Healthcare Recruitment Consultancy",
    description: site.statement,
    url: siteUrl,
    siteName: site.name,
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans text-[#3A3242] bg-white antialiased selection:bg-[#C5A15B] selection:text-[#1C052E]">
        <SkipLink />
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
