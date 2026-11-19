import React from "react";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { RevealProvider } from "@/components/layout/RevealProvider";

/**
 * The public header, main landmark and footer.
 */
export function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <RevealProvider>{children}</RevealProvider>
      </main>
      {footer}
    </div>
  );
}
