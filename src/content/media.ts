/**
 * REAL CONTENT SLOTS — the one file Marvin edits to replace placeholders.
 * Put files in /public/... and reference them here. Anything left as null renders a
 * clearly marked TODO placeholder (never fake content).
 */

export type ProjectMedia = {
  /** e.g. "/projects/wagyu.webp" (1600×1200 recommended, 4:3) */
  screenshot: string | null;
  /** Live URL, e.g. "https://client.com" */
  url: string | null;
};

export const projectMedia: Record<string, ProjectMedia> = {
  "ai-school": { screenshot: null, url: null },
  wagyu: { screenshot: null, url: null },
  heliport: { screenshot: null, url: null },
  restaurants: { screenshot: null, url: null },
  dogs: { screenshot: null, url: null },
  app: { screenshot: null, url: null },
  schools: { screenshot: null, url: null },
  languages: { screenshot: null, url: null },
  portfolios: { screenshot: null, url: null },
};

/** School AI receptionist proof: a process video (mp4/webm) and/or screenshots. */
export const aiReceptionist: { video: string | null; poster: string | null; screenshots: string[] } = {
  video: null, // e.g. "/media/ai-receptionist.mp4"
  poster: null, // e.g. "/media/ai-receptionist-poster.webp"
  screenshots: [], // e.g. ["/media/ai-1.webp", "/media/ai-2.webp"]
};

/**
 * Real client testimonials only. Use a quote, a screenshot (e.g. a WhatsApp review), or both.
 * Leave the array empty until real ones arrive; the section shows marked placeholders.
 */
export type Testimonial = {
  quote?: { es: string; en: string };
  name: string;
  role: { es: string; en: string };
  screenshot?: string;
};
export const testimonials: Testimonial[] = [];

/**
 * Team photos: shoot all three in the same style, lighting and background (natural light,
 * clean backdrop), 4:5 portrait, so the team reads as one brand. e.g. "/team/marvin.webp"
 */
export const teamPhotos: Record<string, string | null> = {
  Marvin: null,
  Daniel: null,
  Alex: null,
};

/** Origin story (3–4 sentences). null renders a TODO placeholder. */
export const originStory: { es: string; en: string } | null = null;

/** After-launch support details for the FAQ. null keeps the TODO badge on that answer. */
export const supportDetails: { es: string; en: string } | null = null;
