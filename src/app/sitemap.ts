import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { es: `${site.url}/es`, en: `${site.url}/en` };
  return (["es", "en"] as const).map((l) => ({
    url: `${site.url}/${l}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: l === "es" ? 1 : 0.9,
    alternates: { languages },
  }));
}
