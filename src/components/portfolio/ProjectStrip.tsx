import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { projectByKey } from "@/content/portfolio";
import { cn } from "@/lib/ui";
import { ArrowUpRight } from "@/components/ui/Icons";
import { ProjectThumb } from "./ProjectThumb";

/** Row of live projects linking to their case studies. Scrolls sideways on phones. */
export function ProjectStrip({ keys, locale, dark = false }: { keys: readonly string[]; locale: Locale; location?: string; dark?: boolean }) {
  return (
    <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] [&::-webkit-scrollbar]:hidden">
      {keys.map((k) => {
        const p = projectByKey(k);
        if (!p) return null;
        return (
          <li key={k} className="w-[72%] shrink-0 snap-start sm:w-auto">
            <Link
              href={`/${locale}/proyectos/${k}`}
              className={cn(
                "group block w-full rounded-2xl p-2 text-left transition duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1",
                dark ? "bg-white/[0.05] ring-1 ring-white/10 hover:bg-white/[0.08]" : "bg-white ring-1 ring-line hover:shadow-[0_24px_60px_-28px_rgb(10_15_12/0.35)]",
              )}
            >
              <span className="relative block h-36 overflow-hidden rounded-xl">
                <span className="block size-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105">
                  <ProjectThumb project={p} locale={locale} size="sm" chrome={false} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 72vw" />
                </span>
              </span>
              <span className="flex items-start justify-between gap-2 px-2 pb-1.5 pt-3">
                <span className="min-w-0">
                  <span className={cn("block truncate font-semibold tracking-tight", dark ? "text-white" : "text-ink")}>{p.name}</span>
                  <span className={cn("block truncate text-xs", dark ? "text-white/55" : "text-muted")}>{p.type[locale]}</span>
                </span>
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full transition-colors", dark ? "bg-white/10 text-white group-hover:bg-brand group-hover:text-ink" : "bg-mist text-ink group-hover:bg-brand")}>
                  <ArrowUpRight className="size-4" />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
