import { showPlaceholders } from "@/lib/site";
import { cn } from "@/lib/ui";

/**
 * Clearly marked slot for real content Marvin will supply before launch.
 * Search the codebase for "<Placeholder" or "TODO(launch)" to find every slot.
 * Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=false to hide the yellow badges in previews.
 */
export function Placeholder({
  label,
  className,
  children,
  dark = false,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      data-placeholder={label}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl",
        showPlaceholders && "border border-dashed",
        showPlaceholders && (dark ? "border-white/25" : "border-ink/20"),
        className,
      )}
    >
      {children}
      {showPlaceholders && <TodoBadge label={label} className="absolute left-3 top-3" />}
    </div>
  );
}

export function TodoBadge({ label, className }: { label: string; className?: string }) {
  if (!showPlaceholders) return null;
  return (
    <span
      className={cn(
        "z-10 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-todo px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase leading-none tracking-wide text-ink shadow-sm",
        className,
      )}
    >
      <span aria-hidden="true">●</span>
      <span className="truncate">TODO · {label}</span>
    </span>
  );
}
