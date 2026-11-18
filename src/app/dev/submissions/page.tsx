import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface LocalSubmissionItem {
  folder: string;
  id: string;
  type: string;
  submittedAt: string;
  hasCv: boolean;
  cvFilename?: string;
  data: Record<string, any>;
}

async function getSubmissions(): Promise<LocalSubmissionItem[]> {
  const dirPath = path.join(process.cwd(), ".local-submissions");
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const submissions: LocalSubmissionItem[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const jsonPath = path.join(dirPath, entry.name, "submission.json");
        try {
          const content = await fs.readFile(jsonPath, "utf-8");
          const parsed = JSON.parse(content);
          submissions.push({
            folder: entry.name,
            id: parsed.id,
            type: parsed.type,
            submittedAt: parsed.submittedAt,
            hasCv: parsed.hasCv,
            cvFilename: parsed.cvFilename,
            data: parsed.data,
          });
        } catch {
          // ignore corrupted folders
        }
      }
    }

    // Sort newest first
    return submissions.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch {
    return [];
  }
}

export default async function SubmissionsViewerPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const submissions = await getSubmissions();

  return (
    <div className="py-12 bg-white min-h-[70vh]">
      <Container>
        <div className="pb-8 mb-8 border-b border-[#E6E0EB]">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="gold">Development Mode Only</Badge>
            <Badge variant="draft">404 in Production</Badge>
          </div>
          <Heading level="h1" color="ink">
            Local Form Submissions Viewer
          </Heading>
          <p className="text-[#625A6B] text-sm md:text-base mt-2">
            These enquiries were captured in the private, git-ignored{" "}
            <code className="bg-[#F7F3FA] px-2 py-0.5 rounded text-xs font-mono">
              .local-submissions/
            </code>{" "}
            folder on this computer.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#E6E0EB] rounded-[4px] bg-[#FBF9F6]">
            <Clock className="w-8 h-8 text-[#857B90] mx-auto mb-3" />
            <p className="font-serif text-xl text-[#1C052E]">
              No local submissions captured yet.
            </p>
            <p className="text-sm text-[#625A6B] mt-1">
              Test an enquiry form on the site to see submissions and uploaded CVs
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-wider text-[#7A5A20] font-semibold">
              Showing {submissions.length} local submission
              {submissions.length === 1 ? "" : "s"}
            </p>

            <div className="divide-y divide-[#E6E0EB] border border-[#E6E0EB] rounded-[4px] overflow-hidden bg-white">
              {submissions.map((sub) => (
                <div key={sub.folder} className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="uppercase text-xs font-bold px-2 py-1 rounded bg-[#1C052E] text-white">
                        {sub.type}
                      </span>
                      <span className="font-mono text-xs text-[#625A6B]">
                        ID: {sub.id}
                      </span>
                    </div>
                    <span className="text-xs text-[#625A6B]">
                      {new Date(sub.submittedAt).toLocaleString("en-GB")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm bg-[#F7F3FA] p-4 rounded-[2px] mb-4">
                    {Object.entries(sub.data)
                      .filter(([k]) => k !== "privacyConsent")
                      .map(([key, value]) => (
                        <div key={key}>
                          <span className="text-xs font-semibold uppercase text-[#625A6B] block">
                            {key}:
                          </span>
                          <span className="text-[#1C052E] font-medium break-words">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : String(value)}
                          </span>
                        </div>
                      ))}
                  </div>

                  {sub.hasCv && sub.cvFilename && (
                    <div className="flex items-center justify-between p-3 bg-[#F6EFE1] border border-[#C5A15B]/30 rounded-[2px]">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#7A5A20]" />
                        <span className="text-xs font-mono font-medium text-[#7A5A20]">
                          {sub.cvFilename}
                        </span>
                      </div>
                      <a
                        href={`/api/dev/download?folder=${encodeURIComponent(
                          sub.folder
                        )}&file=${encodeURIComponent(sub.cvFilename)}`}
                        download
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C052E] hover:text-[#7A5A20]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download CV
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
