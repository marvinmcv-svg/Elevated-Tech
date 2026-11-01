"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/ui";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Shared = { active: number; pointer: { x: number; y: number } };

/** Decide if this device should get the full WebGL scene. */
function canRender3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * ROBOT SLOT. The 3D area of the hero. Loads the WebGL scene (El Camba, see Robot.tsx) lazily
 * after the page is idle on capable devices. Everyone else sees still renders of the same robot,
 * swapping to the active slide's outfit.
 */
/** Still renders of El Camba in each slide's outfit (camba, AI receptionist, web designer, teacher, chef). */
const POSTERS = [0, 1, 2, 3, 4].map((i) => `/robot/el-camba-${i}.webp`);

export function HeroVisual({ shared, active, className }: { shared: Shared; active: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "fallback">("pending");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!canRender3D()) {
      setMode("fallback");
      return;
    }
    const start = () => setMode("3d");
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 400);
  }, []);

  // Pause rendering while the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Fade the canvas in once it has painted a few frames.
  useEffect(() => {
    if (mode !== "3d") return;
    const t = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(t);
  }, [mode]);

  return (
    <div ref={ref} data-robot-slot className={className}>
      {/* CSS fallback / poster: also visible while the 3D chunk loads */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 grid place-items-center transition-opacity duration-1000",
          mode === "3d" && ready ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="relative size-full">
          {POSTERS.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 44rem, 95vw"
              className={cn(
                "object-contain transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-expo)]",
                i === active ? "scale-100 opacity-100" : "scale-[0.96] opacity-0",
              )}
            />
          ))}
        </div>
      </div>
      {mode === "3d" && (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <HeroScene shared={shared} running={visible} />
        </div>
      )}
    </div>
  );
}
