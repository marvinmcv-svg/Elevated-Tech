import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages } from "@/content/pages";
import { isLocale } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/contacto", pages[locale].contact.meta);
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  const label = t.nav.items.find((i) => i.href === "/contacto")?.label ?? "";
  return (
    <>
      <Contact copy={t.contact} page={<Breadcrumbs dark crumbs={[[p.breadcrumbHome, `/${locale}`], [label, ""]]} />} />
      <Faq copy={t.faq} locale={locale} />
      <JsonLd data={breadcrumbLd(locale, [[p.breadcrumbHome, ""], [label, "/contacto"]])} />
    </>
  );
}
