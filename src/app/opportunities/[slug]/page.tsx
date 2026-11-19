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
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleBody } from "@/components/insights/ArticleBody";
import {
  buildJobDescription,
  createPageMetadata,
  fitTitle,
  getBreadcrumbJsonLd,
  getJobPostingJsonLd,
  TITLE_SUFFIX,
  MAX_TITLE_LENGTH,
} from "@/lib/seo";
import { getJobBySlug, getJobPages, getSpecialismBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  // Open and closed jobs both have a page (closed ones show a banner); drafts only when visible locally.
  const jobs = await getJobPages();
  return jobs.map((j) => ({ slug: j.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Role Not Found", robots: { index: false, follow: false } };
  const specialism = await getSpecialismBySlug(job.meta.specialism);
  const withLabel = `${job.meta.title} — Healthcare Vacancy`;
  const title =
    withLabel.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH ? withLabel : fitTitle(job.meta.title);
  return createPageMetadata({
    title,
    description: buildJobDescription(job, specialism?.meta.title),
    path: `/opportunities/${slug}`,
    // Only open jobs are indexed. Closed jobs keep their page but ask search engines to drop it.
    noIndex: job.meta.status !== "open",
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
  const specialism = await getSpecialismBySlug(meta.specialism);
  const specialismLabel = specialism?.meta.title ?? meta.specialism;

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
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Opportunities", href: "/opportunities" },
          { label: meta.title },
        ]}
        eyebrow={specialismLabel.toUpperCase()}
        title={meta.title}
      >
        {meta.status === "draft" && (
          <div className="mb-4">
            <Badge variant="draft">Draft Preview</Badge>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gold-500" />
            {meta.location}
          </span>
          {meta.salaryText && (
            <span className="flex items-center gap-1.5 font-medium text-white">
              <PoundSterling className="w-4 h-4 text-gold-500" />
              {meta.salaryText}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-gold-500" />
            {meta.employmentType}
          </span>
        </div>
      </PageHero>

      {/* 2. MAIN 8/4 GRID CONTENT */}
      <Section bg="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left 8 Cols: Job Details */}
            <div className="lg:col-span-8 space-y-8">
              {isClosed ? (
                <div
                  role="status"
                  data-testid="closed-banner"
                  className="p-6 bg-error-bg border border-error rounded-[4px] text-error text-sm"
                >
                  <p className="font-semibold mb-1">
                    This role is no longer accepting applications
                  </p>
                  <p>
                    Please browse our{" "}
                    <Link href="/opportunities" className="underline font-semibold">
                      current opportunities
                    </Link>{" "}
                    or register your profile on our{" "}
                    <Link href="/candidates#register" className="underline font-semibold">
                      candidates page
                    </Link>{" "}
                    and we will be in touch about suitable roles.
                  </p>
                </div>
              ) : null}

              {/* Requirements & Overview */}
              <div className="space-y-6 text-body">
                <Heading level="h2" color="ink" className="mb-4">
                  Experience & Background
                </Heading>
                <p className="text-base md:text-lg leading-relaxed text-muted">
                  {meta.requiredExperience}
                </p>

                {meta.requiredQualifications && (
                  <div className="mt-6">
                    <Heading level="h2" color="ink" className="mb-3">
                      Required Qualifications
                    </Heading>
                    <p className="text-base text-muted">
                      {meta.requiredQualifications}
                    </p>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-line">
                  <Heading level="h2" color="ink" className="mb-4">
                    Role Description
                  </Heading>
                  <ArticleBody content={content} shiftHeadings={1} className="!text-base" />
                </div>

                <div className="mt-8 pt-8 border-t border-line text-sm text-muted leading-relaxed">
                  <p>
                    Not quite the right role? Register your profile on our{" "}
                    <Link href="/candidates#register" className="font-semibold text-purple-900 underline decoration-gold-500 underline-offset-4">
                      candidates page
                    </Link>
                    , or read about our{" "}
                    <Link
                      href={specialism ? `/specialisms/${specialism.meta.slug}` : "/specialisms"}
                      className="font-semibold text-purple-900 underline decoration-gold-500 underline-offset-4"
                    >
                      {specialism ? `${specialism.meta.title} recruitment` : "recruitment specialisms"}
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Sticky Application Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <Card hoverable={false} className="p-8">
                <h2 className="font-serif text-xl font-semibold text-purple-900 mb-4">
                  Role Summary
                </h2>

                <dl className="space-y-3 text-sm divide-y divide-line">
                  <div className="pt-2 flex justify-between">
                    <dt className="text-muted">Employer</dt>
                    <dd className="font-medium text-purple-900">
                      {meta.employerDisclosed && meta.employerName
                        ? meta.employerName
                        : "Confidential"}
                    </dd>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <dt className="text-muted">Location</dt>
                    <dd className="font-medium text-purple-900">
                      {meta.location}
                    </dd>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <dt className="text-muted">Type</dt>
                    <dd className="font-medium text-purple-900">
                      {meta.employmentType}
                    </dd>
                  </div>
                  {meta.salaryText && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-muted">Remuneration</dt>
                      <dd className="font-medium text-purple-900">
                        {meta.salaryText}
                      </dd>
                    </div>
                  )}
                  <div className="pt-2 flex justify-between">
                    <dt className="text-muted">Date Posted</dt>
                    <dd className="font-medium text-purple-900">
                      <time dateTime={meta.datePosted}>{formatDate(meta.datePosted)}</time>
                    </dd>
                  </div>
                  {meta.validThrough && (
                    <div className="pt-2 flex justify-between">
                      <dt className="text-muted">Closing Date</dt>
                      <dd className="font-medium text-purple-900">
                        <time dateTime={meta.validThrough}>{formatDate(meta.validThrough)}</time>
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-8">
                  {isClosed ? (
                    <Button
                      variant="outline-dark"
                      size="lg"
                      arrow={true}
                      href="/opportunities"
                      className="w-full text-center"
                    >
                      View current opportunities
                    </Button>
                  ) : (
                    <Button
                      variant="purple"
                      size="lg"
                      arrow={true}
                      href={`/candidates?job=${meta.slug}#register`}
                      className="w-full text-center"
                    >
                      Apply for this role
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
