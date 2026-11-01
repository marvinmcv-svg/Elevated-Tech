import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en"] as const;
  const home = locales.map((l) => ({
    url: `${site.url}/${l}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: l === "es" ? 1 : 0.9,
    alternates: { languages: { es: `${site.url}/es`, en: `${site.url}/en` } },
  }));
  const servicePages = services.flatMap((s) =>
    locales.map((l) => ({
      url: `${site.url}/${l}/servicios/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: l === "es" ? 0.8 : 0.7,
      alternates: { languages: { es: `${site.url}/es/servicios/${s.slug}`, en: `${site.url}/en/servicios/${s.slug}` } },
    })),
  );
  return [...home, ...servicePages];
}
