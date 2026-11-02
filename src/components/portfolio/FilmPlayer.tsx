"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { events, track } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/ui";
import { Pause, Play } from "@/components/ui/Icons";

type Chapter = { at: number; label: { es: string; en: string } };
type Film = {
  src: { es: string; en: string };
  poster: { es: string; en: string };
  duration: number;
  chapters: readonly Chapter[];
};

/**
 * Plays a HyperFrames film (rendered MP4, no sound) like a product demo:
 * autoplays muted while on screen, pauses off screen, chapter chips you can jump to,
 * and a progress bar per chapter. Reduced motion: never autoplays.
 */
export function FilmPlayer({
  film,
  locale,
  id,
  labels,
  dark = false,
  className,
}: {
  film: Film;
  locale: Locale;
  id: string;
  labels: { play: string; pause: string; chapters: string; caption: string };
  dark?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const tracked = useRef(false);

  // Autoplay while visible.
  useEffect(() => {
    const v = videoRef.current;
    const wrap = wrapRef.current;
    if (!v || !wrap || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  // Progress (rAF while playing, so the bars move smoothly).
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const loop = () => {
      const v = videoRef.current;
      if (v) setT(v.currentTime);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const seek = (at: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = at + 0.01;
    setT(at);
    userPaused.current = false;
    v.play().catch(() => {});
  };

  const chapters = film.chapters;
  const active = chapters.reduce((acc, c, i) => (t >= c.at ? i : acc), 0);

  return (
    <div className={cn("relative", className)}>
      <div ref={wrapRef} className="group/film relative overflow-hidden rounded-[1.5rem] bg-night shadow-[0_50px_120px_-40px_rgb(0_0_0/0.6)] ring-1 ring-white/10 sm:rounded-[1.75rem]">
        <video
          ref={videoRef}
          id={id}
          className="block aspect-video w-full object-cover"
          poster={film.poster[locale]}
          muted
          playsInline
          loop
          preload="metadata"
          aria-label={labels.caption}
          onPlay={() => {
            setPlaying(true);
            if (!tracked.current) {
              tracked.current = true;
              track(events.filmPlay, { film: id });
            }
          }}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => !playing && setT(e.currentTarget.currentTime)}
        >
          <source src={film.src[locale]} type="video/mp4" />
          <source src={film.src[locale].replace(".mp4", ".webm")} type="video/webm" />
        </video>
        {/* play / pause */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? labels.pause : labels.play}
          aria-controls={id}
          className={cn(
            "absolute inset-0 grid place-items-center transition-opacity duration-500",
            playing ? "opacity-0 hover:opacity-100 focus-visible:opacity-100" : "bg-night/30 opacity-100",
          )}
        >
          <span className="grid size-16 place-items-center rounded-full bg-brand text-ink shadow-[0_0_60px_rgb(25_227_107/0.55)] transition-transform duration-300 group-hover/film:scale-105 sm:size-20">
            {playing ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" />}
          </span>
        </button>
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-night/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/80 backdrop-blur sm:left-4 sm:top-4">
          <span className={cn("size-1.5 rounded-full", playing ? "animate-pulse bg-brand" : "bg-white/50")} />
          {labels.caption}
        </span>
      </div>

      {/* chapters */}
      <ol aria-label={labels.chapters} className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2">
        {chapters.map((c, i) => {
          const end = chapters[i + 1]?.at ?? film.duration;
          const p = Math.min(1, Math.max(0, (t - c.at) / (end - c.at)));
          return (
            <li key={c.at}>
              <button type="button" onClick={() => seek(c.at)} className="group/ch w-full text-left" aria-current={i === active ? "step" : undefined}>
                <span className={cn("block h-1 overflow-hidden rounded-full", dark ? "bg-white/15" : "bg-ink/10")}>
                  <span className="block h-full origin-left rounded-full bg-brand" style={{ transform: `scaleX(${i < active ? 1 : i === active ? p : 0})` }} />
                </span>
                <span
                  className={cn(
                    "mt-2 block truncate text-[11px] font-medium transition-colors sm:text-xs",
                    i === active ? (dark ? "text-white" : "text-ink") : dark ? "text-white/45 group-hover/ch:text-white/80" : "text-muted group-hover/ch:text-ink",
                  )}
                >
                  <span className="hidden font-mono sm:inline">{String(i + 1).padStart(2, "0")} · </span>
                  {c.label[locale]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
