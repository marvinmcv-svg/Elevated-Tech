"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { categories, projects, type Category, type Project } from "@/content/portfolio";
import { events, track } from "@/lib/analytics";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { Flip } from "gsap/Flip";
import { cn } from "@/lib/ui";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { ProjectThumb } from "./ProjectThumb";

type Copy = Dictionary["projects"];
type Filter = Category | "all";
const FILTERS: Filter[] = ["all", "schools", "restaurants", "brands", "apps", "portfolios"];

export function ProjectCard({
  project,
  locale,
  copy,
  feature = false,
  index = 0,
  caseLabel,
  reveal = false,
}: {
  project: Project;
  locale: Locale;
  copy: Copy;
  feature?: boolean;
  index?: number;
  caseLabel: string;
  /** Scroll-reveal the card (when used outside the filterable grid). */
  reveal?: boolean;
}) {
  return (
    <li
      data-flip-id={project.key}
      data-reveal={reveal ? "" : undefined}
      style={{ "--i": index } as React.CSSProperties}
      className={cn("pf-item", feature && "lg:col-span-2")}
    >
      <article
        className="spotlight group relative flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-2.5 transition-[box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgb(10_15_12/0.3)]"
      >
        <div className="relative h-60 overflow-hidden rounded-[1.25rem] sm:h-64 lg:h-72">
          <div className="size-full transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.025]">
            <ProjectThumb
              project={project}
              locale={locale}
              size={feature ? "lg" : "md"}
              sizes={feature ? "(min-width: 1024px) 60vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
            />
          </div>
          <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand-ink" />
            </span>
            {copy.live}
          </span>
          <span className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex translate-y-3 items-center justify-center opacity-0 transition duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-lg">
              {caseLabel} <ArrowRight className="size-4" />
            </span>
          </span>
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted">
            <span className="text-brand-ink">{categories[project.category][locale]}</span>
            <span aria-hidden="true">·</span>
            <span>{project.type[locale]}</span>
          </div>
          <h3 className="mt-2.5 text-xl font-semibold tracking-tight text-ink">
            {/* the whole card is clickable through this link's ::after */}
            <Link href={`/${locale}/proyectos/${project.key}`} className="text-left after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-brand-ink">
              {project.name}
            </Link>
          </h3>
          <dl className="mt-3 grid flex-1 gap-2 text-[14.5px] leading-relaxed">
            <div className="flex gap-2.5">
              <dt className="mt-[3px] h-fit shrink-0 rounded-md bg-[#fff1ef] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#b42318]">{copy.problem}</dt>
              <dd className="text-muted">{project.problem[locale]}</dd>
            </div>
            <div className="flex gap-2.5">
              <dt className="mt-[3px] h-fit shrink-0 rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-deep">{copy.solution}</dt>
              <dd className="text-ink-soft">{project.solution[locale]}</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
              {caseLabel}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(events.projectVisit, { project: project.key, location: "card" })}
              className="relative z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] text-muted ring-1 ring-inset ring-line transition hover:text-ink hover:ring-ink/30"
              aria-label={`${copy.modal.openNew}: ${project.name}`}
            >
              {project.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(".vercel.app", "")}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </article>
    </li>
  );
}

export function Portfolio({ copy, locale, caseLabel, initial = projects.length }: { copy: Copy; locale: Locale; caseLabel: string; initial?: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const list = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.category === filter)), [filter]);
  const visible = filter === "all" && !expanded ? list.slice(0, initial) : list;
  const hidden = list.length - visible.length;

  const capture = () => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const { gsap } = getGsap();
    gsap.registerPlugin(Flip);
    flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-flip-id]"));
  };

  const choose = (f: Filter) => {
    if (f === filter) return;
    capture();
    setFilter(f);
    track(events.projectFilter, { filter: f });
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !gridRef.current) return;
    flipState.current = null;
    const { gsap } = getGsap();
    Flip.from(state, {
      targets: gridRef.current.querySelectorAll("[data-flip-id]"),
      duration: 0.75,
      ease: "expo.out",
      absolute: true,
      scale: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 }),
    });
    window.dispatchEvent(new Event("resize"));
  }, [filter, expanded]);

  // Sliding pill behind the active filter.
  useLayoutEffect(() => {
    const wrap = tabsRef.current;
    const btn = wrap?.querySelector<HTMLButtonElement>(`[data-filter="${filter}"]`);
    if (!wrap || !btn) return;
    const place = () => setPill({ x: btn.offsetLeft, w: btn.offsetWidth });
    place();
    const ro = new ResizeObserver(place);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [filter]);

  // Reveal the grid once on scroll (cards added later are already visible).
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-in", "");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const count = (f: Filter) => (f === "all" ? projects.length : projects.filter((p) => p.category === f).length);

  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div ref={tabsRef} role="toolbar" aria-label={copy.filterLabel} className="relative inline-flex gap-1 rounded-full bg-white p-1.5 ring-1 ring-line">
          {pill && (
            <span
              aria-hidden="true"
              className="absolute top-1.5 h-[calc(100%-0.75rem)] rounded-full bg-ink transition-[transform,width] duration-500 ease-[var(--ease-out-expo)]"
              style={{ width: pill.w, transform: `translateX(${pill.x - 6}px)`, left: 6 }}
            />
          )}
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              data-filter={f}
              aria-pressed={filter === f}
              onClick={() => choose(f)}
              className={cn(
                "relative z-10 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                filter === f ? "text-white" : "text-ink-soft hover:text-ink",
              )}
            >
              {categories[f][locale]}
              <span className={cn("font-mono text-[11px]", filter === f ? "text-brand" : "text-muted")}>{count(f)}</span>
            </button>
          ))}
        </div>
      </div>

      <ul ref={gridRef} className="pf-grid mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <ProjectCard key={p.key} project={p} locale={locale} copy={copy} index={i} caseLabel={caseLabel} feature={list.length >= 6 && (i === 0 || i === 5)} />
        ))}
      </ul>

      {hidden > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              capture();
              setExpanded(true);
            }}
            className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-[15px] font-medium text-ink ring-1 ring-line transition hover:ring-ink/30"
          >
            {copy.showMore.replace("{n}", String(list.length))}
            <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-xs text-brand transition-transform duration-500 group-hover:rotate-90">+{hidden}</span>
          </button>
        </div>
      )}
    </div>
  );
}
