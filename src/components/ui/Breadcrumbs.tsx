import Link from "next/link";
import { cn } from "@/lib/ui";

/** [label, href] pairs; the last one is the current page. */
export function Breadcrumbs({ crumbs, dark = false, className }: { crumbs: [string, string][]; dark?: boolean; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-8 font-mono text-xs", dark ? "text-white/50" : "text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map(([label, href], i) =>
          i === crumbs.length - 1 ? (
            <li key={label + i} aria-current="page" className={dark ? "text-white" : "text-ink"}>{label}</li>
          ) : (
            <li key={label + i} className="flex items-center gap-2">
              <Link href={href} className={dark ? "hover:text-white" : "hover:text-ink"}>{label}</Link>
              <span aria-hidden="true">/</span>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
