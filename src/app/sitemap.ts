import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/content/services";
import { projects } from "@/content/portfolio";

const locales = ["es", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: l === "es" ? priority : Math.max(0.1, priority - 0.1),
      alternates: { languages: { es: `${site.url}/es${path}`, en: `${site.url}/en${path}` } },
    }));
  return [
    ...entry("", 1),
    ...entry("/servicios", 0.9),
    ...entry("/proyectos", 0.9),
    ...entry("/colegios", 0.8),
    ...entry("/restaurantes", 0.8),
    ...entry("/nosotros", 0.6),
    ...entry("/contacto", 0.7),
    ...services.flatMap((s) => entry(`/servicios/${s.slug}`, 0.8)),
    ...projects.flatMap((p) => entry(`/proyectos/${p.key}`, 0.6)),
  ];
}
