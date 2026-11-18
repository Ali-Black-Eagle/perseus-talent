import React, { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { JobDirectory } from "@/components/opportunities/JobDirectory";
import { getJobs } from "@/lib/content";

export const metadata = {
  title: "Opportunities — Healthcare Vacancies & Careers",
  description:
    "Explore current healthcare vacancies and career opportunities with Perseus Talent across the UK.",
};

export default async function OpportunitiesPage() {
  const jobs = await getJobs();

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-[#1C052E] text-white pt-16 pb-16 md:pt-24 md:pb-20 border-b border-[#C5A15B]/30">
        <GeometricPattern opacity={0.04} />

        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[380px] h-[380px] pointer-events-none opacity-25">
          <ConstellationGraphic opacity={0.6} />
        </div>

        <Container className="relative z-10">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-xs font-sans text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-[#C5A15B]" aria-hidden="true">
                /
              </li>
              <li className="text-white font-medium" aria-current="page">
                Opportunities
              </li>
            </ol>
          </nav>

          <div className="max-w-[760px]">
            <Eyebrow theme="dark" withLine={true} className="mb-4">
              Career Directory
            </Eyebrow>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              Current Opportunities
            </Heading>

            <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed mb-4 max-w-[50ch]">
              Discover clinical and operational healthcare positions across the
              United Kingdom.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. DIRECTORY & FILTERS */}
      <Section bg="white">
        <Container>
          <Suspense
            fallback={
              <div className="py-12 text-center text-sm text-[#625A6B]">
                Loading opportunities…
              </div>
            }
          >
            <JobDirectory initialJobs={jobs} />
          </Suspense>
        </Container>
      </Section>
    </div>
  );
}
