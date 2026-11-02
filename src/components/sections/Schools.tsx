import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { films } from "@/content/portfolio";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { SplitText } from "@/components/ui/SplitText";
import { LeadButton } from "@/components/ui/LeadButton";
import { FilmPlayer } from "@/components/portfolio/FilmPlayer";
import { ProjectStrip } from "@/components/portfolio/ProjectStrip";

/** Featured case: the school ecosystem, explained by a HyperFrames film. */
export function Schools({ copy, film, locale, need }: { copy: Dictionary["schools"]; film: Dictionary["film"]; locale: Locale; need: string }) {
  return (
    <section id="colegios" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <span id="caso-ia" aria-hidden="true" className="absolute top-0" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-0 h-[36rem] bg-[radial-gradient(60%_60%_at_80%_0%,rgb(25_227_107/0.10),transparent_70%)]" />
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SplitText text={copy.title} className="mt-5 text-balance text-[clamp(2.1rem,4.8vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink" />
          </div>
          <div>
            <p data-reveal className="text-pretty text-lg leading-relaxed text-ink-soft">{copy.body}</p>
            <div data-reveal className="mt-7 flex flex-wrap gap-3">
              <LeadButton location="schools-hero" need={need} size="lg">{copy.cta}</LeadButton>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-12 sm:mt-16">
          <FilmPlayer film={films.schools} locale={locale} id="film-schools" labels={{ ...film, caption: copy.filmCaption }} />
        </div>

        {/* pain → fix */}
        <ol className="mt-14 grid gap-4 sm:mt-20 md:grid-cols-3">
          {copy.pains.map((p, i) => (
            <li key={p.fix} data-reveal className="group relative overflow-hidden rounded-[1.5rem] bg-mist p-6 ring-1 ring-line sm:p-7">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <p className="mt-4 text-[15px] leading-snug text-muted line-through decoration-[#f97066]/70 decoration-2">{p.pain}</p>
              <p className="mt-3 text-xl font-semibold leading-snug tracking-tight text-ink">{p.fix}</p>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 data-reveal className="text-2xl font-semibold tracking-tight text-ink">{copy.projectsTitle}</h3>
            <p data-reveal className="text-sm text-muted">{copy.projectsHint}</p>
          </div>
          <div data-reveal className="mt-6">
            <ProjectStrip keys={films.schools.projects} locale={locale} location="schools" />
          </div>
        </div>

        <div data-reveal className="mt-14 flex flex-col items-start gap-5 rounded-[1.75rem] bg-brand-50 p-7 ring-1 ring-brand-100 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <p className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{copy.closing.title}</p>
            <p className="mt-1.5 text-ink-soft">{copy.closing.body}</p>
          </div>
          <LeadButton location="schools-closing" need={need} variant="dark" size="lg">{copy.closing.cta}</LeadButton>
        </div>
      </div>
    </section>
  );
}
