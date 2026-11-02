import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { getService, services, serviceUi } from "@/content/services";
import { isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { pages, serviceCases } from "@/content/pages";
import { projectByKey, type Project } from "@/content/portfolio";
import { Process } from "@/components/sections/Process";
import { ProjectCard } from "@/components/portfolio/Portfolio";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LeadButton } from "@/components/ui/LeadButton";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { SectionHeader, Eyebrow } from "@/components/ui/SectionHeader";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowRight, ArrowUpRight, Check, Plus, ServiceIcon, WhatsApp } from "@/components/ui/Icons";
import { buttonClasses, cn } from "@/lib/ui";
import Link from "next/link";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) return {};
  return pageMetadata(locale, `/servicios/${slug}`, service.copy[locale].meta);
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) notFound();
  const t = getDictionary(locale);
  const c = service.copy[locale];
  const ui = serviceUi[locale];
  const need = t.contact.form.needs[service.need];
  const home = `/${locale}`;
  const p = pages[locale];
  const cases = serviceCases[service.key].map(projectByKey).filter((x): x is Project => !!x);
  const waMessage = `${t.contact.message.greeting} ${locale === "es" ? "Me interesa" : "I'm interested in"}: ${c.title}.`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: c.title,
      description: c.meta.description,
      serviceType: c.title,
      url: `${site.url}/${locale}/servicios/${slug}`,
      provider: { "@id": `${site.url}/#organization` },
      areaServed: { "@type": "Country", name: "Bolivia" },
      inLanguage: locale,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.breadcrumbHome, item: `${site.url}/${locale}` },
        { "@type": "ListItem", position: 2, name: ui.allServices, item: `${site.url}/${locale}/servicios` },
        { "@type": "ListItem", position: 3, name: c.title, item: `${site.url}/${locale}/servicios/${slug}` },
      ],
    },
  ];

  return (
    <>
        {/* ───────────── Hero ───────────── */}
        <section id="top" className="relative isolate overflow-hidden bg-white pb-20 pt-28 sm:pb-28 lg:pt-36">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent_75%)]" />
          <div aria-hidden="true" className="absolute -right-40 top-0 -z-10 size-[40rem] rounded-full bg-brand/20 blur-[120px]" />
          <div className="container-x grid items-center gap-14 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <Breadcrumbs crumbs={[[ui.breadcrumbHome, home], [ui.allServices, `${home}/servicios`], [c.title, ""]]} />
              <Eyebrow>{c.hero.eyebrow}</Eyebrow>
              <SplitText
                as="h1"
                text={c.hero.title}
                className="mt-5 max-w-[22ch] text-balance text-[clamp(2.3rem,5.2vw,4.4rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink"
              />
              <p data-reveal className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed">
                {c.hero.lead}
              </p>
              <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
                <LeadButton location={`service-${service.key}-hero`} need={need} size="lg">
                  {c.hero.primary}
                </LeadButton>
                <WhatsAppLink location={`service-${service.key}-hero`} message={waMessage} className={buttonClasses("ghost", "lg")}>
                  <WhatsApp className="size-5 text-[#25D366]" />
                  {ui.whatsapp}
                </WhatsAppLink>
              </div>
            </div>

            {/* Visual: icon + outcome + who it's for */}
            <aside data-reveal className="relative">
              <div className="relative overflow-hidden rounded-[2rem] bg-night p-7 text-white shadow-[0_40px_80px_-30px_rgb(4_57_28/0.6)] sm:p-9">
                <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" />
                <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-60" />
                <div className="relative">
                  <span className="grid size-16 place-items-center rounded-2xl bg-brand text-ink shadow-[0_16px_40px_-12px_rgb(25_227_107/0.9)]">
                    <ServiceIcon name={service.key} className="size-7" />
                  </span>
                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-brand">{c.outcome}</p>
                  <p className="mt-2 text-2xl font-semibold leading-tight tracking-tight">{c.short}</p>
                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{c.idealFor.title}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {c.idealFor.items.map((x) => (
                      <li key={x} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] text-white/80">{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ───────────── The cost of waiting ───────────── */}
        <section className="relative bg-mist py-24 sm:py-28">
          <div className="container-x">
            <SectionHeader eyebrow={ui.costLabel} title={c.costOfWaiting.title} body={c.costOfWaiting.body} />
            <ol className="mt-14 grid gap-4 md:grid-cols-3">
              {c.costOfWaiting.items.map((item, i) => (
                <li key={item.title} data-reveal className="relative overflow-hidden rounded-3xl border border-line bg-white p-7">
                  <span className="grid size-10 place-items-center rounded-full bg-[#fef3c7] font-mono text-sm text-[#b45309]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────────── What we do ───────────── */}
        <section className="relative bg-white py-24 sm:py-32">
          <div className="container-x">
            <SectionHeader eyebrow={c.hero.eyebrow} title={c.offer.title} body={c.offer.body} />
            <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {c.offer.items.map((f) => (
                <li key={f.title} data-reveal className="spotlight group bg-white p-7 transition-colors duration-500 hover:bg-brand-50/40">
                  <span className="grid size-9 place-items-center rounded-full bg-brand-100 text-brand-ink transition-colors duration-500 group-hover:bg-brand group-hover:text-ink">
                    <Check className="size-4" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────── Before / after ───────────── */}
        <section className="on-dark relative overflow-hidden bg-night py-24 text-white sm:py-32">
          <div aria-hidden="true" className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent_80%)]" />
          <div className="container-x relative">
            <SectionHeader dark eyebrow={c.hero.eyebrow} title={c.change.title} />
            <div className="mt-14 overflow-hidden rounded-3xl border border-white/10">
              <div className="hidden grid-cols-[1fr_auto_1fr] gap-6 border-b border-white/10 bg-white/[0.03] px-7 py-4 font-mono text-[11px] uppercase tracking-[0.14em] md:grid">
                <span className="text-white/45">{ui.before}</span>
                <span />
                <span className="text-brand">{ui.after}</span>
              </div>
              <ul>
                {c.change.items.map((row) => (
                  <li key={row.before} data-reveal className="grid gap-3 border-b border-white/10 px-7 py-6 last:border-b-0 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
                    <p className="text-white/50 line-through decoration-white/25">{row.before}</p>
                    <ArrowRight className="hidden size-5 text-brand md:block" />
                    <p className="flex items-start gap-2.5 text-lg font-medium text-white">
                      <Check className="mt-1 size-4 shrink-0 text-brand" />
                      {row.after}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ───────────── Case studies: our live projects ───────────── */}
        {cases.length > 0 && (
          <section id="casos" className="relative bg-mist py-24 sm:py-32">
            <div className="container-x">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeader eyebrow={p.serviceCases.eyebrow} title={p.serviceCases.title} body={p.serviceCases.body} />
                <div data-reveal className="shrink-0 lg:pb-2">
                  <Link href={`${home}/proyectos`} className={cn(buttonClasses("ghost", "lg"), "group/btn bg-white")}>
                    {p.serviceCases.allProjects}
                    <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
              <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cases.slice(0, 6).map((pr, i) => (
                  <ProjectCard key={pr.key} reveal project={pr} locale={locale} copy={t.projects} index={i} caseLabel={p.serviceCases.viewCase} />
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ───────────── Process ───────────── */}
        <Process copy={{ ...t.process, eyebrow: ui.processTitle }} />

        {/* ───────────── FAQ ───────────── */}
        <section className="relative bg-white pb-24 sm:pb-32">
          <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader eyebrow={ui.faqTitle} title={c.title} />
            </div>
            <div className="border-t border-line">
              {c.faq.map((item, i) => (
                <details key={item.q} data-reveal className="faq group border-b border-line" open={i === 0}>
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left text-lg font-medium text-ink transition-colors hover:text-brand-ink sm:text-xl">
                    {item.q}
                    <span className="faq-icon grid size-9 shrink-0 place-items-center rounded-full bg-mist text-ink transition-transform duration-500 group-open:bg-brand">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <div className="pb-7 pr-12 text-[16px] leading-relaxed text-ink-soft">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── Final CTA ───────────── */}
        <section className="relative bg-white pb-24 sm:pb-32">
          <div className="container-x">
            <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-brand px-7 py-14 text-ink sm:px-14 sm:py-20">
              <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-white/30 blur-3xl" />
              <div className="relative max-w-3xl">
                <h2 className="text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">{c.cta.title}</h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{c.cta.body}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <LeadButton location={`service-${service.key}-cta`} need={need} variant="dark" size="lg">
                    {c.hero.primary}
                  </LeadButton>
                  <WhatsAppLink location={`service-${service.key}-cta`} message={waMessage} className={buttonClasses("light", "lg")}>
                    <WhatsApp className="size-5 text-[#25D366]" />
                    {ui.whatsapp}
                  </WhatsAppLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── Other services ───────────── */}
        <section className="border-t border-line bg-white py-16">
          <div className="container-x">
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{ui.otherServices}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {services
                .filter((s) => s.slug !== slug)
                .map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/${locale}/servicios/${s.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-line p-4 transition-colors hover:border-brand/40 hover:bg-brand-50/50"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mist transition-colors group-hover:bg-brand">
                        <ServiceIcon name={s.key} />
                      </span>
                      <span className="flex-1 text-[15px] font-medium text-ink">{s.copy[locale].title}</span>
                      <ArrowUpRight className="size-4 text-muted transition-transform group-hover:rotate-45 group-hover:text-ink" />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
