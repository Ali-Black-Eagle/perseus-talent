import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, PoundSterling, Briefcase, Calendar } from "lucide-react";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
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

      {/* 2. VACANCIES DIRECTORY */}
      <Section bg="white">
        <Container>
          {jobs.length === 0 ? (
            /* Styled Empty State with Constellation motif per §J */
            <div className="relative overflow-hidden bg-[#FBF9F6] border border-[#E6E0EB] rounded-[4px] p-12 md:p-20 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#1C052E] text-[#C5A15B] flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-6">
                ✦
              </div>

              <Heading level="h2" color="ink" className="mb-4">
                New opportunities are on the horizon.
              </Heading>

              <p className="font-sans text-base text-[#625A6B] leading-relaxed mb-8 max-w-[46ch] mx-auto">
                We are currently partnering with healthcare clients on new
                clinical briefs. Register your interest with Perseus Talent and
                let us know what your next career move looks like.
              </p>

              <Button
                variant="purple"
                size="lg"
                arrow={true}
                href="/candidates#register"
              >
                Register Your Interest
              </Button>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              <p
                aria-live="polite"
                className="text-xs uppercase tracking-wider text-[#7A5A20] font-semibold"
              >
                Showing {jobs.length} opportunit{jobs.length === 1 ? "y" : "ies"}
              </p>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card
                    key={job.meta.slug}
                    hoverable={true}
                    className="p-8 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <Badge variant="purple">
                          {job.meta.specialism.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-[#625A6B] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A15B]" />
                          {job.meta.datePosted}
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl font-semibold text-[#1C052E] mb-3">
                        <Link
                          href={`/opportunities/${job.meta.slug}`}
                          className="hover:text-[#7A5A20] transition-colors"
                        >
                          {job.meta.title}
                        </Link>
                      </h2>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-[#625A6B] mb-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#C5A15B]" />
                          {job.meta.location}
                        </span>
                        {job.meta.salaryText && (
                          <span className="flex items-center gap-1.5 font-medium text-[#1C052E]">
                            <PoundSterling className="w-4 h-4 text-[#C5A15B]" />
                            {job.meta.salaryText}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#C5A15B]" />
                          {job.meta.employmentType}
                        </span>
                      </div>

                      <p className="font-sans text-sm text-[#625A6B] leading-relaxed line-clamp-2">
                        {job.meta.requiredExperience}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#E6E0EB] flex justify-between items-center">
                      <span className="text-xs text-[#625A6B]">
                        {job.meta.employerDisclosed && job.meta.employerName
                          ? job.meta.employerName
                          : "Confidential Healthcare Provider"}
                      </span>
                      <Link
                        href={`/opportunities/${job.meta.slug}`}
                        className="font-sans text-sm font-semibold text-[#1C052E] hover:text-[#7A5A20] inline-flex items-center gap-1"
                      >
                        View role →
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
