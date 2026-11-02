import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages } from "@/content/pages";
import { isLocale } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { Check } from "@/components/ui/Icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/nosotros", pages[locale].about.meta);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  return (
    <>
      <About copy={t.about} locale={locale} page={<Breadcrumbs crumbs={[[p.breadcrumbHome, `/${locale}`], [t.about.eyebrow, ""]]} />} />
      <Stats stats={t.stats} />
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeader eyebrow={t.about.eyebrow} title={p.about.valuesTitle} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {p.about.values.map((v) => (
              <li key={v.title} data-reveal className="bg-white p-7">
                <span className="grid size-9 place-items-center rounded-full bg-brand-100 text-brand-ink"><Check className="size-4" /></span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Process copy={t.process} />
      <Testimonials copy={t.testimonials} locale={locale} />
      <CtaBand locale={locale} title={t.projects.cta.title} body={t.projects.cta.body} primary={t.projects.cta.primary} location="about-page-cta" />
      <JsonLd data={breadcrumbLd(locale, [[p.breadcrumbHome, ""], [t.about.eyebrow, "/nosotros"]])} />
    </>
  );
}
