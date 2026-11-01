import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCards } from "./ServiceCards";

export function Services({ copy, locale }: { copy: Dictionary["services"]; locale: Locale }) {
  return (
    <section id="servicios" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div aria-hidden="true" className="absolute left-1/2 top-40 -z-0 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-50 blur-[120px]" />
      <div className="container-x relative">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
        <ServiceCards locale={locale} />
      </div>
    </section>
  );
}
