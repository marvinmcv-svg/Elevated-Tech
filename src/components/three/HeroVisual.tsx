"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
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
    const gl = c.getContext("webgl2");
    if (!gl) return false;
    // Software rasterisers (VMs, blocklisted GPUs, Chrome's fallback) draw a few frames per second
    // and compile shaders synchronously for seconds: always use the stills there.
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
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

  // Start the 3D scene only once the page has fully loaded and the main thread is idle,
  // so it never competes with first paint, hydration or the first scroll.
  useEffect(() => {
    if (!canRender3D()) {
      setMode("fallback");
      return;
    }
    let cancelled = false;
    let idle = 0;
    const start = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(() => !cancelled && setMode("3d"), { timeout: 2500 });
      else idle = window.setTimeout(() => !cancelled && setMode("3d"), 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);

  const onReady = useCallback(() => window.setTimeout(() => setReady(true), 120), []);
  const [slow, setSlow] = useState(false);
  const onSlow = useCallback(() => {
    setSlow(true); // stop drawing right away
    setReady(false);
    window.setTimeout(() => setMode("fallback"), 1000); // after the cross-fade back to the stills
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
          <HeroScene shared={shared} running={visible && !slow} onReady={onReady} onSlow={onSlow} />
        </div>
      )}
    </div>
  );
}
