import Image from "next/image";
import type { Dictionary } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/ui";

const ICONS = [
  // discovery call
  <path key="0" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  // design presentation
  <g key="1"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4" /></g>,
  // build
  <path key="2" d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />,
  // launch
  <g key="3"><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" /><path d="M9 15l-3-3 9-9c2-.5 4 0 4 0s.5 2 0 4l-9 9Z" /><circle cx="15" cy="9" r="1.5" /></g>,
];

/**
 * Process as a vertical timeline. As you scroll, El Camba walks down the line (data-traveler),
 * the line fills in behind him and each step card lights up as he reaches it. MotionRoot drives it;
 * without JS or with reduced motion everything is shown as a static timeline.
 */
export function Process({ copy }: { copy: Dictionary["process"] }) {
  return (
    <section id="proceso" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      <div className="container-x relative">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} align="center" />

        <div data-timeline className="relative mx-auto mt-20 max-w-5xl">
          {/* track */}
          <div aria-hidden="true" className="absolute bottom-0 left-7 top-0 w-[3px] -translate-x-1/2 rounded-full bg-line lg:left-1/2">
            <div data-timeline-fill className="h-full w-full origin-top rounded-full bg-gradient-to-b from-brand via-brand to-brand-ink" />
          </div>

          {/* the traveller: El Camba walking down the timeline */}
          <div aria-hidden="true" data-traveler className="pointer-events-none absolute left-7 top-0 z-20 -translate-x-1/2 lg:left-1/2">
            <div className="relative -mt-10 grid size-20 place-items-center lg:-mt-14 lg:size-28">
              <span className="absolute inset-2 rounded-full bg-brand/30 blur-xl" />
              <span className="absolute inset-3 rounded-full border border-brand/40 bg-white/80 shadow-[0_10px_40px_-8px_rgb(25_227_107/0.7)] backdrop-blur" />
              <Image src="/robot/walker.webp" alt="" width={160} height={160} className="traveler-bob relative size-20 object-contain lg:size-28 drop-shadow-[0_8px_10px_rgb(4_86_42/0.25)]" />
            </div>
          </div>

          <ol className="relative space-y-14 lg:space-y-24">
            {copy.steps.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li key={s.title} data-step className="group relative grid items-center pl-20 lg:grid-cols-2 lg:gap-24 lg:pl-0">
                  {/* node on the line */}
                  <span
                    aria-hidden="true"
                    className="absolute left-7 top-8 z-10 size-5 -translate-x-1/2 rounded-full border-[3px] border-line bg-white transition-all duration-500 group-data-[on=true]:scale-125 group-data-[on=true]:border-brand group-data-[on=true]:bg-brand group-data-[on=true]:shadow-[0_0_0_8px_rgb(25_227_107/0.18)] lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2"
                  />
                  {/* big step number on the opposite side (desktop) */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden select-none font-semibold leading-none tracking-[-0.06em] text-ink/[0.05] transition-colors duration-700 [font-size:9rem] group-data-[on=true]:text-brand/25 lg:block",
                      right ? "lg:order-1 lg:text-right" : "lg:order-2",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={cn("step-card relative rounded-[1.75rem] p-[1px]", right ? "lg:order-2" : "lg:order-1")}>
                    <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-white p-6 sm:p-8">
                      <span aria-hidden="true" className="absolute -right-16 -top-16 size-44 rounded-full bg-brand/0 blur-3xl transition-colors duration-700 group-data-[on=true]:bg-brand/25" />
                      <div className="relative flex items-center gap-4">
                        <span className="grid size-12 place-items-center rounded-2xl bg-mist text-ink transition-all duration-500 group-data-[on=true]:bg-ink group-data-[on=true]:text-brand">
                          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            {ICONS[i % ICONS.length]}
                          </svg>
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-brand-ink">
                          {copy.eyebrow} · {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="relative mt-5 text-2xl font-semibold tracking-tight text-ink">{s.title}</h3>
                      <p className="relative mt-2 text-[15.5px] leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
