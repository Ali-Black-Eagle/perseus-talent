import type { Metadata } from "next";

// The admin panel is private: keep it out of search engines, and give it no public header or footer.
export const metadata: Metadata = {
  title: { absolute: "Perseus Talent admin" },
  robots: { index: false, follow: false },
};

export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
