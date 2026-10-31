import type { Dictionary } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight, ServiceIcon } from "@/components/ui/Icons";

export function Services({ copy }: { copy: Dictionary["services"] }) {
  return (
    <section id="servicios" className="relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {copy.items.map((s, i) => (
            <li key={s.key} data-reveal className="spotlight group flex flex-col bg-white p-6 transition-colors duration-500 hover:bg-brand-50/40 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-mist text-ink transition-all duration-500 group-hover:-rotate-6 group-hover:bg-brand group-hover:text-ink">
                  <ServiceIcon name={s.key} />
                </span>
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
              <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink">
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                {s.outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
