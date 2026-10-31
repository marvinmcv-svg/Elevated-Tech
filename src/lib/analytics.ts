"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire an analytics event. Sends to GA4 (if NEXT_PUBLIC_GA_ID is set) and always pushes
 * to window.dataLayer so a Tag Manager container can pick it up later.
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    window.gtag?.("event", event, params);
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", event, params);
    }
  } catch {
    /* analytics must never break the page */
  }
}

export const events = {
  whatsappClick: "whatsapp_click",
  leadFormOpen: "lead_form_open",
  leadFormSubmit: "lead_form_submit",
  heroSlideChange: "hero_slide_change",
  languageSwitch: "language_switch",
} as const;
