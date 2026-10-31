import Image from "next/image";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { testimonials } from "@/content/media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Placeholder } from "@/components/ui/Placeholder";

/** Real testimonials only. Until they're added in content/media.ts, marked placeholders render. */
export function Testimonials({ copy, locale }: { copy: Dictionary["testimonials"]; locale: Locale }) {
  return (
    <section id="testimonios" className="relative bg-mist py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.length > 0
            ? testimonials.map((t, i) => (
                <li key={i} data-reveal className="flex flex-col rounded-3xl bg-white p-7 ring-1 ring-line">
                  {t.screenshot && (
                    <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
                      <Image src={t.screenshot} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                    </div>
                  )}
                  {t.quote && <blockquote className="flex-1 text-lg leading-relaxed text-ink">“{t.quote[locale]}”</blockquote>}
                  <p className="mt-6 font-semibold text-ink">{t.name}</p>
                  <p className="text-sm text-muted">{t.role[locale]}</p>
                </li>
              ))
            : Array.from({ length: copy.count }).map((_, i) => (
                <li key={i} data-reveal>
                  <Placeholder label={copy.todo} className="min-h-[18rem] flex-col items-start justify-end bg-white p-7">
                    <div aria-hidden="true" className="w-full">
                      <svg viewBox="0 0 32 24" width="32" className="text-brand"><path fill="currentColor" d="M0 24V14C0 6 4 1 12 0l1 4c-4 1-6 4-6 8h6v12H0Zm19 0V14c0-8 4-13 12-14l1 4c-4 1-6 4-6 8h6v12H19Z" /></svg>
                      <div className="mt-5 space-y-2">
                        <div className="h-2.5 w-full rounded bg-ink/[0.07]" />
                        <div className="h-2.5 w-11/12 rounded bg-ink/[0.07]" />
                        <div className="h-2.5 w-3/5 rounded bg-ink/[0.07]" />
                      </div>
                      <div className="mt-7 flex items-center gap-3">
                        <div className="size-10 rounded-full bg-ink/[0.07]" />
                        <div className="space-y-1.5"><div className="h-2.5 w-24 rounded bg-ink/10" /><div className="h-2 w-16 rounded bg-ink/[0.06]" /></div>
                      </div>
                    </div>
                  </Placeholder>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
