import type { Dictionary } from "@/content";

export function Stats({ stats }: { stats: Dictionary["stats"] }) {
  return (
    <section aria-label="Elevated Tech" className="relative bg-white pb-6 pt-10 sm:pt-14">
      <dl className="container-x grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            data-reveal
            className="stat-card spotlight group relative flex flex-col gap-3 overflow-hidden rounded-[1.5rem] p-5 shadow-[0_20px_50px_-35px_rgb(4_86_42/0.45)] sm:p-7"
          >
            <span aria-hidden="true" className="absolute -right-10 -top-10 size-32 rounded-full bg-brand/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <dt className="relative order-2 text-sm leading-snug text-ink-soft">{s.label}</dt>
            <dd className="relative order-1 text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
              {s.prefix}
              <span data-count={s.value}>{s.value}</span>
              <span className="bg-gradient-to-br from-brand to-brand-ink bg-clip-text text-transparent">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
