"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { projectByKey, type Category, type Project } from "@/content/portfolio";
import { events, track } from "@/lib/analytics";
import { lenisStore } from "@/lib/lenis";
import { buttonClasses, cn } from "@/lib/ui";
import { ArrowUpRight, Check, Close } from "@/components/ui/Icons";
import { LeadButton } from "@/components/ui/LeadButton";
import { ProjectCover, hostOf } from "./ProjectCover";

type Copy = Dictionary["projects"];
const Ctx = createContext<{ openPreview: (key: string, location: string) => void }>({ openPreview: () => {} });
export const usePreview = () => useContext(Ctx);

/** Which lead-form "need" each category pre-selects (indexes into contact.form.needs). */
const NEED_INDEX: Record<Category, number> = { schools: 4, restaurants: 5, brands: 0, apps: 3, portfolios: 0 };

const DESKTOP_W = 1440;
const DESKTOP_H = 900;
const PHONE_W = 390;
const PHONE_H = 844;

/** Renders the real site at its true size and scales it to fit the stage, so desktop looks like desktop. */
function LiveFrame({ project, device, loadingLabel, locale }: { project: Project; device: "desktop" | "mobile"; loadingLabel: string; locale: Locale }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const w = device === "desktop" ? DESKTOP_W : PHONE_W;
  const h = device === "desktop" ? DESKTOP_H : PHONE_H;

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => {
      const pad = device === "desktop" ? 0 : 24;
      const chrome = device === "desktop" ? 36 : 16;
      const s = Math.min((el.clientWidth - pad) / w, (el.clientHeight - pad - chrome) / h, device === "mobile" ? 1 : 10);
      setScale(Math.max(0.1, s));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [device, w, h]);

  useEffect(() => setLoaded(false), [project.key, device]);

  const frameW = w * scale;
  const frameH = h * scale;

  return (
    <div ref={stageRef} className="relative grid size-full place-items-center overflow-hidden">
      {scale > 0 && (
        <div
          className={cn(
            "pv-device relative overflow-hidden bg-white shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7)]",
            device === "desktop" ? "rounded-xl" : "rounded-[2.6rem] border-[8px] border-[#111]",
          )}
          style={{ width: frameW + (device === "mobile" ? 16 : 0), height: frameH + (device === "desktop" ? 36 : 16) }}
        >
          {device === "desktop" && (
            <div className="flex h-9 items-center gap-1.5 border-b border-line bg-mist px-3">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto truncate rounded-md bg-white px-3 py-0.5 font-mono text-[11px] text-muted ring-1 ring-line">{hostOf(project.url)}</span>
            </div>
          )}
          <iframe
            key={`${project.key}-${device}`}
            src={project.url}
            title={project.name}
            onLoad={() => setLoaded(true)}
            className="absolute left-0 origin-top-left border-0 bg-white"
            style={{ width: w, height: h, transform: `scale(${scale})`, top: device === "desktop" ? 36 : 0 }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div
            aria-hidden={loaded}
            className={cn(
              "pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-700",
              device === "desktop" && "top-9",
              loaded ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="absolute inset-0">
              <ProjectCover project={project} locale={locale} />
            </div>
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-ink/80 px-4 py-2 text-sm text-white backdrop-blur">
              <span className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-brand" />
              {loadingLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function PreviewProvider({
  children,
  copy,
  locale,
  needs,
}: {
  children: React.ReactNode;
  copy: Copy;
  locale: Locale;
  needs: string[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const m = copy.modal;

  const openPreview = useCallback((key: string, location: string) => {
    const p = projectByKey(key);
    if (!p) return;
    track(events.projectPreview, { project: key, location });
    // Sites that refuse to be framed open straight in a new tab.
    if (!p.embed) {
      window.open(p.url, "_blank", "noopener,noreferrer");
      track(events.projectVisit, { project: key, location });
      return;
    }
    const small = window.matchMedia("(max-width: 1023px)").matches;
    setDevice(small || p.cover.device === "phone" ? "mobile" : "desktop");
    setProject(p);
    const d = dialogRef.current;
    if (d && !d.open) {
      d.showModal();
      lenisStore.get()?.stop();
    }
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      lenisStore.get()?.start();
      setProject(null);
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const close = () => dialogRef.current?.close();
  const need = project ? needs[NEED_INDEX[project.category]] : undefined;

  return (
    <Ctx.Provider value={{ openPreview }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="preview-title"
        className="preview-dialog m-0 h-[100dvh] max-h-none w-screen max-w-none bg-night p-0 text-white sm:m-auto sm:h-[calc(100dvh-1.5rem)] sm:w-[calc(100vw-1.5rem)] sm:rounded-[1.75rem]"
      >
        {project && (
          <div className="flex h-full flex-col">
            {/* top bar */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-brand">{project.type[locale]}</p>
                <h2 id="preview-title" className="truncate text-lg font-semibold tracking-tight sm:text-xl">{project.name}</h2>
              </div>
              <div role="group" aria-label={m.device} className="hidden rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10 sm:flex">
                {(["desktop", "mobile"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={device === d}
                    onClick={() => setDevice(d)}
                    className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium transition", device === d ? "bg-white text-ink" : "text-white/70 hover:text-white")}
                  >
                    {d === "desktop" ? m.desktop : m.mobile}
                  </button>
                ))}
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(events.projectVisit, { project: project.key, location: "preview" })}
                className="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-white/80 ring-1 ring-inset ring-white/15 transition hover:bg-white/10 hover:text-white md:inline-flex"
              >
                {m.openNew} <ArrowUpRight className="size-4" />
              </a>
              <button type="button" onClick={close} aria-label={m.close} className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
                <Close />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_22rem]">
              {/* stage */}
              <div className="relative min-h-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgb(25_227_107/0.12),transparent_70%)] p-3 sm:p-6">
                <LiveFrame project={project} device={device} loadingLabel={m.loading} locale={locale} />
              </div>

              {/* case study */}
              <aside className="hidden min-h-0 overflow-y-auto border-l border-white/10 p-6 lg:block" data-lenis-prevent>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{copy.problem}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/80">{project.problem[locale]}</p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-brand">{copy.solution}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white">{project.solution[locale]}</p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{m.highlights}</p>
                <ul className="mt-3 space-y-2.5">
                  {project.highlights[locale].map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm text-white/85">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-ink"><Check className="size-3" /></span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10">
                  <p className="font-semibold">{m.cta}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{m.ctaBody}</p>
                  <LeadButton location={`preview:${project.key}`} need={need} className="mt-4 w-full" magnetic={false}>
                    {copy.cta.primary}
                  </LeadButton>
                </div>
              </aside>
            </div>

            {/* mobile action bar */}
            <div className="flex items-center gap-2 border-t border-white/10 p-3 lg:hidden">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(events.projectVisit, { project: project.key, location: "preview-mobile" })}
                className={cn(buttonClasses("light", "md"), "shrink-0 px-4")}
                aria-label={m.openNew}
              >
                <ArrowUpRight className="size-4" />
              </a>
              <LeadButton location={`preview-mobile:${project.key}`} need={need} className="flex-1" magnetic={false}>
                {copy.cta.primary}
              </LeadButton>
            </div>
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}
