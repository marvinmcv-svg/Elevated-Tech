import Image from "next/image";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { aiReceptionist, projectMedia } from "@/content/media";
import { SectionHeader, Eyebrow } from "@/components/ui/SectionHeader";
import { SplitText } from "@/components/ui/SplitText";
import { Placeholder, TodoBadge } from "@/components/ui/Placeholder";
import { LeadButton } from "@/components/ui/LeadButton";
import { ArrowUpRight, Check } from "@/components/ui/Icons";
import { cn } from "@/lib/ui";

type Kind = "chat" | "browser" | "phone" | "pos";
const VISUALS: Record<string, { kind: Kind; bg: string }> = {
  "ai-school": { kind: "chat", bg: "bg-[radial-gradient(120%_100%_at_0%_0%,#19e36b_0%,#067a37_45%,#04291a_100%)]" },
  wagyu: { kind: "browser", bg: "bg-[radial-gradient(120%_120%_at_100%_0%,#5a2a1d_0%,#1a0f0b_55%,#0a0807_100%)]" },
  heliport: { kind: "browser", bg: "bg-[linear-gradient(160deg,#dff3ff_0%,#9fd3f5_45%,#2d6d9b_100%)]" },
  restaurants: { kind: "pos", bg: "bg-[linear-gradient(150deg,#0b1a12_0%,#123322_100%)]" },
  dogs: { kind: "phone", bg: "bg-[radial-gradient(120%_120%_at_0%_100%,#ffd9a8_0%,#ffeedb_45%,#fff8ef_100%)]" },
  app: { kind: "phone", bg: "bg-[linear-gradient(150deg,#e9fff2_0%,#b9f5d0_100%)]" },
  schools: { kind: "browser", bg: "bg-[linear-gradient(150deg,#eef2ff_0%,#c9d4ff_100%)]" },
  languages: { kind: "browser", bg: "bg-[linear-gradient(150deg,#fff1f1_0%,#ffd0cf_100%)]" },
  portfolios: { kind: "browser", bg: "bg-[linear-gradient(150deg,#f5f8f6_0%,#dfe7e2_100%)]" },
};

const STATUS_STYLE: Record<string, string> = {
  live: "bg-brand-100 text-brand-deep",
  soon: "bg-ink text-white",
  progress: "bg-mist text-ink-soft ring-1 ring-inset ring-line",
};

/** Illustrative UI mock shown until the real screenshot is added (marked with a TODO badge). */
function MockVisual({ kind }: { kind: Kind }) {
  if (kind === "chat")
    return (
      <div className="w-[78%] space-y-2.5 rounded-2xl bg-white/95 p-4 shadow-2xl">
        <div className="ml-auto w-[70%] rounded-2xl rounded-br-md bg-mist px-3 py-2"><div className="h-2 w-full rounded bg-ink/15" /><div className="mt-1.5 h-2 w-2/3 rounded bg-ink/15" /></div>
        <div className="w-[80%] rounded-2xl rounded-bl-md bg-brand/20 px-3 py-2"><div className="h-2 w-full rounded bg-brand-ink/40" /><div className="mt-1.5 h-2 w-4/5 rounded bg-brand-ink/40" /><div className="mt-1.5 h-2 w-1/2 rounded bg-brand-ink/40" /></div>
        <div className="flex items-center gap-1.5 pl-1"><span className="size-1.5 animate-bounce rounded-full bg-brand-ink [animation-delay:-0.2s] motion-reduce:animate-none" /><span className="size-1.5 animate-bounce rounded-full bg-brand-ink [animation-delay:-0.1s] motion-reduce:animate-none" /><span className="size-1.5 animate-bounce rounded-full bg-brand-ink motion-reduce:animate-none" /></div>
      </div>
    );
  if (kind === "phone")
    return (
      <div className="h-[86%] aspect-[9/19] rounded-[1.6rem] border-[5px] border-ink bg-white p-2 shadow-2xl">
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-ink/80" />
        <div className="h-[38%] rounded-xl bg-brand/30" />
        <div className="mt-2 h-2 w-3/4 rounded bg-ink/15" />
        <div className="mt-1.5 h-2 w-1/2 rounded bg-ink/10" />
        <div className="mt-3 grid grid-cols-2 gap-1.5"><div className="h-8 rounded-lg bg-mist" /><div className="h-8 rounded-lg bg-mist" /><div className="h-8 rounded-lg bg-mist" /><div className="h-8 rounded-lg bg-brand" /></div>
      </div>
    );
  if (kind === "pos")
    return (
      <div className="grid w-[82%] grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={cn("aspect-square rounded-lg", i === 4 ? "bg-brand" : i % 3 === 0 ? "bg-white/20" : "bg-white/10")} />
        ))}
      </div>
    );
  return (
    <div className="w-[84%] overflow-hidden rounded-xl bg-white shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2"><span className="size-2 rounded-full bg-[#ff5f57]" /><span className="size-2 rounded-full bg-[#febc2e]" /><span className="size-2 rounded-full bg-[#28c840]" /><span className="ml-3 h-2 w-1/3 rounded bg-mist" /></div>
      <div className="p-4">
        <div className="h-3 w-2/3 rounded bg-ink/80" />
        <div className="mt-2 h-2 w-1/2 rounded bg-ink/15" />
        <div className="mt-3 h-6 w-20 rounded-full bg-brand" />
        <div className="mt-4 grid grid-cols-3 gap-2"><div className="h-10 rounded-md bg-mist" /><div className="h-10 rounded-md bg-mist" /><div className="h-10 rounded-md bg-mist" /></div>
      </div>
    </div>
  );
}

