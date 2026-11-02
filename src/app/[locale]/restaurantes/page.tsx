import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages } from "@/content/pages";
import { isLocale } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";
import { Restaurant } from "@/components/sections/Restaurant";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/restaurantes", pages[locale].restaurants.meta);
}

export default async function RestaurantsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  const label = t.nav.items.find((i) => i.href === "/restaurantes")?.label ?? "";
  return (
    <>
      <Restaurant copy={t.restaurant} film={t.film} locale={locale} need={t.contact.form.needs[5]} crumbs={[[p.breadcrumbHome, `/${locale}`], [label, ""]]} />
      <Process copy={t.process} />
      <Testimonials copy={t.testimonials} locale={locale} />
      <JsonLd data={breadcrumbLd(locale, [[p.breadcrumbHome, ""], [label, "/restaurantes"]])} />
    </>
  );
}
