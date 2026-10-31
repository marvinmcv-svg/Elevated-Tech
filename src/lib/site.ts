/**
 * Central company config. Anything marked TODO is a placeholder to fill before launch.
 */
export const site = {
  name: "Elevated Tech",
  /** TODO(launch): replace with the real .com domain via NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://elevatedtech.example").replace(/\/$/, ""),
  /** TODO(launch): replace with the real company email once the domain is live. */
  email: "hola@elevatedtech.example",
  whatsapp: {
    /** International format, digits only, used for wa.me links. */
    number: "59177165787",
    display: "+591 77165787",
  },
  locality: "Santa Cruz de la Sierra",
  country: "Bolivia",
  citiesServed: ["Santa Cruz", "La Paz", "Cochabamba"],
} as const;

export const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false";
