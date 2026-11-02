import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { films } from "@/content/portfolio";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LeadButton } from "@/components/ui/LeadButton";
import { Check } from "@/components/ui/Icons";
import { FilmPlayer } from "@/components/portfolio/FilmPlayer";
import { ProjectStrip } from "@/components/portfolio/ProjectStrip";

/** Featured case: restaurants (RestoBar OS + restaurant websites), explained by a HyperFrames film. */
export function Restaurant({ copy, film, locale, need }: { copy: Dictionary["restaurant"]; film: Dictionary["film"]; locale: Locale; need: string }) {
  return (
    <section id="restaurantes" className="on-dark grain relative isolate overflow-hidden bg-night py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_60%_at_80%_30%,black,transparent)]" />
      <div aria-hidden="true" className="absolute right-[-10%] top-[12%] -z-10 size-[38rem] rounded-full bg-[#ff7a3d]/15 blur-[140px]" />
      <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 size-[34rem] rounded-full bg-brand/20 blur-[140px]" />
      <div className="container-x">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} dark />
          <div>
            <blockquote data-reveal className="border-l-2 border-brand pl-5 text-[15px] leading-relaxed text-white/75">{copy.story}</blockquote>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <LeadButton location="restaurant-hero" need={need} size="lg">{copy.cta}</LeadButton>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-12 sm:mt-16">
          <FilmPlayer film={films.restaurants} locale={locale} id="film-restaurants" labels={{ ...film, caption: copy.filmCaption }} dark />
        </div>

        <ul className="mt-14 grid gap-x-8 gap-y-7 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {copy.features.map((f) => (
            <li key={f.title} data-reveal className="flex gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-ink">
                <Check className="size-3.5" />
              </span>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/65">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 data-reveal className="text-2xl font-semibold tracking-tight">{copy.projectsTitle}</h3>
            <p data-reveal className="text-sm text-white/55">{copy.projectsHint}</p>
          </div>
          <div data-reveal className="mt-6">
            <ProjectStrip keys={films.restaurants.projects} locale={locale} location="restaurants" dark />
          </div>
        </div>

        <div data-reveal className="mt-14 flex flex-col items-start gap-5 rounded-[1.75rem] bg-white/[0.05] p-7 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">{copy.closing.title}</p>
            <p className="mt-1.5 text-white/65">{copy.closing.body}</p>
          </div>
          <LeadButton location="restaurant-closing" need={need} size="lg">{copy.closing.cta}</LeadButton>
        </div>
      </div>
    </section>
  );
}
