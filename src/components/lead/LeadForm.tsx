"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/content";
import { events, track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";
import { buttonClasses, cn } from "@/lib/ui";
import { WhatsApp } from "@/components/ui/Icons";

type Copy = Dictionary["contact"];
type Fields = { name: string; business: string; need: string; budget: string; website: string };

export function buildMessage(copy: Copy, f: Fields) {
  const m = copy.message;
  const lines = [
    m.greeting,
    `${m.name} ${f.name.trim()} ${m.business} ${f.business.trim()}.`,
    `${m.need}: ${f.need}.`,
    f.budget.trim() ? `${m.budget}: ${f.budget.trim()}.` : null,
    m.closing,
  ];
  return lines.filter(Boolean).join("\n");
}

/**
 * Short lead form. On submit it:
 *  1. saves the lead to /api/lead (→ LEAD_WEBHOOK_URL) with keepalive so it survives navigation,
 *  2. tracks the submission,
 *  3. opens WhatsApp with a pre-filled message built from the answers.
 */
export function LeadForm({
  copy,
  location,
  initialNeed,
  autoFocus,
  className,
  dark = false,
}: {
  copy: Copy;
  location: string;
  initialNeed?: string;
  autoFocus?: boolean;
  className?: string;
  dark?: boolean;
}) {
  const id = useId();
  const f = copy.form;
  const [values, setValues] = useState<Fields>({ name: "", business: "", need: initialNeed ?? "", budget: "", website: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: false }));
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = {
      name: !values.name.trim(),
      business: !values.business.trim(),
      need: !values.need,
    };
    setErrors(errs);
    if (errs.name || errs.business || errs.need) {
      const firstInvalid = (["name", "business", "need"] as const).find((k) => errs[k]);
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }

    setSending(true);
    const message = buildMessage(copy, values);
    const url = whatsappUrl(message);
    const lang = document.documentElement.lang;

    // 1. Save the lead first (fire-and-forget, survives the tab switching to WhatsApp).
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ ...values, locale: lang, location, page: window.location.href }),
      }).catch(() => {});
    } catch {
      /* never block the WhatsApp hand-off */
    }

    // 2. Track
    track(events.leadFormSubmit, { location, need: values.need, has_budget: !!values.budget.trim() });
    track(events.whatsappClick, { location: `form:${location}` });

    // 3. Open WhatsApp synchronously (inside the user gesture so popup blockers allow it).
    // ("noopener" in the features string would make window.open return null, so detach manually.)
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
    setSentUrl(url);
    setSending(false);
  }

  const label = cn("mb-1.5 block text-sm font-medium", dark ? "text-white" : "text-ink");
  const input = (err?: boolean) =>
    cn(
      "h-12 w-full rounded-xl border px-4 text-[15px] outline-none transition-[border-color,box-shadow] duration-200",
      dark
        ? "border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-brand focus:shadow-[0_0_0_4px_rgb(25_227_107/0.2)]"
        : "border-line bg-white text-ink placeholder:text-muted/70 focus:border-brand-ink focus:shadow-[0_0_0_4px_rgb(25_227_107/0.18)]",
      err && "border-red-500",
    );
  const errText = <span className="mt-1 block text-sm text-red-600">{f.required}</span>;

  return (
    <form noValidate onSubmit={onSubmit} className={cn("grid gap-4", className)}>
      <div>
        <label htmlFor={`${id}-name`} className={label}>{f.name}</label>
        <input id={`${id}-name`} name="name" autoComplete="name" autoFocus={autoFocus} required aria-invalid={errors.name || undefined}
          aria-describedby={errors.name ? `${id}-name-err` : undefined} placeholder={f.namePh} value={values.name} onChange={set("name")} className={input(errors.name)} />
        {errors.name && <span id={`${id}-name-err`}>{errText}</span>}
      </div>
      <div>
        <label htmlFor={`${id}-business`} className={label}>{f.business}</label>
        <input id={`${id}-business`} name="business" autoComplete="organization" required aria-invalid={errors.business || undefined}
          aria-describedby={errors.business ? `${id}-business-err` : undefined} placeholder={f.businessPh} value={values.business} onChange={set("business")} className={input(errors.business)} />
        {errors.business && <span id={`${id}-business-err`}>{errText}</span>}
      </div>
      <div>
        <label htmlFor={`${id}-need`} className={label}>{f.need}</label>
        <div className="relative">
          <select id={`${id}-need`} name="need" required aria-invalid={errors.need || undefined} aria-describedby={errors.need ? `${id}-need-err` : undefined}
            value={values.need} onChange={set("need")} className={cn(input(errors.need), "appearance-none pr-10", !values.need && (dark ? "text-white/40" : "text-muted/70"))}>
            <option value="" disabled>{f.needPh}</option>
            {f.needs.map((n) => (<option key={n} value={n} className="text-ink">{n}</option>))}
          </select>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" className={cn("pointer-events-none absolute right-4 top-1/2 -translate-y-1/2", dark ? "text-white/60" : "text-muted")} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 9 6 6 6-6" /></svg>
        </div>
        {errors.need && <span id={`${id}-need-err`}>{errText}</span>}
      </div>
      <div>
        <label htmlFor={`${id}-budget`} className={label}>
          {f.budget} <span className={dark ? "font-normal text-white/50" : "font-normal text-muted"}>({f.optional})</span>
        </label>
        <input id={`${id}-budget`} name="budget" placeholder={f.budgetPh} value={values.budget} onChange={set("budget")} className={input()} />
      </div>
      {/* Honeypot: hidden from people, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={set("website")} /></label>
      </div>

      <button type="submit" disabled={sending} className={cn(buttonClasses("primary", "lg"), "mt-1 w-full")}>
        <WhatsApp />
        {sending ? f.sending : f.submit}
      </button>
      <p className={cn("text-center text-sm", dark ? "text-white/55" : "text-muted")} aria-live="polite">
        {sentUrl ? (
          <>
            {f.success}{" "}
            <a href={sentUrl} target="_blank" rel="noopener noreferrer" className={cn("font-medium underline underline-offset-4", dark ? "text-brand" : "text-brand-ink")}>
              {f.successLink}
            </a>
          </>
        ) : (
          f.note
        )}
      </p>
    </form>
  );
}
