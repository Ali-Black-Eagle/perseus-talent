/** The fixed list of Insights categories. Used by the site. */
export const INSIGHT_CATEGORIES = [
  "Healthcare Recruitment",
  "Recruitment Industry",
  "Employer Guidance",
  "Candidate Advice",
  "Career Development",
  "Interview Preparation",
  "Talent Acquisition",
  "Professional Insights",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];
