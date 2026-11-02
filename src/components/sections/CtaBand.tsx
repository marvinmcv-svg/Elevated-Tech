import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { LeadButton } from "@/components/ui/LeadButton";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsApp } from "@/components/ui/Icons";
import { buttonClasses } from "@/lib/ui";

/** Green closing call-to-action used at the bottom of inner pages. */
export function CtaBand({
  locale,
  title,
  body,
  primary,
  location,
  need,
  className = "bg-white pb-24 sm:pb-32",
}: {
  locale: Locale;
  title: string;
  body: string;
  primary: string;
  location: string;
  need?: string;
  className?: string;
}) {
  const wa = getDictionary(locale).contact.message.greeting;
  return (
    <section className={className}>
      <div className="container-x">
        <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-brand px-7 py-14 text-ink sm:px-14 sm:py-20">
          <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-white/30 blur-3xl" />
          <div className="relative max-w-3xl">
            <h2 className="text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">{title}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75">{body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LeadButton location={location} need={need} variant="dark" size="lg">{primary}</LeadButton>
              <WhatsAppLink location={location} message={wa} className={buttonClasses("light", "lg")}>
                <WhatsApp className="size-5 text-[#25D366]" />
                WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