export function Projects({ copy, locale }: { copy: Dictionary["projects"]; locale: Locale }) {
  const total = copy.items.length;
  return (
    <section id="proyectos" className="relative bg-mist">
      <div className="container-x pt-24 sm:pt-32">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
      </div>

      {/* Pinned horizontal rail on desktop; grid on smaller screens and with reduced motion */}
      <div data-rail-section className="relative overflow-hidden py-14">
        <div className="rail-inner relative w-full">
          <ul data-rail-track className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.items.map((p, i) => {
              const media = projectMedia[p.key];
              const visual = VISUALS[p.key] ?? VISUALS.portfolios;
              const status = p.status as keyof typeof copy.status;
              return (
                <li key={p.key} data-rail-card className="rail-card">
                  <article className="spotlight group flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-2.5 transition-shadow duration-500 hover:shadow-[0_30px_80px_-30px_rgb(10_15_12/0.25)]">
                    <div className={cn("relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.25rem]", visual.bg)}>
                      {media?.screenshot ? (
                        <Image src={media.screenshot} alt={p.title} fill sizes="(min-width:1024px) 34vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      ) : (
                        <>
                          <div className="grid size-full place-items-center transition-transform duration-700 ease-out group-hover:scale-[1.05]" aria-hidden="true">
                            <MockVisual kind={visual.kind} />
                          </div>
                          <TodoBadge label={copy.screenshotTodo} className="absolute left-3 top-3" />
                        </>
                      )}
                      <span className="absolute right-3 top-3 font-mono text-[11px] text-white mix-blend-difference">
                        {String(i + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLE[status])}>{copy.status[status]}</span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{p.category}</span>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
                      <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-ink-soft">{p.outcome}</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        {media?.url ? (
                          <a href={media.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-ink">
                            {copy.visit} <ArrowUpRight className="size-4" />
                          </a>
                        ) : p.key === "ai-school" ? (
                          <a href="#caso-ia" className="inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-ink">
                            {copy.caseStudy} <ArrowUpRight className="size-4" />
                          </a>
                        ) : (
                          <TodoBadge label={copy.linkTodo} />
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <div aria-hidden="true" className="rail-progress container-x mt-10 hidden">
            <div className="h-px w-full bg-line">
              <div data-rail-progress className="h-px origin-left scale-x-0 bg-ink" />
            </div>
          </div>
        </div>
      </div>

      {/* AI receptionist case spotlight */}
      <div id="caso-ia" className="container-x pb-24 sm:pb-32">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:p-14">
          <div>
            <Eyebrow>{copy.spotlight.eyebrow}</Eyebrow>
            <SplitText as="h3" text={copy.spotlight.title} className="mt-5 text-balance text-[clamp(1.8rem,3.4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]" />
            <p data-reveal className="mt-5 text-lg leading-relaxed text-ink-soft">{copy.spotlight.body}</p>
            <ul className="mt-7 space-y-3">
              {copy.spotlight.points.map((pt) => (
                <li key={pt} data-reveal className="flex items-start gap-3 text-ink">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-ink"><Check className="size-3.5" /></span>
                  {pt}
                </li>
              ))}
            </ul>
            <div data-reveal className="mt-9">
              <LeadButton location="ai-case" need={locale === "es" ? "Agente de IA / chatbot" : "AI agent / chatbot"}>{copy.spotlight.cta}</LeadButton>
            </div>
          </div>
          <div data-reveal>
            {aiReceptionist.video ? (
              <video className="aspect-video w-full rounded-2xl bg-ink object-cover" src={aiReceptionist.video} poster={aiReceptionist.poster ?? undefined} controls playsInline preload="none" />
            ) : (
              <Placeholder label={copy.spotlight.videoTodo} className="aspect-video w-full bg-[radial-gradient(100%_100%_at_100%_0%,#19e36b33,transparent_60%),linear-gradient(160deg,#0a0f0c,#10241a)]" dark>
                <div className="flex flex-col items-center gap-3 text-white/80" aria-hidden="true">
                  <span className="grid size-16 place-items-center rounded-full bg-brand text-ink shadow-[0_0_60px_rgb(25_227_107/0.6)]">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
                  </span>
                </div>
              </Placeholder>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
