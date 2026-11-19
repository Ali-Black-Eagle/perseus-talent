/**
 * The date the fixed pages were last meaningfully changed. Update it when you edit their content.
 * (Using the build date would tell Google that every page changed on every build.)
 */
export const STATIC_PAGES_LAST_MODIFIED = new Date("2026-11-19");

/**
 * Public, indexable pages only. Deliberately NOT listed: /api, /dev, /styleguide and draft articles.
 */
export const STATIC_ROUTES = [
  "",
  "/employers",
  "/candidates",
  "/specialisms",
  "/about",
  "/insights",
  "/contact",
  "/fee-calculator",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/image-credits",
];
