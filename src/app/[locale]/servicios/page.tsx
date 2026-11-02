import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages, serviceCases } from "@/content/pages";
import { services, serviceUi } from "@/content/services";
import { projectByKey, type Project } from "@/content/portfolio";
import { isLocale } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { LeadButton } from "@/components/ui/LeadButton";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectThumb } from "@/components/portfolio/ProjectThumb";
import { ArrowUpRight, ServiceIcon } from "@/components/ui/Icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/servicios", pages[locale].services.meta);
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  const ui = serviceUi[locale];
  const home = `/${locale}`;

  return (
    <>
      <PageHero
        crumbs={[[p.breadcrumbHome, home], [p.services.eyebrow, ""]]}
        eyebrow={p.services.eyebrow}
        title={p.services.title}
        body={p.services.body}
      >
        <LeadButton location="services-page-hero" size="lg">{t.nav.cta}</LeadButton>
      </PageHero>

      <Services copy={t.services} locale={locale} heading={false} />

      {/* Every service with the live projects that show it */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="container-x">
          <ul className="divide-y divide-line border-y border-line">
            {services.map((s, i) => {
              const c = s.copy[locale];
              const cases = serviceCases[s.key].map(projectByKey).filter((x): x is Project => !!x).slice(0, 3);
              return (
                <li key={s.slug} data-reveal className="grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
                  <div className="flex gap-5">
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-ink ring-1 ring-brand-100">
                        <ServiceIcon name={s.key} />
                      </span>
                      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                        <Link href={`${home}/servicios/${s.slug}`} className="hover:text-brand-ink">{c.title}</Link>
                      </h2>
                      <p className="mt-2 max-w-md text-[15.5px] leading-relaxed text-ink-soft">{c.short}</p>
                      <Link href={`${home}/servicios/${s.slug}`} className="mt-4 inline-flex items-center gap-1.5 font-medium text-ink hover:text-brand-ink">
                        {ui.viewService} <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{p.serviceCases.eyebrow}</p>
                    <ul className="grid grid-cols-3 gap-3">
                      {cases.map((pr) => (
                        <li key={pr.key}>
                          <Link href={`${home}/proyectos/${pr.key}`} className="group block">
                            <span className="relative block aspect-[16/11] overflow-hidden rounded-xl ring-1 ring-line">
                              <span className="block size-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105">
                                <ProjectThumb project={pr} locale={locale} size="sm" chrome={false} sizes="(min-width: 1024px) 16vw, 30vw" />
                              </span>
                            </span>
                            <span className="mt-2 block truncate text-[13px] font-medium text-ink group-hover:text-brand-ink">{pr.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Process copy={t.process} />
      <CtaBand locale={locale} title={t.projects.cta.title} body={t.projects.cta.body} primary={t.projects.cta.primary} location="services-page-cta" />
      <JsonLd data={breadcrumbLd(locale, [[p.breadcrumbHome, ""], [p.services.eyebrow, "/servicios"]])} />
    </>
  );
}
