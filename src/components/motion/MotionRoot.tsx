"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { lenisStore } from "@/lib/lenis";

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

/**
 * One place for all scroll motion, driven by data attributes in server-rendered markup:
 *  - [data-reveal]            fade/slide in on enter (batched + staggered)
 *  - [data-split]             word-by-word masked heading reveal (see SplitText)
 *  - [data-count="123"]       animated counter
 *  - [data-parallax="0.15"]   scroll parallax
 *  - [data-draw="x" | "y"]    line that draws with scroll progress
 *  - [data-timeline]          process timeline with the robot walking down it
 *  - .spotlight               cursor-following glow on cards
 * Everything is skipped for prefers-reduced-motion; content stays fully visible.
 */
export function MotionRoot() {
  const pathname = usePathname();

  // Smooth scrolling (Lenis) wired into GSAP's ticker.
  useEffect(() => {
    window.__motionReady = true;
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 }, autoRaf: false });
    lenisStore.set(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisStore.set(null);
    };
  }, []);

  // Cursor spotlight (works with reduced motion too: it's not movement).
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  // Client-side navigation: start the new page at the top (Lenis keeps its own scroll target).
  useEffect(() => {
    if (window.location.hash) return;
    const lenis = lenisStore.get();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.resize();
    }
  }, [pathname]);

  // Scroll-driven animations.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = getGsap();

    const ctx = gsap.context(() => {
      // 2. Reveals
      gsap.set("[data-reveal]", { y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
      });

      // 3. Split headings
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const words = el.querySelectorAll(".w > span");
        gsap.fromTo(
          words,
          { yPercent: 105, y: 0 },
          {
            yPercent: 0,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.045,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      // 4. Counters
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const obj = { v: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          v: to,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });

      // 5. Parallax
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { yPercent: speed * 50 },
          {
            yPercent: -speed * 50,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // 6. Drawn lines
      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((el) => {
        const axis = el.dataset.draw === "y" ? "scaleY" : "scaleX";
        gsap.fromTo(
          el,
          { [axis]: 0 },
          {
            [axis]: 1,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
          },
        );
      });

      // 7. Process timeline: El Camba walks down the line as you scroll, the line fills behind him
      gsap.utils.toArray<HTMLElement>("[data-timeline]").forEach((tl) => {
        const traveler = tl.querySelector<HTMLElement>("[data-traveler]");
        const fill = tl.querySelector<HTMLElement>("[data-timeline-fill]");
        const st = { trigger: tl, start: "top 55%", end: "bottom 55%", scrub: 0.5 };
        if (fill) gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
        if (traveler)
          gsap.fromTo(
            traveler,
            { y: 0 },
            { y: () => tl.offsetHeight, ease: "none", scrollTrigger: { ...st, invalidateOnRefresh: true } },
          );
      });

      // 8. Process steps light up as the traveller reaches them
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "center 55%",
          onEnter: () => el.setAttribute("data-on", "true"),
          onLeaveBack: () => el.removeAttribute("data-on"),
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
