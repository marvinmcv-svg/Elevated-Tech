import type { Dictionary } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Process({ copy }: { copy: Dictionary["process"] }) {
  return (
    <section id="proceso" className="relative bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
        <div className="relative mt-16">
          {/* Track + line that draws with scroll */}
          <div aria-hidden="true" className="absolute left-[1.375rem] top-0 h-full w-px bg-line lg:left-0 lg:top-[1.375rem] lg:h-px lg:w-full">
            <div data-draw="y" className="h-full w-full origin-top bg-brand-ink lg:hidden" />
            <div data-draw="x" className="hidden h-full w-full origin-left bg-brand-ink lg:block" />
          </div>
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {copy.steps.map((s, i) => (
              <li key={s.title} data-step className="group relative pl-16 lg:pl-0 lg:pt-16">
                <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-full border border-line bg-white font-mono text-sm text-ink-soft transition-all duration-500 group-data-[on=true]:border-brand group-data-[on=true]:bg-brand group-data-[on=true]:text-ink group-data-[on=true]:shadow-[0_0_0_8px_rgb(25_227_107/0.15)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 data-reveal className="text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                <p data-reveal className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
