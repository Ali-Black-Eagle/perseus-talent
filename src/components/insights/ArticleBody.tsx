import React from "react";
import { markdownToHtmlAsync } from "@/lib/markdown";

interface ArticleBodyProps {
  content: string;
  className?: string;
  /**
   * Moves every heading down this many levels (## becomes h3 with 1). Used where the page already
   * has its own h2, so the headings stay in order (no skipped or repeated levels).
   */
  shiftHeadings?: number;
}

function shiftHeadingLevels(html: string, by: number): string {
  if (!by) return html;
  return html.replace(/<(\/?)h([1-6])(\s|>)/g, (_m, slash: string, level: string, tail: string) => {
    const next = Math.min(6, Number(level) + by);
    return `<${slash}h${next}${tail}`;
  });
}

export async function ArticleBody({
  content,
  className = "",
  shiftHeadings = 0,
}: ArticleBodyProps) {
  const htmlContent = shiftHeadingLevels(await markdownToHtmlAsync(content), shiftHeadings);

  return (
    <div
      className={`article-prose ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
