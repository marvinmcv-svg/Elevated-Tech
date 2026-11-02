"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { HeroVisual } from "@/components/three/HeroVisual";
import { LeadButton } from "@/components/ui/LeadButton";
import { Pause, Play } from "@/components/ui/Icons";
import { events, track } from "@/lib/analytics";
import { buttonClasses, cn } from "@/lib/ui";

const DURATION = 7500;
/** Which lead-form "need" each slide's CTA pre-selects (index into contact.form.needs). */
const NEED_FOR_SLIDE: Array<number | undefined> = [undefined, 1, 0, 4, 5];

export function Hero({ copy, needs, locale }: { copy: Dictionary["hero"]; needs: string[]; locale: Locale }) {
  const slides = copy.slides;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [cycle, setCycle] = useState(0);
  const shared = useRef({ active: 0, pointer: { x: 0, y: 0 } });
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    shared.current.active = active;
  }, [active]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const go = useCallback(
    (i: number, source: "user" | "auto" = "user") => {
      const next = (i + slides.length) % slides.length;
      setActive(next);
      setCycle((c) => c + 1);
      if (source === "user") track(events.heroSlideChange, { slide: next + 1 });
    },
    [slides.length],
  );

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    let target: number | null = null;
    if (e.key === "ArrowRight") target = i + 1;
    if (e.key === "ArrowLeft") target = i - 1;
    if (e.key === "Home") target = 0;
    if (e.key === "End") target = slides.length - 1;
    if (target === null) return;
    e.preventDefault();
    const n = (target + slides.length) % slides.length;
    go(n);
    tabsRef.current[n]?.focus();
  };

  const paused = !playing || hover || focusWithin || hidden;

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={copy.tablist}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-white pt-20 lg:pt-24"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        shared.current.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        shared.current.pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      }}
    >
      {/* Background: technical grid fading out + soft brand glow */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_80%_60%_at_70%_40%,black,transparent_75%)]" />
      <div aria-hidden="true" className="absolute -right-40 top-10 -z-10 size-[42rem] rounded-full bg-brand/20 blur-[120px]" />
      <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 size-[28rem] rounded-full bg-brand-100 blur-[100px]" />

      <div className="container-x relative grid flex-1 items-center gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-4">
        {/* Slides */}
        <div
          className="relative z-10 grid py-6 lg:py-8"
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          onFocus={() => setFocusWithin(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
          }}
        >
          {slides.map((s, i) => {
            const isActive = i === active;
            const Heading = i === 0 ? "h1" : "h2";
            const words = s.title.split(" ");
            const needIndex = NEED_FOR_SLIDE[i];
            return (
              <div
                key={i}
                id={`hero-panel-${i}`}
                role="tabpanel"
                aria-roledescription="slide"
                aria-labelledby={`hero-tab-${i}`}
                aria-hidden={!isActive}
                inert={!isActive}
                data-active={isActive}
                data-first={i === 0 && cycle === 0}
                className="slide col-start-1 row-start-1"
              >
                <p data-stagger style={{ "--i": 0 } as React.CSSProperties} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-ink-soft backdrop-blur">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand" />
                  </span>
                  {s.eyebrow}
                </p>
                <Heading className="mt-6 max-w-[17ch] text-[clamp(2.6rem,min(6.2vw,9.5svh),5.25rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-ink" aria-label={s.title}>
                  {words.map((w, wi) => (
                    <span key={wi} aria-hidden="true">
                      <span className="hw">
                        <span style={{ "--i": wi } as React.CSSProperties}>{w}</span>
                      </span>
                      {wi < words.length - 1 ? " " : null}
                    </span>
                  ))}
                </Heading>
                <p data-stagger style={{ "--i": 3 } as React.CSSProperties} className="mt-5 max-w-[34rem] text-pretty text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed">
                  {s.body}
                </p>
                <div data-stagger style={{ "--i": 4 } as React.CSSProperties} className="mt-8 flex flex-wrap items-center gap-3">
                  <LeadButton location={`hero-${i + 1}`} need={needIndex !== undefined ? needs[needIndex] : undefined} size="lg">
                    {s.primary}
                  </LeadButton>
                  <Link href={`/${locale}${s.secondary.href}`} className={buttonClasses("ghost", "lg")}>
                    {s.secondary.label}
                  </Link>
                </div>
                <ul data-stagger style={{ "--i": 5 } as React.CSSProperties} className="mt-8 flex flex-wrap gap-2 [@media(max-height:760px)]:hidden" aria-label={s.eyebrow}>
                  {s.chips.map((c) => (
                    <li key={c} className="rounded-full bg-mist px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-ink-soft">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* 3D / robot slot. On mobile it sits behind the copy, softened for readability. */}
        <HeroVisual
          shared={shared.current}
          active={active}
          className="pointer-events-none absolute -right-[38%] -top-6 aspect-square w-[95%] opacity-45 sm:-right-[20%] sm:w-[70%] lg:pointer-events-auto lg:relative lg:right-auto lg:top-auto lg:h-[min(calc(100svh-13rem),44rem)] lg:w-auto lg:max-w-full lg:justify-self-end lg:opacity-100"
        />
      </div>

      {/* Slide navigation */}
      <div className="container-x relative z-10 pb-6 lg:pb-8" data-paused={paused}>
        <div className="flex items-stretch gap-2 border-t border-line pt-4">
          <div role="tablist" aria-label={copy.tablist} className="-mx-1 flex flex-1 snap-x gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {slides.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  id={`hero-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`hero-panel-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "group relative min-w-[8.5rem] flex-1 snap-start rounded-xl px-3 pb-3 pt-2.5 text-left transition-colors duration-300",
                    isActive ? "bg-mist" : "hover:bg-mist/70",
                  )}
                >
                  <span className={cn("block font-mono text-[11px] transition-colors", isActive ? "text-brand-ink" : "text-muted")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("mt-0.5 block text-sm font-medium transition-colors", isActive ? "text-ink" : "text-ink-soft group-hover:text-ink")}>
                    {s.tab}
                  </span>
                  <span aria-hidden="true" className="absolute inset-x-3 bottom-1.5 h-[2px] overflow-hidden rounded-full bg-line">
                    {isActive && (
                      <span
                        key={cycle}
                        className={cn("tab-progress absolute inset-0 rounded-full bg-brand", !playing && "!animate-none ![transform:scaleX(1)]")}
                        style={{ "--duration": `${DURATION}ms` } as React.CSSProperties}
                        onAnimationEnd={() => go(active + 1, "auto")}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? copy.pause : copy.play}
            className="grid w-11 shrink-0 place-items-center rounded-xl text-ink-soft transition hover:bg-mist hover:text-ink"
          >
            {playing ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
    </section>
  );
}
