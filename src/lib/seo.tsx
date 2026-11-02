import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Per-page metadata with canonical + hreflang alternates. `path` is locale-less ("" for home, "/proyectos"…). */
export function pageMetadata(locale: Locale, path: string, meta: { title: string; description: string }): Metadata {
  const url = `/${locale}${path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: { es: `/es${path}`, en: `/en${path}`, "x-default": `/es${path}` },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      url,
      locale: locale === "es" ? "es_BO" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_BO"],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

/** JSON-LD BreadcrumbList from [name, locale-less path] pairs. */
export function breadcrumbLd(locale: Locale, items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${site.url}/${locale}${path}`,
    })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
