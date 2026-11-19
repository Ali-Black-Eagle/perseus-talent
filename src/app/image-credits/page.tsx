import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { pageSeo } from "@/config/page-seo";

export const metadata = createPageMetadata(pageSeo.imageCredits);

const CC_BY_2 = {
  name: "CC BY 2.0",
  url: "https://creativecommons.org/licenses/by/2.0/",
};
const CC0 = {
  name: "CC0 1.0 (Public Domain Dedication)",
  url: "https://creativecommons.org/publicdomain/zero/1.0/",
};

const credits = [
  {
    subject: "Young female doctor showing stethoscope, close-up",
    photographer: "Bermix Studio",
    licence: CC_BY_2,
    source:
      "https://commons.wikimedia.org/wiki/File:Young_female_doctor_showing_stethoscope_closeup.jpg",
  },
  {
    subject: "Female doctor examines chest x-rays in a medical office",
    photographer: "Bermix Studio",
    licence: CC_BY_2,
    source:
      "https://commons.wikimedia.org/wiki/File:Female_doctor_examines_chest_x-rays_in_a_medical_office.jpg",
  },
  {
    subject: "Person writing in a notebook while sitting at a desk",
    photographer: "Shixart1985",
    licence: CC_BY_2,
    source:
      "https://commons.wikimedia.org/wiki/File:Person_writing_in_a_notebook_while_sitting_at_a_desk.jpg",
  },
  {
    subject: "Coffee, desk, notes and workspace",
    photographer: "Pixel.la / Startup Stock Photos",
    licence: CC0,
    source:
      "https://commons.wikimedia.org/wiki/File:Coffee-desk-notes-workspace_(24243718641).jpg",
  },
  {
    subject: "Conference, meeting, seminar: modern contemporary concept",
    photographer: "Rawpixel Ltd.",
    licence: CC0,
    source:
      "https://commons.wikimedia.org/wiki/File:Conference_Meeting_Seminar_Modern_Contemporary_Concept_(32881037371).jpg",
  },
];

export default function ImageCreditsPage() {
  const breadcrumbs = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Image Credits", url: "/image-credits" },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumbs} />
      <PageHero
        variant="compact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Image Credits" }]}
        eyebrow="Legal & Compliance"
        title="Image Credits"
        lead="Photography used on this website, with attribution and licence details."
      />

      <Section bg="white">
        <Container narrow={true}>
          <p className="text-sm md:text-base text-body leading-relaxed mb-8">
            The photographs on this website are sourced from Wikimedia Commons.
            Each is listed below with its photographer, licence and original
            source. The photographers do not endorse Perseus Talent.
          </p>
          <ul className="space-y-6">
            {credits.map((c) => (
              <li key={c.source} className="border-b border-line pb-6">
                <h2 className="font-serif text-xl font-semibold text-purple-900 mb-2">
                  {c.subject}
                </h2>
                <dl className="text-sm md:text-base text-body leading-relaxed space-y-1">
                  <div>
                    <dt className="inline font-medium">Photographer: </dt>
                    <dd className="inline">{c.photographer}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Licence: </dt>
                    <dd className="inline">
                      <a
                        href={c.licence.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-gold-text"
                      >
                        {c.licence.name}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Source: </dt>
                    <dd className="inline break-all">
                      <a
                        href={c.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-gold-text"
                      >
                        {c.source}
                      </a>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </div>
  );
}
