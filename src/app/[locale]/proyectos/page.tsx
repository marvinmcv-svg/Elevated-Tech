import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { pages } from "@/content/pages";
import { projects } from "@/content/portfolio";
import { isLocale } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/proyectos", pages[locale].projects.meta);
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const p = pages[locale];
  const copy = t.projects;
  const home = `/${locale}`;

  return (
    <>
      <PageHero
        crumbs={[[p.breadcrumbHome, home], [copy.eyebrow, ""]]}
        eyebrow={copy.eyebrow}
        title={copy.title.replace("{n}", String(projects.length))}
        body={copy.body}
        aside={
          <p data-reveal className="flex items-baseline gap-3 lg:justify-end lg:pb-2">
            <span data-count={projects.length} className="text-7xl font-semibold tracking-[-0.05em] text-ink sm:text-8xl">
              {projects.length}
            </span>
            <span className="max-w-[9rem] text-sm leading-snug text-muted">{copy.countLabel}</span>
          </p>
        }
      />
      <section id="proyectos" className="relative bg-mist py-16 sm:py-24">
        <div className="container-x">
          <Portfolio copy={copy} locale={locale} caseLabel={p.serviceCases.viewCase} />
        </div>
      </section>
      <CtaBand
        locale={locale}
        title={copy.cta.title}
        body={copy.cta.body}
        primary={copy.cta.primary}
        location="projects-page-cta"
        className="bg-mist pb-24 sm:pb-32"
      />
      <JsonLd
        data={[
          breadcrumbLd(locale, [[p.breadcrumbHome, ""], [copy.eyebrow, "/proyectos"]]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: projects.map((pr, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${site.url}/${locale}/proyectos/${pr.key}`,
              name: pr.name,
            })),
          },
        ]}
      />
    </>
  );
}
