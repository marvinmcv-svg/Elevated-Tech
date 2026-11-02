import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages } from "@/content/pages";
import { isLocale } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";
import { Schools } from "@/components/sections/Schools";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/colegios", pages[locale].schools.meta);
}

export default async function SchoolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  const label = t.nav.items.find((i) => i.href === "/colegios")?.label ?? "";
  return (
    <>
      <Schools copy={t.schools} film={t.film} locale={locale} need={t.contact.form.needs[4]} crumbs={[[p.breadcrumbHome, `/${locale}`], [label, ""]]} />
      <Process copy={t.process} />
      <Testimonials copy={t.testimonials} locale={locale} />
      <JsonLd data={breadcrumbLd(locale, [[p.breadcrumbHome, ""], [label, "/colegios"]])} />
    </>
  );
}
