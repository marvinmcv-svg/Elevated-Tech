import { Breadcrumbs } from "./Breadcrumbs";
import { Eyebrow } from "./SectionHeader";
import { SplitText } from "./SplitText";
import { cn } from "@/lib/ui";

/** Top of every inner page: breadcrumbs, eyebrow, big title, lead, optional actions/aside. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  body,
  children,
  aside,
  dark = false,
  className,
}: {
  /** [label, href] pairs; the last one is the current page (href ignored). */
  crumbs: [string, string][];
  eyebrow: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section
      id="top"
      className={cn(
        "relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 lg:pt-36",
        dark ? "on-dark bg-night text-white" : "bg-white",
        className,
      )}
    >
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent_75%)]", dark ? "bg-grid-dark" : "bg-grid")} />
      <div aria-hidden="true" className="absolute -right-40 top-0 -z-10 size-[40rem] rounded-full bg-brand/20 blur-[120px]" />
      <div className={cn("container-x", !!aside && "grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]")}>
        <div>
          <Breadcrumbs crumbs={crumbs} dark={dark} />
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
          <SplitText
            as="h1"
            text={title}
            className={cn("mt-5 max-w-[20ch] text-balance text-[clamp(2.4rem,5.6vw,4.6rem)] font-semibold leading-[1] tracking-[-0.045em]", dark ? "text-white" : "text-ink")}
          />
          {body && (
            <p data-reveal className={cn("mt-7 max-w-2xl text-pretty text-lg leading-relaxed sm:text-xl sm:leading-relaxed", dark ? "text-white/70" : "text-ink-soft")}>
              {body}
            </p>
          )}
          {children && <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}
