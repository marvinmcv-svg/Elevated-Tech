import type { Dictionary } from "@/content";

export function Stats({ stats }: { stats: Dictionary["stats"] }) {
  return (
    <section aria-label="Elevated Tech" className="border-y border-line bg-white">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            data-reveal
            className="flex flex-col gap-2 border-line py-8 pr-4 even:border-l even:pl-5 lg:border-l lg:px-8 lg:py-10 lg:first:border-l-0 lg:first:pl-0 [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0"
          >
            <dt className="order-2 text-sm leading-snug text-ink-soft">{s.label}</dt>
            <dd className="order-1 text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
              {s.prefix}
              <span data-count={s.value}>{s.value}</span>
              <span className="text-brand-ink">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
