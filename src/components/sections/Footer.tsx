import type { Dictionary } from "@/content";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { TodoBadge } from "@/components/ui/Placeholder";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Mail, Pin, WhatsApp } from "@/components/ui/Icons";

export function Footer({ copy, nav, base = "" }: { copy: Dictionary["footer"]; nav: Dictionary["nav"]; base?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white">
      <div className="container-x border-t border-white/10 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-sm text-white/60">{copy.tagline}</p>
          </div>
          <nav aria-label={copy.explore}>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">{copy.explore}</h2>
            <ul className="mt-5 space-y-3">
              {nav.items.map((i) => (
                <li key={i.id}>
                  <a href={`${base}#${i.id}`} className="text-white/75 transition-colors hover:text-brand">{i.label}</a>
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
