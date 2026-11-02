import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages, servicesOf } from "@/content/pages";
import { categories, projectByKey, projects, screenshotsOf } from "@/content/portfolio";
import { services } from "@/content/services";
import { isLocale, locales } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { buttonClasses, cn } from "@/lib/ui";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { SplitText } from "@/components/ui/SplitText";
import { ProjectThumb } from "@/components/portfolio/ProjectThumb";
import { ProjectCover, hostOf } from "@/components/portfolio/ProjectCover";
import { PreviewButton } from "@/components/portfolio/PreviewButton";
import { ProjectStrip } from "@/components/portfolio/ProjectStrip";
import { CtaBand } from "@/components/sections/CtaBand";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ServiceIcon } from "@/components/ui/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, key: p.key })));
}

/** Which lead-form "need" each category pre-selects (indexes into contact.form.needs). */
const NEED_INDEX = { schools: 4, restaurants: 5, brands: 0, apps: 3, portfolios: 0 } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; key: string }> }) {
  const { locale, key } = await params;
  const project = projectByKey(key);
  if (!isLocale(locale) || !project) return {};
  const c = pages[locale].caseStudy;
  return pageMetadata(locale, `/proyectos/${key}`, {
    title: `${project.name}: ${c.caseStudy.toLowerCase()} | Elevated Tech`,
    description: `${project.type[locale]}. ${project.solution[locale]}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; key: string }> }) {
  const { locale, key } = await params;
  const project = projectByKey(key);
  if (!isLocale(locale) || !project) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  const c = p.caseStudy;
  const home = `/${locale}`;
  const shot = screenshotsOf(project.key);
  const used = servicesOf(project.key)
    .map((k) => services.find((s) => s.key === k))
    .filter((s): s is (typeof services)[number] => !!s);
  const index = projects.findIndex((x) => x.key === project.key);
  const next = projects[(index + 1) % projects.length];
  const related = projects.filter((x) => x.category === project.category && x.key !== project.key).slice(0, 4);
  const need = t.contact.form.needs[NEED_INDEX[project.category]];

  return (
    <>
      {/* ───────────── Header ───────────── */}
      <section id="top" className="relative isolate overflow-hidden bg-white pb-14 pt-28 lg:pt-36">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent_75%)]" />
        <div aria-hidden="true" className="absolute -right-40 top-0 -z-10 size-[40rem] rounded-full blur-[120px]" style={{ background: `color-mix(in oklab, ${project.cover.accent} 22%, transparent)` }} />
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href={home} className="hover:text-ink">{p.breadcrumbHome}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`${home}/proyectos`} className="hover:text-ink">{t.projects.eyebrow}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{project.name}</li>
            </ol>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <Eyebrow>{`${c.caseStudy} · ${categories[project.category][locale]}`}</Eyebrow>
              <SplitText as="h1" text={project.name} className="mt-5 text-balance text-[clamp(2.6rem,6.4vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink" />
              <p data-reveal className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed">{project.solution[locale]}</p>
              <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
                {project.embed && <PreviewButton projectKey={project.key} label={c.viewLive} />}
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={buttonClasses(project.embed ? "ghost" : "dark", "lg")}>
                  {c.visit} <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
            <dl data-reveal className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-3xl border border-line bg-white/70 p-6 backdrop-blur">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.industry}</dt>
                <dd className="mt-1 font-medium text-ink">{categories[project.category][locale]}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.city}</dt>
                <dd className="mt-1 font-medium text-ink">{project.city}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.type}</dt>
                <dd className="mt-1 font-medium text-ink">{project.type[locale]}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">URL</dt>
                <dd className="mt-1 truncate font-mono text-sm text-ink">{hostOf(project.url)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ───────────── Big screenshot ───────────── */}
      <section className="bg-white pb-20 sm:pb-28">
        <div className="container-x">
          <div data-reveal className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <figure className="overflow-hidden rounded-[1.75rem] border border-line bg-mist shadow-[0_40px_100px_-40px_rgb(10_15_12/0.35)]">
              <div className="relative aspect-[16/10]">
                {shot.desktop ? <ProjectThumb project={{ ...project, cover: { ...project.cover, device: "browser" } }} locale={locale} priority sizes="(min-width: 1280px) 900px, 92vw" /> : <ProjectCover project={project} locale={locale} size="lg" />}
              </div>
              <figcaption className="sr-only">{c.desktop}</figcaption>
            </figure>
            {shot.mobile && (
              <figure className="mx-auto w-56 sm:w-64 lg:mx-0 lg:w-[15rem] xl:w-[17rem]">
                <div className="rounded-[2.4rem] bg-[#111] p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)]">
                  <div className="relative aspect-[390/844] overflow-hidden rounded-[2rem] bg-white">
                    <Image src={shot.mobile} alt={`${project.name} · ${c.mobile}`} fill sizes="272px" className="object-cover object-top" />
                  </div>
                </div>
                <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.mobile}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── Challenge / approach / what's inside ───────────── */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.services}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {used.map((s) => (
                <li key={s.slug}>
                  <Link href={`${home}/servicios/${s.slug}`} className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-4 transition-colors hover:border-brand/40">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mist transition-colors group-hover:bg-brand">
                      <ServiceIcon name={s.key} className="size-4" />
                    </span>
                    <span className="flex-1 text-[15px] font-medium text-ink">{s.copy[locale].title}</span>
                    <ArrowUpRight className="size-4 text-muted transition-transform group-hover:rotate-45 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="space-y-14">
            <div data-reveal>
              <h2 className="inline-flex items-center gap-2 rounded-md bg-[#fff1ef] px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#b42318]">{c.challenge}</h2>
              <p className="mt-5 text-pretty text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">{project.problem[locale]}</p>
            </div>
            <div data-reveal>
              <h2 className="inline-flex items-center gap-2 rounded-md bg-brand-50 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-deep">{c.approach}</h2>
              <p className="mt-5 text-pretty text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">{project.solution[locale]}</p>
            </div>
            <div data-reveal>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.built}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {project.highlights[locale].map((h) => (
                  <li key={h} className="flex gap-3 rounded-2xl border border-line bg-white p-5 text-[15.5px] leading-snug text-ink">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-ink"><Check className="size-3.5" /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Related ───────────── */}
      {related.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="container-x">
            <h2 data-reveal className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{c.related}</h2>
            <div data-reveal className="mt-8">
              <ProjectStrip keys={related.map((r) => r.key)} locale={locale} />
            </div>
          </div>
        </section>
      )}

      <CtaBand locale={locale} title={c.ctaTitle} body={c.ctaBody} primary={c.ctaPrimary} location={`case:${project.key}`} need={need} />

      {/* ───────────── Prev / next ───────────── */}
      <nav aria-label={c.next} className="border-t border-line bg-white">
        <div className="container-x flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`${home}/proyectos`} className="inline-flex items-center gap-2 font-medium text-ink-soft hover:text-ink">
            <ArrowLeft className="size-4" /> {c.back}
          </Link>
          <Link href={`${home}/proyectos/${next.key}`} className="group inline-flex items-center gap-4 text-right">
            <span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{c.next}</span>
              <span className="block text-xl font-semibold tracking-tight text-ink group-hover:text-brand-ink sm:text-2xl">{next.name}</span>
            </span>
            <span className={cn("grid size-12 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:translate-x-1")}>
              <ArrowRight className="size-5" />
            </span>
          </Link>
        </div>
      </nav>

      <JsonLd
        data={[
          breadcrumbLd(locale, [[p.breadcrumbHome, ""], [t.projects.eyebrow, "/proyectos"], [project.name, `/proyectos/${project.key}`]]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.name,
            url: `${site.url}/${locale}/proyectos/${project.key}`,
            about: project.type[locale],
            description: project.solution[locale],
            creator: { "@id": `${site.url}/#organization` },
            inLanguage: locale,
            ...(shot.desktop ? { image: `${site.url}${shot.desktop}` } : {}),
          },
        ]}
      />
    </>
  );
}
