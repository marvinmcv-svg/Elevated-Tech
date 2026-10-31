import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { supportDetails } from "@/content/media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TodoBadge } from "@/components/ui/Placeholder";
import { Plus } from "@/components/ui/Icons";

export function Faq({ copy, locale }: { copy: Dictionary["faq"]; locale: Locale }) {
  return (
    <section id="faq" className="relative bg-white py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        </div>
        <div className="border-t border-line">
          {copy.items.map((item, i) => (
            <details key={item.q} data-reveal className="faq group border-b border-line" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left text-lg font-medium text-ink transition-colors hover:text-brand-ink sm:text-xl">
                {item.q}
                <span className="faq-icon grid size-9 shrink-0 place-items-center rounded-full bg-mist text-ink transition-transform duration-500 group-open:bg-brand">
                  <Plus className="size-4" />
                </span>
              </summary>
              <div className="pb-7 pr-12 text-[16px] leading-relaxed text-ink-soft">
                <p>{item.a}</p>
                {item.todo && (supportDetails ? <p className="mt-3">{supportDetails[locale]}</p> : <TodoBadge label={item.todo} className="mt-3" />)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
