import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { projects } from "@/content/portfolio";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LeadButton } from "@/components/ui/LeadButton";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsApp } from "@/components/ui/Icons";
import { Portfolio } from "@/components/portfolio/Portfolio";

export function Projects({ copy, locale }: { copy: Dictionary["projects"]; locale: Locale }) {
  return (
    <section id="proyectos" className="relative bg-mist py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title.replace("{n}", String(projects.length))} body={copy.body} />
          <p data-reveal className="flex shrink-0 items-baseline gap-3 lg:pb-2">
            <span data-count={projects.length} className="text-6xl font-semibold tracking-[-0.05em] text-ink sm:text-7xl">
              {projects.length}
            </span>
            <span className="max-w-[9rem] text-sm leading-snug text-muted">{copy.countLabel}</span>
          </p>
        </div>

        <div className="mt-12">
          <Portfolio copy={copy} locale={locale} />
        </div>

        {/* Closing CTA */}
        <div data-reveal className="on-dark relative mt-16 overflow-hidden rounded-[2rem] bg-night p-8 text-white sm:p-12 lg:mt-20">
          <div aria-hidden="true" className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_80%_at_85%_50%,black,transparent)]" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/30 blur-[120px]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{copy.cta.title}</h3>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/70">{copy.cta.body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <LeadButton location="portfolio-cta" size="lg">{copy.cta.primary}</LeadButton>
              <WhatsAppLink
                location="portfolio-cta"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 text-base font-medium text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/10"
              >
                <WhatsApp className="size-5" /> {copy.cta.secondary}
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
