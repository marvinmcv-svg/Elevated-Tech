import { cn } from "@/lib/ui";

/**
 * TODO(launch): LOGO SLOT.
 * Marvin will upload the real logo. Drop the file at /public/brand/logo.svg (and logo-white.svg
 * for dark backgrounds), then replace the <svg> mark + wordmark below with:
 *   <Image src={dark ? "/brand/logo-white.svg" : "/brand/logo.svg"} alt="Elevated Tech" width={160} height={32} priority />
 * Until then this is a text wordmark placeholder.
 */
export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 whitespace-nowrap", className)} data-logo-slot="placeholder">
      <span
        aria-hidden="true"
        className={cn(
          "relative grid size-8 place-items-center rounded-[10px]",
          dark ? "bg-brand text-ink" : "bg-ink text-brand",
        )}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 15 7-7 7 7" />
          <path d="m8 19 4-4 4 4" opacity="0.55" />
        </svg>
      </span>
      <span className={cn("text-[17px] font-semibold tracking-[-0.02em]", dark ? "text-white" : "text-ink")}>
        Elevated<span className={dark ? "text-brand" : "text-brand-ink"}> Tech</span>
      </span>
    </span>
  );
}
