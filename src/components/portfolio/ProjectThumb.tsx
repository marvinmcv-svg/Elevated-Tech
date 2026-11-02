import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { screenshotsOf, type Project } from "@/content/portfolio";
import { cn } from "@/lib/ui";
import { ProjectCover, hostOf } from "./ProjectCover";

/**
 * Project thumbnail: the real screenshot of the live site (desktop in a slim browser frame,
 * or the phone shot in a phone frame for app-style projects), optimised by next/image.
 * Falls back to the illustrated cover in the client's colours until a screenshot exists.
 */
export function ProjectThumb({
  project,
  locale,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  size = "md",
  chrome = true,
}: {
  project: Project;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
  /** Show the browser bar above desktop screenshots. */
  chrome?: boolean;
}) {
  const shot = screenshotsOf(project.key);
  const c = project.cover;
  const phone = c.device === "phone";

  if (phone && shot.mobile)
    return (
      <div
        style={{ "--c-bg": c.bg, "--c-ac": c.accent } as React.CSSProperties}
        className="relative size-full overflow-hidden bg-[radial-gradient(120%_90%_at_50%_120%,color-mix(in_oklab,var(--c-ac)_45%,transparent),transparent_60%),linear-gradient(160deg,color-mix(in_oklab,var(--c-bg)_75%,#fff)_0%,var(--c-bg)_100%)]"
      >
        <div className="absolute left-1/2 top-[8%] aspect-[390/844] h-[125%] -translate-x-1/2 rounded-[2rem] bg-[#111] p-[5px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)]">
          <div className="relative size-full overflow-hidden rounded-[1.7rem] bg-white">
            <Image src={shot.mobile} alt="" fill sizes="240px" priority={priority} className="object-cover object-top" />
          </div>
        </div>
      </div>
    );

  const src = shot.desktop ?? (phone ? undefined : shot.mobile);
  if (!src) return <ProjectCover project={project} locale={locale} size={size} />;

  return (
    <div style={{ backgroundColor: c.bg }} className="relative size-full overflow-hidden">
      {chrome && (
        <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center gap-1.5 border-b border-black/5 bg-[#f4f6f5] px-3">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 truncate rounded bg-white px-2 py-px font-mono text-[10px] text-muted ring-1 ring-black/5">{hostOf(project.url)}</span>
        </div>
      )}
      <div className={cn("absolute inset-x-0 bottom-0", chrome ? "top-7" : "top-0")}>
        <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}
