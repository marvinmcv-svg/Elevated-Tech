"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { services, serviceUi } from "@/content/services";
import { ArrowUpRight, ServiceIcon } from "@/components/ui/Icons";

/**
 * Premium service cards:
 *  - rise in with a soft 3D flip, staggered, the first time the grid scrolls into view
 *  - tilt toward the cursor with a moving light and a glowing edge
 *  - each card is a link to its own service page
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
      el.dataset.in = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.12 },
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
    <ul ref={grid} className="svc-grid mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s, i) => {
        const c = s.copy[locale];
        return (
          <li key={s.key} className="svc-card" style={{ "--i": i } as React.CSSProperties}>
            <a
              href={`/${locale}/servicios/${s.slug}`}
              className="svc-inner group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white p-6 outline-none sm:p-7"
            >
              {/* moving light + glowing edge */}
              <span aria-hidden="true" className="svc-light" />
              <span aria-hidden="true" className="svc-edge" />
              {/* oversized index in the background */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-5 -right-2 select-none font-semibold leading-none tracking-[-0.06em] text-ink/[0.03] transition-all duration-700 [font-size:6.5rem] group-hover:-translate-y-2 group-hover:text-brand/[0.14]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-mist text-ink transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:bg-brand group-hover:shadow-[0_12px_30px_-10px_rgb(25_227_107/0.8)]">
                  <ServiceIcon name={s.key} />
                </span>
                <span className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>

              <h3 className="relative mt-8 text-xl font-semibold tracking-tight text-ink">{c.title}</h3>
              <p className="relative mt-2 text-[15px] leading-relaxed text-ink-soft">{c.short}</p>

              <div className="relative mt-5 flex-1">
                <p className="rounded-2xl bg-mist/80 p-3.5 text-[13.5px] leading-snug text-ink-soft transition-colors duration-500 group-hover:bg-brand-50">
                  <span className="mb-1 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#b45309]">
                    <span className="size-1.5 rounded-full bg-[#f59e0b]" />
                    {ui.costLabel}
                  </span>
                  {c.cost}
                </p>
              </div>

              <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="text-sm font-medium leading-snug text-brand-ink">{c.outcome}</span>
                <span className="relative shrink-0 overflow-hidden whitespace-nowrap text-sm font-medium text-ink">
                  <span className="block transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-full">
                    {ui.viewService}
                  </span>
                  <span aria-hidden="true" className="absolute inset-0 block translate-y-full text-brand-ink transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-y-0">
                    {ui.viewService}
                  </span>
                </span>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
