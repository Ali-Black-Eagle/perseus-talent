import React from "react";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";

interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  variant?: "default" | "compact";
  children?: React.ReactNode;
  className?: string;
}

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  variant = "default",
  children,
  className = "",
}: PageHeroProps) {
  const isCompact = variant === "compact";
  const paddingClasses = isCompact
    ? "pt-12 pb-12"
    : "pt-16 pb-16 lg:pt-28 lg:pb-24";

  return (
    <section
      className={`relative overflow-hidden bg-purple-900 text-white flex items-center ${paddingClasses} ${className}`}
    >
      {/* Subtle geometric pattern overlay */}
      <GeometricPattern opacity={0.04} />

      {/* Constellation fragment on >=1024px: ~220px, 35% opacity */}
      {!isCompact && (
        <div className="hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 w-[220px] h-[220px] pointer-events-none opacity-35">
          <ConstellationGraphic opacity={1} />
        </div>
      )}

      <Container className="relative z-10 w-full">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} />
        )}

        <div className="max-w-[800px]">
          {eyebrow && (
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              {eyebrow}
            </Eyebrow>
          )}

          <Heading
            level="h1"
            color="white"
            className="mb-6 max-w-[18ch]"
          >
            {title}
          </Heading>

          {lead && (
            <div className="text-base md:text-lg text-white/80 font-sans leading-relaxed max-w-[60ch] space-y-4">
              {typeof lead === "string" ? <p>{lead}</p> : lead}
            </div>
          )}

          {children && <div className="mt-6">{children}</div>}
        </div>
      </Container>

      {/* Bottom hairline at container width, gold, 30% opacity */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none">
        <Container>
          <div className="border-b border-gold-500/30 w-full" />
        </Container>
      </div>
    </section>
  );
}
