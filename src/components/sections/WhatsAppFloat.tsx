"use client";

import { useEffect, useState } from "react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsApp } from "@/components/ui/Icons";
import { cn } from "@/lib/ui";

/** Floating WhatsApp button, appears after the hero. */
export function WhatsAppFloat({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      inert={!show}
      className={cn(
        "fixed bottom-[5.5rem] right-5 z-40 transition-all duration-500 sm:bottom-[6.5rem] sm:right-7",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <WhatsAppLink
        location="floating"
        ariaLabel={label}
        className="group flex h-14 items-center gap-0 rounded-full bg-brand pl-4 pr-4 text-ink shadow-[0_14px_40px_-10px_rgb(25_227_107/0.8)] transition-all duration-500 hover:gap-2 hover:pr-5"
      >
        <WhatsApp className="size-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 group-hover:max-w-56 group-focus-visible:max-w-56">
          {label}
        </span>
      </WhatsAppLink>
    </div>
  );
}
