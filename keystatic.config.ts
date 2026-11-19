import { createElement } from "react";
import { config, collection, fields } from "@keystatic/core";
import { INSIGHT_CATEGORIES } from "./src/config/insight-categories";

/**
 * Admin panel (Keystatic) configuration for Perseus Talent.
 *
 * The collections below must match the Zod schemas in src/lib/content.ts: the field names here are the
 * front matter keys in the files under content/.
 *
 * Storage:
 * - local  (default; npm run dev): edits the files in this folder.
 * - github (KEYSTATIC_STORAGE=github, the live site): saves commit to the repository in KEYSTATIC_GITHUB_REPO.
 * next.config.ts copies those two settings into NEXT_PUBLIC_* variables so the browser and the server agree.
 */
const useGitHub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";
const githubRepo = (process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ||
  "owner/repository") as `${string}/${string}`;

const bodyOptions = {
  heading: [2, 3, 4] as const,
  bold: true,
  italic: true,
  link: true,
  blockquote: true,
  orderedList: true,
  unorderedList: true,
  divider: false,
  code: false,
  codeBlock: false,
  strikethrough: false,
  table: false,
  image: false,
};

export default config({
  storage: useGitHub ? { kind: "github", repo: githubRepo } : { kind: "local" },
  ui: {
    brand: {
      name: "Perseus Talent",
      mark: () =>
        createElement("img", {
          src: "/brand/logo-emblem-512.png",
          alt: "",
          height: 28,
          width: 28,
          style: { height: 28, width: 28, objectFit: "contain" },
        }),
    },
    navigation: {
      Content: ["jobs", "insights", "specialisms"],
    },
  },
  collections: {
    jobs: collection({
      label: "Jobs",
      slugField: "title",
      path: "content/jobs/*",
      format: { contentField: "description" },
      entryLayout: "content",
      columns: ["title", "status", "location", "datePosted"],
      schema: {
        title: fields.slug({
          name: {
            label: "Job title",
            description:
              "Shown at the top of the job page and on the job card, for example: Registered Nurse.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Web address ending",
            description:
              "Made from the title. It becomes the page address: /opportunities/this-text. Do not change it after the job is live.",
          },
        }),
        status: fields.select({
          label: "Status",
          description:
            "Draft: not shown to anyone. Open: listed on the Opportunities page and accepting applications. Closed: removed from the list, but the page stays up with a notice that the role is no longer accepting applications.",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Open", value: "open" },
            { label: "Closed", value: "closed" },
          ],
          defaultValue: "draft",
        }),
        employerName: fields.text({
          label: "Employer name",
          description:
            "The organisation hiring. Kept private unless you tick the box below.",
        }),
        employerDisclosed: fields.checkbox({
          label: "Show employer name publicly?",
          description:
            "Leave unticked for a confidential search. The page then says the employer is confidential.",
          defaultValue: false,
        }),
        location: fields.text({
          label: "Location",
          description: "Town or city, shown on the job card. For example: Manchester.",
          validation: { isRequired: true },
        }),
        region: fields.text({
          label: "Region (optional)",
          description: "For example: North West.",
        }),
        salaryMin: fields.integer({
          label: "Salary from (optional)",
          description:
            "Annual salary in pounds, numbers only. Leave blank if the salary is not disclosed.",
        }),
        salaryMax: fields.integer({
          label: "Salary up to (optional)",
          description:
            "Annual salary in pounds, numbers only. Leave blank if the salary is not disclosed.",
        }),
        salaryText: fields.text({
          label: "Salary as shown on the job card (optional)",
          description:
            "Shown on the job card. Leave blank if salary is not disclosed. For example: £45,000 - £52,000 per annum.",
        }),
        employmentType: fields.select({
          label: "Employment type",
          description: "Shown on the job card and used by the search filters.",
          options: [
            { label: "Permanent", value: "Permanent" },
            { label: "Contract", value: "Contract" },
            { label: "Temporary", value: "Temporary" },
            { label: "Part-time", value: "Part-time" },
            { label: "Full-time", value: "Full-time" },
          ],
          defaultValue: "Permanent",
        }),
        specialism: fields.relationship({
          label: "Specialism",
          description:
            "The sector this role belongs to. Add new sectors under Specialisms.",
          collection: "specialisms",
          validation: { isRequired: true },
        }),
        datePosted: fields.date({
          label: "Date posted",
          description: "Defaults to today.",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        validThrough: fields.date({
          label: "Closing date (optional)",
          description:
            "The last day to apply. Shown on the job page. Remember to set the status to Closed after this date.",
        }),
        requiredExperience: fields.text({
          label: "Required experience",
          description:
            "Shown on the job page and in search results. For example: Minimum 4 years post-registration clinical experience.",
          multiline: true,
          validation: { isRequired: true },
        }),
        requiredQualifications: fields.text({
          label: "Required qualifications (optional)",
          description:
            "Registrations and qualifications needed. For example: Current NMC registration.",
          multiline: true,
        }),
        applicationInstructions: fields.text({
          label: "Application instructions",
          description: "How candidates should apply.",
          multiline: true,
          defaultValue:
            "Submit your registration and CV via the Perseus Talent candidate registration form.",
        }),
        description: fields.mdx({
          label: "Job description",
          description:
            "The main text of the job page. Use the toolbar for headings, bold, lists and links. Only write facts you have confirmed with the employer.",
          extension: "mdx",
          options: bodyOptions,
        }),
      },
    }),

    insights: collection({
      label: "Insights articles",
      slugField: "title",
      path: "content/insights/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "status", "category", "date"],
      schema: {
        title: fields.slug({
          name: {
            label: "Article title",
            description:
              "Aim for under 45 characters so the whole title shows in Google search results.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Web address ending",
            description:
              "Made from the title. It becomes the page address: /insights/this-text.",
          },
        }),
        status: fields.select({
          label: "Status",
          description:
            "Draft: not shown on the website. Published: live on the Insights page.",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
        excerpt: fields.text({
          label: "Summary",
          description:
            "One or two sentences. Shown on the article card and in Google search results, so aim for 120 to 155 characters.",
          multiline: true,
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: "Category",
          description: "Where the article appears in the Insights filters.",
          options: INSIGHT_CATEGORIES.map((c) => ({ label: c, value: c })),
          defaultValue: INSIGHT_CATEGORIES[0],
        }),
        date: fields.date({
          label: "Published date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        updated: fields.date({
          label: "Last updated (optional)",
          description:
            "Set this when you make a meaningful change to a published article.",
        }),
        author: fields.text({
          label: "Author",
          description: "Shown under the title.",
          defaultValue: "Perseus Talent",
        }),
        image: fields.image({
          label: "Article image (optional)",
          description:
            "Shown at the top of the article and when the article is shared. Landscape, ideally 1200 x 630 pixels. If you skip it, the standard Perseus Talent image is used.",
          directory: "public/images/insights",
          publicPath: "/images/insights/",
        }),
        imageAlt: fields.text({
          label: "Image description (alt text)",
          description:
            "Describe what is in the picture for people using screen readers, for example: A person writing in a notebook at a desk.",
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({
          label: "Featured article?",
          description: "Featured articles are highlighted on the Insights page.",
          defaultValue: false,
        }),
        body: fields.mdx({
          label: "Article",
          description:
            "Use the toolbar for headings, bold, lists, links and quotes. The article title is already the main heading, so start with a subheading.",
          extension: "mdx",
          options: bodyOptions,
        }),
      },
    }),

    specialisms: collection({
      label: "Specialisms",
      slugField: "title",
      path: "content/specialisms/*",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "status", "order"],
      schema: {
        title: fields.slug({
          name: {
            label: "Specialism name",
            description: "For example: Healthcare.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Web address ending",
            description:
              "Becomes the page address: /specialisms/this-text. Do not change it after the page is live.",
          },
        }),
        status: fields.select({
          label: "Status",
          description:
            "Active: shown on the website. Coming soon: for a sector you are planning.",
          options: [
            { label: "Active", value: "active" },
            { label: "Coming soon", value: "coming-soon" },
          ],
          defaultValue: "active",
        }),
        summary: fields.text({
          label: "Summary",
          description:
            "One or two sentences shown at the top of the page and in Google search results (120 to 155 characters is ideal).",
          multiline: true,
          validation: { isRequired: true },
        }),
        order: fields.integer({
          label: "Display order",
          description: "1 is shown first.",
          defaultValue: 1,
          validation: { isRequired: true },
        }),
        primary: fields.checkbox({
          label: "Primary specialism?",
          description: "Tick for the main area of focus (Healthcare).",
          defaultValue: false,
        }),
        image: fields.image({
          label: "Image (optional)",
          description: "A landscape photograph for this specialism.",
          directory: "public/images/specialisms",
          publicPath: "/images/specialisms/",
        }),
        body: fields.mdx({
          label: "Page content",
          description: "The main text of the specialism page.",
          extension: "mdx",
          options: bodyOptions,
        }),
      },
    }),
  },
});
