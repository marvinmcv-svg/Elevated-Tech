import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { services } from "@/content/services";

export function StructuredData({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const url = `${site.url}/${locale}`;
  const org = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url,
    description: dict.meta.description,
    telephone: `+${site.whatsapp.number}`,
    email: site.email,
    image: `${url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locality,
      addressRegion: "Santa Cruz",
      addressCountry: "BO",
    },
    areaServed: [
      ...site.citiesServed.map((name) => ({ "@type": "City", name })),
      { "@type": "Country", name: "Bolivia" },
    ],
    knowsLanguage: ["es", "en"],
    founder: dict.about.team.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${site.whatsapp.number}`,
      contactType: "sales",
      availableLanguage: ["Spanish", "English"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.eyebrow,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        url: `${url}/servicios/${s.slug}`,
        itemOffered: { "@type": "Service", name: s.copy[locale].title, description: s.copy[locale].short },
      })),
    },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: dict.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
