"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { RevealProvider } from "@/components/layout/RevealProvider";

/** Paths that are NOT part of the public website (the Keystatic admin panel and its API). */
export function isAdminPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/keystatic" ||
    pathname.startsWith("/keystatic/") ||
    pathname === "/api/keystatic" ||
    pathname.startsWith("/api/keystatic/")
  );
}

/**
 * The public header, main landmark and footer. The admin panel renders on its own, without the public
 * header and footer.
 */
export function SiteChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();

  if (isAdminPath(pathname)) {
    return <>{children}</>;
  }

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
