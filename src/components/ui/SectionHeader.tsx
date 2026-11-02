import { cn } from "@/lib/ui";
import { SplitText } from "./SplitText";

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      data-reveal
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em]",
        dark ? "text-brand" : "text-brand-ink",
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-6", dark ? "bg-brand" : "bg-brand-ink")} />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
  dark = false,
  align = "left",
  className,
  as = "h2",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <SplitText
        as={as}
        text={title}
        className={cn(
          "mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]",
          dark ? "text-white" : "text-ink",
        )}
      />
      {body && (
        <p
          data-reveal
          className={cn("mt-5 max-w-2xl text-pretty text-lg leading-relaxed", dark ? "text-white/70" : "text-ink-soft", align === "center" && "mx-auto")}
        >
          {body}
        </p>
      )}
    </div>
  );
}
