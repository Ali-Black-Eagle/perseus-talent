import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MapPin, PoundSterling, Briefcase, Calendar, CheckCircle } from "lucide-react";
import { ConstellationGraphic } from "@/components/brand/ConstellationGraphic";
import { GeometricPattern } from "@/components/brand/GeometricPattern";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd, getJobPostingJsonLd } from "@/lib/seo";
import { getJobBySlug, getJobs } from "@/lib/content";

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Role Not Found" };
  return createPageMetadata({
    title: `${job.meta.title} — Healthcare Vacancy`,
    description: job.meta.requiredExperience,
    path: `/opportunities/${slug}`,
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const { meta, content } = job;
  const isClosed = meta.status === "closed";

  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Opportunities", url: "/opportunities" },
    { name: meta.title, url: `/opportunities/${slug}` },
  ]);

  const jsonLdBlocks: Record<string, unknown>[] = [breadcrumbs];
  if (meta.status === "open") {
    jsonLdBlocks.push(getJobPostingJsonLd(job));
  }

  return (
    <div className="flex flex-col">
      <JsonLd data={jsonLdBlocks} />
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
              <li>
                <Link
                  href="/opportunities"
                  className="hover:text-white transition-colors"
                >
                  Opportunities
                </Link>
              </li>
              <li className="text-[#C5A15B]" aria-hidden="true">
                /
              </li>
              <li className="text-white font-medium" aria-current="page">
                {meta.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-[800px]">
            <div className="flex items-center gap-3 mb-4">
              <Eyebrow theme="dark" withLine={true}>
                {meta.specialism.toUpperCase()}
              </Eyebrow>
              {meta.status === "draft" && (
                <Badge variant="draft">Draft Preview</Badge>
              )}
            </div>

            <Heading
              level="h1"
              color="white"
              className="mb-6 leading-tight max-w-[20ch]"
            >
              {meta.title}
            </Heading>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C5A15B]" />
                {meta.location}
              </span>
              {meta.salaryText && (
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <PoundSterling className="w-4 h-4 text-[#C5A15B]" />
                  {meta.salaryText}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#C5A15B]" />
                {meta.employmentType}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. MAIN 8/4 GRID CONTENT */}
      <Section bg="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left 8 Cols: Job Details */}
            <div className="lg:col-span-8 space-y-8">
              {isClosed ? (
                <div className="p-6 bg-[#FEF3F2] border border-[#B42318] rounded-[4px] text-[#B42318] text-sm">
                  This role is no longer accepting applications. Please browse
                  our other opportunities or register your interest with our
                  team.
                </div>
              ) : null}

              {/* Requirements & Overview */}
              <div className="prose prose-lg max-w-none text-[#3A3242]">
                <Heading level="h3" color="ink" className="mb-4">
                  Experience & Background
                </Heading>
                <p className="text-base md:text-lg leading-relaxed text-[#625A6B]">
                  {meta.requiredExperience}
                </p>

                {meta.requiredQualifications && (
                  <div className="mt-6">
                    <Heading level="h3" color="ink" className="mb-3">
                      Required Qualifications
                    </Heading>
                    <p className="text-base text-[#625A6B]">
                      {meta.requiredQualifications}
                    </p>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-[#E6E0EB]">
                  <Heading level="h3" color="ink" className="mb-4">
                    Role Description
                  </Heading>
                  <div className="whitespace-pre-line text-base text-[#3A3242] leading-relaxed">
                    {content}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Sticky Application Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <Card hoverable={false} className="p-8">
                <h3 className="font-serif text-xl font-semibold text-[#1C052E] mb-4">
                  Role Summary
                </h3>

                <dl className="space-y-3 text-sm divide-y divide-[#E6E0EB]">
                  <div className="pt-2 flex justify-between">
                    <dt className="text-[#625A6B]">Employer</dt>
                    <dd className="font-medium text-[#1C052E]">
                      {meta.employerDisclosed && meta.employerName
                        ? meta.employerName
                        : "Confidential"}
                    </dd>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <dt className="text-[#625A6B]">Location</dt>
                    <dd className="font-medium text-[#1C052E]">
                      {meta.location}
                    </dd>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <dt className="text-[#625A6B]">Type</dt>
                    <dd className="font-medium text-[#1C052E]">
                      {meta.employmentType}
                    </dd>
                  </div>
                  {meta.salaryText && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-[#625A6B]">Remuneration</dt>
                      <dd className="font-medium text-[#1C052E]">
                        {meta.salaryText}
                      </dd>
                    </div>
                  )}
                  <div className="pt-2 flex justify-between">
                    <dt className="text-[#625A6B]">Date Posted</dt>
                    <dd className="font-medium text-[#1C052E]">
                      {meta.datePosted}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <Button
                    variant="purple"
                    size="lg"
                    arrow={true}
                    href={`/candidates?job=${meta.slug}#register`}
                    disabled={isClosed}
                    className="w-full text-center"
                  >
                    Apply for this role
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
