import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LeadButton } from "@/components/ui/LeadButton";
import { Check } from "@/components/ui/Icons";

const DISHES: Record<Locale, Array<[string, number, string]>> = {
  es: [
    ["Majadito batido", 2, "en cocina"],
    ["Pique macho", 1, "en cocina"],
    ["Sopa de maní", 3, "listo"],
    ["Limonada con hierba buena", 4, "listo"],
  ],
  en: [
    ["Majadito batido", 2, "in kitchen"],
    ["Pique macho", 1, "in kitchen"],
    ["Peanut soup", 3, "ready"],
    ["Mint lemonade", 4, "ready"],
  ],
};

/** Illustrative POS + QR menu mock (pure HTML/CSS, no real data, no prices). */
function PosMock({ copy, locale }: { copy: Dictionary["restaurant"]["mock"]; locale: Locale }) {
  const bars = [38, 52, 44, 70, 92, 80, 58];
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden="true">
      <div data-parallax="0.12" className="relative rounded-[1.75rem] border border-white/10 bg-[#0d1712]/90 p-4 shadow-[0_40px_120px_-30px_rgb(25_227_107/0.35)] backdrop-blur sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-white/45">{copy.table} 07</p>
            <p className="mt-0.5 font-semibold text-white">{copy.order} #128</p>
          </div>
          <span className="rounded-full bg-brand/15 px-2.5 py-1 font-mono text-[11px] text-brand">● LIVE</span>
        </div>
        <ul className="mt-4 divide-y divide-white/5 rounded-2xl bg-white/[0.03] px-3">
          {DISHES[locale].map(([name, qty, state]) => (
            <li key={name} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="flex items-center gap-3 text-white/90">
                <span className="grid size-7 place-items-center rounded-lg bg-white/5 font-mono text-xs text-white/60">×{qty}</span>
                {name}
              </span>
              <span className={state === "listo" || state === "ready" ? "rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-ink" : "rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70"}>
                {state}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-white/45">{copy.today}</p>
            <div className="mt-2 flex h-16 items-end gap-1.5">
              {bars.map((h, i) => (
                <span key={i} className={i === 4 ? "w-full rounded-t bg-brand" : "w-full rounded-t bg-white/15"} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <span className="rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-ink">{copy.send} →</span>
        </div>
      </div>
      {/* QR menu phone */}
      <div data-parallax="0.35" className="absolute -bottom-10 -left-4 w-[34%] min-w-[120px] rounded-[1.4rem] border-[5px] border-[#1d2a23] bg-white p-2 shadow-2xl sm:-left-10">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-ink/70" />
        <div className="aspect-[4/3] rounded-lg bg-[radial-gradient(circle_at_30%_30%,#ffd29a,#e2733b_60%,#7a2e12)]" />
        <div className="mt-2 h-2 w-3/4 rounded bg-ink/80" />
        <div className="mt-1 h-1.5 w-1/2 rounded bg-ink/20" />
        <div className="mt-2 h-5 rounded-md bg-brand" />
      </div>
    </div>
  );
}

export function Restaurant({ copy, locale, need }: { copy: Dictionary["restaurant"]; locale: Locale; need: string }) {
  return (
    <section id="restaurantes" className="on-dark grain relative isolate overflow-hidden bg-night py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_60%_at_80%_50%,black,transparent)]" />
      <div aria-hidden="true" className="absolute right-[-10%] top-1/3 -z-10 size-[38rem] rounded-full bg-brand/25 blur-[140px]" />
      <div className="container-x grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} dark />
          <blockquote data-reveal className="mt-8 border-l-2 border-brand pl-5 text-[15px] leading-relaxed text-white/75">
            {copy.story}
          </blockquote>
          <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
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
          <div data-reveal className="mt-11">
            <LeadButton location="restaurant" need={need} size="lg">
              {copy.cta}
            </LeadButton>
          </div>
        </div>
        <div data-reveal className="pb-10">
          <PosMock copy={copy.mock} locale={locale} />
        </div>
      </div>
    </section>
  );
}
