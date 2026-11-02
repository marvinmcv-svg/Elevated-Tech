import Link from "next/link";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { services, serviceUi } from "@/content/services";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { TodoBadge } from "@/components/ui/Placeholder";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Mail, Pin, WhatsApp } from "@/components/ui/Icons";

export function Footer({ locale, copy, nav }: { locale: Locale; copy: Dictionary["footer"]; nav: Dictionary["nav"] }) {
  const year = new Date().getFullYear();
  const home = `/${locale}`;
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white">
      <div className="container-x border-t border-white/10 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_0.8fr_1.1fr]">
          <div>
            <Link href={home} aria-label="Elevated Tech" className="inline-block rounded-lg">
              <Logo dark />
            </Link>
            <p className="mt-5 max-w-sm text-white/60">{copy.tagline}</p>
          </div>
          <nav aria-label={serviceUi[locale].allServices}>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">
              <Link href={`${home}/servicios`} className="transition-colors hover:text-brand">{serviceUi[locale].allServices}</Link>
            </h2>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`${home}/servicios/${s.slug}`} className="text-white/75 transition-colors hover:text-brand">{s.copy[locale].title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={copy.explore}>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">{copy.explore}</h2>
            <ul className="mt-5 space-y-3">
              {nav.items.map((i) => (
                <li key={i.href}>
                  <Link href={`${home}${i.href}`} className="text-white/75 transition-colors hover:text-brand">{i.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">{copy.contact}</h2>
            <ul className="mt-5 space-y-3 text-white/75">
              <li>
                <WhatsAppLink location="footer" className="inline-flex items-center gap-2 transition-colors hover:text-brand">
                  <WhatsApp className="size-4" /> {site.whatsapp.display}
                </WhatsAppLink>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                {/* TODO(launch): real company email once the domain is live */}
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-brand">
                  <Mail className="size-4" /> {site.email}
                </a>
                <TodoBadge label={copy.emailTodo} />
              </li>
              <li className="inline-flex items-center gap-2">
                <Pin className="size-4" /> {copy.location}
              </li>
            </ul>
          </div>
        </div>
        {/* Giant wordmark */}
        <p aria-hidden="true" className="mt-20 select-none whitespace-nowrap text-center text-[clamp(3rem,15.5vw,14rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-white/[0.06]">
          Elevated Tech
        </p>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row">
          <p>© {year} {site.name}. {copy.rights}</p>
          <p>{site.locality}, {site.country}</p>
        </div>
      </div>
    </footer>
  );
}
