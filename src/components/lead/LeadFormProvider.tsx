"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content";
import { events, track } from "@/lib/analytics";
import { lenisStore } from "@/lib/lenis";
import { Close } from "@/components/ui/Icons";
import { LeadForm } from "./LeadForm";

type OpenArgs = { location: string; need?: string };
const Ctx = createContext<{ open: (args: OpenArgs) => void }>({ open: () => {} });
export const useLeadForm = () => useContext(Ctx);

export function LeadFormProvider({
  children,
  copy,
  closeLabel,
}: {
  children: React.ReactNode;
  copy: Dictionary["contact"];
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<OpenArgs & { key: number }>({ location: "", key: 0 });

  const open = useCallback((args: OpenArgs) => {
    setState((s) => ({ ...args, key: s.key + 1 }));
    track(events.leadFormOpen, { location: args.location });
    const d = dialogRef.current;
    if (d && !d.open) {
      d.showModal();
      lenisStore.get()?.stop();
    }
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => lenisStore.get()?.start();
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close(); // backdrop click
    };
    d.addEventListener("close", onClose);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="lead-dialog-title"
        className="lead-dialog m-auto mb-0 w-full max-w-none rounded-t-3xl bg-white p-0 text-ink shadow-2xl sm:mb-auto sm:max-w-lg sm:rounded-3xl"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={close}
            aria-label={closeLabel}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-mist hover:text-ink"
          >
            <Close />
          </button>
          <h2 id="lead-dialog-title" className="pr-10 text-2xl font-semibold tracking-tight">
            {copy.form.title}
          </h2>
          <p className="mt-1 text-ink-soft">{copy.form.subtitle}</p>
          <LeadForm key={state.key} copy={copy} location={`dialog:${state.location}`} initialNeed={state.need} autoFocus className="mt-6" />
        </div>
      </dialog>
    </Ctx.Provider>
  );
}
