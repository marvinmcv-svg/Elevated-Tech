import type { Dictionary } from "@/content";
import { site } from "@/lib/site";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { SplitText } from "@/components/ui/SplitText";
import { LeadForm } from "@/components/lead/LeadForm";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Pin, WhatsApp } from "@/components/ui/Icons";

export function Contact({ copy }: { copy: Dictionary["contact"] }) {
  return (
    <section id="contacto" className="on-dark grain relative isolate overflow-hidden bg-night py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-dark [mask-image:radial-gradient(ellipse_60%_70%_at_20%_40%,black,transparent)]" />
      <div aria-hidden="true" data-parallax="0.3" className="absolute -left-40 top-0 -z-10 size-[40rem] rounded-full bg-brand/30 blur-[150px]" />
      <div className="container-x grid items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <Eyebrow dark>{copy.eyebrow}</Eyebrow>
          <SplitText
            text={copy.title}
            className="mt-5 text-balance text-[clamp(2.6rem,6.4vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
          />
          <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">{copy.body}</p>
          <div data-reveal className="mt-10 flex flex-col gap-4 text-white/80">
            <p className="text-sm text-white/50">{copy.direct}</p>
            <WhatsAppLink
              location="contact-direct"
              className="group inline-flex w-fit items-center gap-3 text-2xl font-semibold tracking-tight text-white transition-colors hover:text-brand"
            >
              <span className="grid size-12 place-items-center rounded-full bg-brand text-ink transition-transform duration-500 group-hover:rotate-12">
                <WhatsApp />
              </span>
              {site.whatsapp.display}
            </WhatsAppLink>
            <p className="inline-flex items-center gap-2 text-sm text-white/55">
              <Pin /> {site.locality}, {site.country}
            </p>
          </div>
        </div>
        <div data-reveal className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-9">
          <h3 className="text-2xl font-semibold tracking-tight">{copy.form.title}</h3>
          <p className="mt-1 text-white/60">{copy.form.subtitle}</p>
          <LeadForm copy={copy} location="contact-section" className="mt-7" dark />
        </div>
      </div>
    </section>
  );
}
