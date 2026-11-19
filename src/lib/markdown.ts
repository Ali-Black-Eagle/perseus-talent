import { remark } from "remark";
import html from "remark-html";

/**
 * Converts the Markdown/MDX body written by hand in content/ into safe HTML.
 * remark-html sanitises its output by default, so raw HTML in the body is not passed through.
 */
export async function markdownToHtmlAsync(markdown: string): Promise<string> {
  return (await remark().use(html).process(markdown)).toString();
}
