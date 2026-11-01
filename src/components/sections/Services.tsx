import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCards } from "./ServiceCards";

export function Services({ copy, locale }: { copy: Dictionary["services"]; locale: Locale }) {
  return (
    <section id="servicios" className="on-dark grain relative isolate overflow-hidden bg-night py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
      <div aria-hidden="true" className="sv-aurora absolute -top-40 left-1/2 -z-10 h-[40rem] w-[70rem] -translate-x-1/2 rounded-full bg-[conic-gradient(from_180deg,rgb(25_227_107/0.28),rgb(45_212_191/0.12),rgb(124_156_255/0.12),rgb(25_227_107/0.28))] blur-[120px]" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} dark />
          <p data-reveal className="shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-white/40">
            08 · {copy.eyebrow}
          </p>
        </div>
        <ServiceCards locale={locale} />
      </div>
    </section>
  );
}
