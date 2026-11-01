"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { services, serviceUi } from "@/content/services";
import { ArrowUpRight, ServiceIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/ui";
import { ServiceVisual } from "./ServiceVisuals";

const BIG = new Set(["web", "ai", "content", "social"]);
const TINT: Record<string, string> = {
  web: "25 227 107",
  ai: "25 227 107",
  automation: "45 212 191",
  apps: "163 230 53",
  systems: "16 185 129",
  ux: "124 156 255",
  content: "245 158 11",
  social: "255 77 109",
};

/**
 * Premium service cards:
 *  - rise in with a soft 3D flip, staggered, the first time the grid scrolls into view
 *  - tilt toward the cursor with a moving light and a glowing edge
 *  - each card is a link to its own service page
 *  - each card has its own animated scene (ServiceVisuals), running only while on screen
 * With prefers-reduced-motion there is no tilt and no entrance motion.
 */
export function ServiceCards({ locale }: { locale: Locale }) {
  const grid = useRef<HTMLUListElement>(null);
  const ui = serviceUi[locale];

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      if (!reduce) el.dataset.live = "true";
      el.dataset.in = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.dataset.in = "true";
        if (e.isIntersecting) el.dataset.live = "true";
        else delete el.dataset.live;
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    if (!window.matchMedia("(pointer: fine)").matches) return () => io.disconnect();

    // Pointer tilt + light, batched per frame
    let raf = 0;
    let target: HTMLElement | null = null;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      if (!target) return;
      const r = target.getBoundingClientRect();
      const x = (px - r.left) / r.width;
      const y = (py - r.top) / r.height;
      target.style.setProperty("--mx", `${x * 100}%`);
      target.style.setProperty("--my", `${y * 100}%`);
      target.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
      target.style.setProperty("--rx", `${(0.5 - y) * 9}deg`);
    };
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".svc-card");
      if (target && card !== target) reset(target);
      target = card;
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = (c: HTMLElement) => {
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    };
    const onLeave = () => {
      if (target) reset(target);
      target = null;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <ul ref={grid} className="svc-grid mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s, i) => {
        const c = s.copy[locale];
        const big = BIG.has(s.key);
        return (
          <li key={s.key} className={cn("svc-card", big && "sm:col-span-2")} style={{ "--i": i, "--tint": TINT[s.key] } as React.CSSProperties}>
            <a
              href={`/${locale}/servicios/${s.slug}`}
              className="svc-inner group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-[#0b140f] outline-none ring-1 ring-inset ring-white/10"
            >
              <span aria-hidden="true" className="svc-border" />
              <span aria-hidden="true" className="svc-light" />

              {/* animated scene */}
              <div className={cn("svc-stage relative overflow-hidden border-b border-white/[0.06]", big ? "h-64" : "h-56")}>
                <ServiceVisual kind={s.key} locale={locale} />
                <span aria-hidden="true" className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] text-white/55 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-brand ring-1 ring-inset ring-white/10 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:-rotate-6 group-hover:bg-brand group-hover:text-ink group-hover:shadow-[0_12px_30px_-10px_rgb(25_227_107/0.8)]">
                      <ServiceIcon name={s.key} />
                    </span>
                    <h3 className="text-lg font-semibold leading-tight tracking-tight text-white sm:text-xl">{c.title}</h3>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <p className={cn("mt-3 text-[15px] leading-relaxed text-white/65", big && "max-w-[34rem]")}>{c.short}</p>
                <p className="mt-4 flex items-start gap-2 text-[13px] leading-snug text-white/50">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#f59e0b]" />
                  <span>
                    <span className="font-medium text-[#fbbf24]">{ui.costLabel}: </span>
                    {c.cost}
                  </span>
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-[13px] font-medium text-brand ring-1 ring-inset ring-brand/25">{c.outcome}</span>
                  <span className="relative shrink-0 overflow-hidden whitespace-nowrap text-sm font-medium text-white/80">
                    <span className="block transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-full">{ui.viewService}</span>
                    <span aria-hidden="true" className="absolute inset-0 block translate-y-full text-brand transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-y-0">
                      {ui.viewService}
                    </span>
                  </span>
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
