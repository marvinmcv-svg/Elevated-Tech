"use client";

import { events, track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

/** Every WhatsApp link on the site goes through here so each click is tracked with its location. */
export function WhatsAppLink({
  location,
  message,
  className,
  children,
  ariaLabel,
}: {
  location: string;
  message?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      onClick={() => track(events.whatsappClick, { location })}
    >
      {children}
    </a>
  );
}
