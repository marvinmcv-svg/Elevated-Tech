"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { TodoBadge } from "@/components/ui/Placeholder";
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
 * ROBOT SLOT. The 3D area of the hero. Loads the WebGL scene lazily (after the page is idle)
 * on capable devices, and shows a lightweight CSS fallback everywhere else.
 * TODO(launch): Marvin's 3D robot goes inside HeroScene (see the note at the top of HeroScene.tsx).
 */
export function HeroVisual({ shared, robotLabel, className }: { shared: Shared; robotLabel: string; className?: string }) {
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
        <FallbackOrb />
      </div>
      {mode === "3d" && (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <HeroScene shared={shared} running={visible} />
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:block">
        <TodoBadge label={robotLabel} />
      </div>
    </div>
  );
}

function FallbackOrb() {
  return (
    <div className="relative aspect-square w-[62%]">
      <div className="absolute inset-[-28%] rounded-full border border-brand-ink/25 [transform:rotateX(70deg)_rotateZ(20deg)]" />
      <div className="absolute inset-[-14%] rounded-full border border-brand/50 [transform:rotateX(65deg)_rotateZ(-30deg)]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#c8ffdd_0%,#19e36b_32%,#067a37_68%,#04391c_100%)] shadow-[0_40px_120px_-20px_rgb(25_227_107/0.55)]" />
      <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_60%_70%,transparent_0_14px,rgb(4_57_28/0.18)_15px_16px)] mix-blend-multiply" />
    </div>
  );
}
