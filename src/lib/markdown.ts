import { remark } from "remark";
import html from "remark-html";

/**
 * Converts the Markdown/MDX body saved by the admin panel (or written by hand) into safe HTML.
 * remark-html sanitises its output by default, so raw HTML in the body is not passed through.
 */
export function markdownToHtml(markdown: string): string {
  return remark().use(html).processSync(markdown).toString();
}

export async function markdownToHtmlAsync(markdown: string): Promise<string> {
  return (await remark().use(html).process(markdown)).toString();
}
