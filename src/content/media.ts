/**
 * REAL CONTENT SLOTS — the one file Marvin edits to replace placeholders.
 * Put files in /public/... and reference them here. Anything left as null renders a
 * clearly marked TODO placeholder (never fake content).
 */

// Project links, live previews and the featured films now live in src/content/portfolio.ts.

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
