import type { Project } from "@/content/portfolio";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/ui";

const FACES: Record<Project["cover"]["face"], string> = {
  sans: "font-sans font-semibold tracking-[-0.035em]",
  serif: "face-serif font-normal tracking-[-0.02em]",
  display: "font-sans font-extrabold uppercase tracking-[-0.045em] leading-[0.92]",
  mono: "font-mono font-medium tracking-[-0.02em]",
};

export const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

/**
 * Illustrated cover in the client's own colours, with the real headline of the live site.
 * Pure HTML/CSS (no image downloads); `live` slots the real site on top when hovered.
 */
export function ProjectCover({
  project,
  locale,
  live,
  size = "md",
}: {
  project: Project;
  locale: Locale;
  live?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const c = project.cover;
  const style = { "--c-bg": c.bg, "--c-fg": c.fg, "--c-ac": c.accent } as React.CSSProperties;
  const headline = c.headline[locale];

  if (c.device === "phone")
    return (
      <div style={style} className="pc relative size-full overflow-hidden bg-[radial-gradient(120%_90%_at_50%_120%,color-mix(in_oklab,var(--c-ac)_55%,transparent),transparent_60%),linear-gradient(160deg,color-mix(in_oklab,var(--c-bg)_70%,#fff)_0%,var(--c-bg)_100%)]">
        <span aria-hidden="true" className="pc-orb absolute -left-10 top-6 size-40 rounded-full bg-[var(--c-ac)] opacity-25 blur-3xl" />
        <div className="pc-device absolute left-1/2 top-[9%] aspect-[9/19] h-[118%] -translate-x-1/2 rounded-[2.1rem] bg-[#111] p-[5px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)]">
          <div className="relative size-full overflow-hidden rounded-[1.8rem] bg-[var(--c-bg)] text-[var(--c-fg)]">
            <span aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-4 w-14 -translate-x-1/2 rounded-full bg-[#111]" />
            <div className="flex h-full flex-col px-4 pb-4 pt-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--c-ac)]">{c.kicker[locale]}</p>
              <p className={cn("mt-2 text-balance text-[1.05rem] leading-[1.08]", FACES[c.face])}>{headline}</p>
              <div className="mt-4 grid gap-1.5">
                <span className="pc-row h-9 rounded-xl bg-[color-mix(in_oklab,var(--c-fg)_8%,transparent)]" />
                <span className="pc-row h-9 rounded-xl bg-[color-mix(in_oklab,var(--c-fg)_8%,transparent)] [animation-delay:.15s]" />
                <span className="pc-row h-9 rounded-xl bg-[var(--c-ac)] [animation-delay:.3s]" />
              </div>
            </div>
            {live}
          </div>
        </div>
      </div>
    );

  return (
    <div style={style} className="pc relative size-full overflow-hidden bg-[var(--c-bg)] text-[var(--c-fg)]">
      <span aria-hidden="true" className="pc-orb absolute -right-16 -top-20 size-64 rounded-full bg-[var(--c-ac)] opacity-30 blur-3xl" />
      {c.mark && (
        <span aria-hidden="true" className={cn("absolute -bottom-[0.18em] right-3 select-none font-extrabold leading-none tracking-[-0.06em] text-[var(--c-fg)] opacity-[0.07]", size === "lg" ? "text-[13rem]" : "text-[9rem]")}>
          {c.mark}
        </span>
      )}
      {/* browser chrome */}
      <div className="relative flex h-8 items-center gap-1.5 border-b border-[color-mix(in_oklab,var(--c-fg)_12%,transparent)] px-3">
        <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--c-fg)_25%,transparent)]" />
        <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--c-fg)_25%,transparent)]" />
        <span className="size-2 rounded-full bg-[color-mix(in_oklab,var(--c-fg)_25%,transparent)]" />
        <span className="ml-3 truncate rounded-md bg-[color-mix(in_oklab,var(--c-fg)_8%,transparent)] px-2.5 py-0.5 font-mono text-[10px] opacity-70">{hostOf(project.url)}</span>
      </div>
      <div className={cn("relative flex h-[calc(100%-2rem)] flex-col justify-end", size === "lg" ? "p-7 sm:p-9" : size === "sm" ? "p-4" : "p-5 sm:p-6")}>
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--c-ac)]">{c.kicker[locale]}</p>
        <p className={cn("mt-2 max-w-[18ch] text-balance", FACES[c.face], size === "lg" ? "text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.02]" : size === "sm" ? "line-clamp-3 text-[1.05rem] leading-[1.08]" : "text-[clamp(1.25rem,2.1vw,1.6rem)] leading-[1.04]")}>{headline}</p>
        <div className={cn("mt-4 flex items-center gap-2", size === "sm" && "hidden")}>
          <span className="pc-cta h-7 w-24 rounded-full bg-[var(--c-ac)]" />
          <span className="h-7 w-16 rounded-full ring-1 ring-inset ring-[color-mix(in_oklab,var(--c-fg)_25%,transparent)]" />
        </div>
      </div>
      {live}
    </div>
  );
}
