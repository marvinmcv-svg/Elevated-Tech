import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages } from "@/content/pages";
import { projectByKey, projects, type Project } from "@/content/portfolio";
import { isLocale } from "@/lib/i18n";
import { buttonClasses, cn } from "@/lib/ui";
import { StructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/portfolio/Portfolio";
import { ProjectThumb } from "@/components/portfolio/ProjectThumb";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

/** Strongest cases first: one per industry. */
const FEATURED = ["restobar-os", "sccs-student-os", "haras-la-alhambra", "don-corte-fino", "spc", "firu-walk"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  const needs = t.contact.form.needs;
  const featured = FEATURED.map(projectByKey).filter((x): x is Project => !!x);
  const home = `/${locale}`;

  return (
    <>
      <Hero copy={t.hero} needs={needs} locale={locale} />
      <Stats stats={t.stats} />
      <Marquee items={t.marquee} />

      <Services copy={t.services} locale={locale} cta={{ label: p.home.servicesCta, href: `${home}/servicios` }} />

      {/* Featured work → /proyectos */}
      <section id="proyectos" className="relative bg-mist py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader eyebrow={p.home.workEyebrow} title={p.home.workTitle} body={p.home.workBody} />
            <div data-reveal className="shrink-0 lg:pb-2">
              <Link href={`${home}/proyectos`} className={cn(buttonClasses("dark", "lg"), "group/btn")}>
                {p.home.workCta.replace("17", String(projects.length))}
                <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pr, i) => (
              <ProjectCard key={pr.key} reveal project={pr} locale={locale} copy={t.projects} index={i} caseLabel={p.serviceCases.viewCase} />
            ))}
          </ul>
        </div>
      </section>

      {/* Industries → /colegios, /restaurantes */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeader eyebrow={p.home.industriesEyebrow} title={p.home.industriesTitle} />
          <ul className="mt-12 grid gap-5 lg:grid-cols-2">
            {p.home.industries.map((ind, i) => {
              const pr = projectByKey(i === 0 ? "sccs-website" : "restobar-os");
              return (
                <li key={ind.href} data-reveal>
                  <Link
                    href={`${home}${ind.href}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-night text-white ring-1 ring-black/5 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
                  >
                    <div className="relative h-64 overflow-hidden sm:h-80">
                      <div className="size-full transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]">
                        {pr && <ProjectThumb project={pr} locale={locale} chrome={false} sizes="(min-width: 1024px) 50vw, 100vw" />}
                      </div>
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
                    </div>
                    <div className="relative -mt-16 flex flex-1 flex-col p-7 sm:p-9">
                      <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{ind.title}</h3>
                      <p className="mt-3 max-w-lg text-lg leading-relaxed text-white/70">{ind.body}</p>
                      <span className="mt-6 inline-flex items-center gap-2 font-medium text-brand">
                        {ind.cta} <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Process copy={t.process} />
      <Testimonials copy={t.testimonials} locale={locale} />
      <Faq copy={t.faq} locale={locale} />
      <Contact copy={t.contact} />
      <StructuredData dict={t} locale={locale} />
    </>
  );
}
