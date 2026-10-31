"use client";

import type Lenis from "lenis";

/** Shared smooth-scroll instance so dialogs can pause it and links can use it. */
let instance: Lenis | null = null;

export const lenisStore = {
  get: () => instance,
  set: (l: Lenis | null) => {
    instance = l;
  },
};

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = lenisStore.get();
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
