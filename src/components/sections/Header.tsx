"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { LOCALE_COOKIE } from "@/lib/i18n";
import { events, track } from "@/lib/analytics";
import { lenisStore } from "@/lib/lenis";
import { cn } from "@/lib/ui";
import { Logo } from "@/components/ui/Logo";
import { LeadButton } from "@/components/ui/LeadButton";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Close, Menu, WhatsApp } from "@/components/ui/Icons";

export function Header({
  locale,
  nav,
  a11y,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "es" ? "en" : "es";
  const pathname = usePathname() || `/${locale}`;
  // Same page in the other language (all slugs are shared between languages).
  const altHref = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);
  const home = `/${locale}`;
  const isActive = (href: string) => pathname === `${home}${href}` || pathname.startsWith(`${home}${href}/`);

  // Close the mobile menu after navigating, and go solid when the page starts on a dark section.
  const [darkTop, setDarkTop] = useState(false);
  useEffect(() => {
    setOpen(false);
    setDarkTop(!!document.querySelector("#main > section:first-child.on-dark"));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = lenisStore.get();
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const switchLanguage = () => {
    document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=31536000; samesite=lax`;
    track(events.languageSwitch, { from: locale, to: other });
  };

  const LangToggle = ({ className }: { className?: string }) => (
    <a
      href={altHref}
      hrefLang={other}
      lang={other}
      onClick={switchLanguage}
      aria-label={a11y.switchTo}
      className={cn(
        "inline-flex h-10 items-center gap-1 rounded-full px-1 font-mono text-xs font-medium ring-1 ring-inset ring-line transition hover:ring-ink/30",
        className,
      )}
    >
      <span className={cn("rounded-full px-2 py-1", locale === "es" ? "bg-ink text-white" : "text-muted")}>ES</span>
      <span className={cn("rounded-full px-2 py-1", locale === "en" ? "bg-ink text-white" : "text-muted")}>EN</span>
    </a>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        scrolled || open || darkTop ? "bg-white/80 shadow-[0_1px_0_rgb(10_15_12/0.06)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Link href={home} className="rounded-lg" aria-label="Elevated Tech">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={`${home}${item.href}`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[14.5px] transition-colors hover:text-ink after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:bg-brand-ink after:transition-transform after:duration-300 hover:after:scale-x-100",
                    isActive(item.href) ? "font-medium text-ink after:scale-x-100" : "text-ink-soft after:scale-x-0",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <LangToggle />
          </span>
          <WhatsAppLink
            location="header"
            ariaLabel={nav.whatsapp}
            className="grid size-10 place-items-center rounded-full text-ink ring-1 ring-inset ring-line transition hover:bg-brand hover:ring-brand sm:grid"
          >
            <WhatsApp />
          </WhatsAppLink>
          <span className="hidden sm:block">
            <LeadButton location="header" size="sm" magnetic={false}>
              {nav.cta}
            </LeadButton>
          </span>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full ring-1 ring-inset ring-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? a11y.closeMenu : a11y.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Móvil" className="container-x flex h-full flex-col py-6">
          <ul className="flex flex-col">
            {nav.items.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={`${home}${item.href}`}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn("flex items-baseline gap-4 py-4 text-3xl font-semibold tracking-tight", isActive(item.href) && "text-brand-ink")}
                >
                  <span className="font-mono text-xs text-brand-ink">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <LeadButton location="mobile-menu" size="lg" className="w-full" magnetic={false} onClick={() => setOpen(false)}>
              {nav.cta}
            </LeadButton>
            <div className="flex items-center justify-between">
              <WhatsAppLink location="mobile-menu" className="inline-flex items-center gap-2 font-medium text-brand-ink">
                <WhatsApp /> +591 77165787
              </WhatsAppLink>
              <LangToggle />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
