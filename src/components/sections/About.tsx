import Image from "next/image";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { originStory, teamPhotos } from "@/content/media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Placeholder, TodoBadge } from "@/components/ui/Placeholder";
import { Pin } from "@/components/ui/Icons";
import { cn } from "@/lib/ui";

/** `page` (breadcrumbs) turns the section into the top of the About page (h1, room for the header). */
export function About({ copy, locale, page }: { copy: Dictionary["about"]; locale: Locale; page?: React.ReactNode }) {
  return (
    <section id="nosotros" className={cn("relative overflow-hidden bg-white pb-24 sm:pb-32", page ? "pt-28 lg:pt-36" : "pt-24 sm:pt-32")}>
      <div className="container-x">
        {page}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeader as={page ? "h1" : "h2"} eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
          <div data-reveal className="lg:pb-2">
            {originStory ? (
              <p className="text-lg leading-relaxed text-ink-soft">{originStory[locale]}</p>
            ) : (
              <Placeholder label={copy.storyTodo} className="min-h-40 items-end justify-start bg-mist p-6">
                <div aria-hidden="true" className="mt-10 w-full space-y-2">
                  <div className="h-2.5 w-full rounded bg-ink/[0.07]" />
                  <div className="h-2.5 w-full rounded bg-ink/[0.07]" />
                  <div className="h-2.5 w-2/3 rounded bg-ink/[0.07]" />
                </div>
              </Placeholder>
            )}
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted">
              <Pin className="text-brand-ink" /> {copy.locationLabel}
            </p>
          </div>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-3">
          {copy.team.map((m, i) => {
            const photo = teamPhotos[m.name];
            return (
              <li key={m.name} data-reveal className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist" data-parallax={i === 1 ? "0.08" : undefined}>
                  {photo ? (
                    <Image src={photo} alt={`${m.name}, ${m.role}`} fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
                  ) : (
                    <Placeholder label={`${copy.photoTodo} · ${m.name}`} className="absolute inset-0 rounded-3xl bg-[linear-gradient(160deg,#f5f8f6,#e6ede9)]">
                      <span aria-hidden="true" className="text-[7rem] font-semibold tracking-[-0.06em] text-ink/[0.06]">{m.name[0]}</span>
                    </Placeholder>
                  )}
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-ink">{m.name}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-brand-ink">{m.role}</span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{m.bio}</p>
                {m.bioTodo && <TodoBadge label={locale === "es" ? `Bio de ${m.name}` : `${m.name}'s bio`} className="mt-3" />}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
