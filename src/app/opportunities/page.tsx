import React, { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EightPointStar } from "@/components/brand/EightPointStar";
import { Button } from "@/components/ui/Button";
import { JobDirectory } from "@/components/opportunities/JobDirectory";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";
import { getJobs } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata(pageSeo.opportunities);

export default async function OpportunitiesPage() {
  const jobs = await getJobs();
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Opportunities", url: "/opportunities" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      {/* 1. HERO */}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Opportunities" },
        ]}
        eyebrow="Career Directory"
        title="Current Opportunities"
        lead="Discover clinical and operational healthcare positions across the United Kingdom."
      />

      {/* 2. DIRECTORY & FILTERS */}
      <Section bg="white">
        <Container>
          {jobs.length === 0 ? (
            <div className="relative overflow-hidden bg-ivory border border-line rounded-[4px] p-12 md:p-20 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-purple-900 text-gold-500 flex items-center justify-center mx-auto mb-6">
                <EightPointStar size={24} className="text-gold-500" />
              </div>

              <Heading level="h2" color="ink" className="mb-4">
                New opportunities are on the horizon.
              </Heading>

              <p className="font-sans text-base text-muted leading-relaxed mb-8 max-w-[48ch] mx-auto">
                We partner on bespoke and confidential healthcare mandates.
                While roles are being prepared for public listing, we invite clinical
                and operational leaders to register directly with our search team.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="purple" size="md" href="/candidates#register" arrow={true}>
                  Register Your Profile
                </Button>
                <Button variant="outline-dark" size="md" href="/contact">
                  Speak with a Consultant
                </Button>
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="py-12 text-center text-sm text-muted">
                  Loading opportunities…
                </div>
              }
            >
              <JobDirectory initialJobs={jobs} />
            </Suspense>
          )}
        </Container>
      </Section>
    </div>
  );
}
