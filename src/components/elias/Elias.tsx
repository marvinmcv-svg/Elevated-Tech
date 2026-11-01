"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import { lenisStore } from "@/lib/lenis";
import { whatsappUrl } from "@/lib/whatsapp";
import { useLeadForm } from "@/components/lead/LeadFormProvider";
import { ArrowRight, Close, WhatsApp } from "@/components/ui/Icons";
import { cn } from "@/lib/ui";

type Msg = { role: "user" | "assistant"; content: string };

const COPY = {
  es: {
    launcher: "Pregúntale a El-IAs",
    nudge: "¿Te ayudo a encontrar la solución para tu negocio?",
    title: "El-IAs",
    status: "Recepcionista con IA · en línea",
    greeting:
      "¡Qué tal! Soy **El-IAs**, el recepcionista con IA de Elevated Tech. Te ayudo a descubrir qué le conviene a tu negocio, te cuento cómo trabajamos y te conecto con el equipo. ¿En qué andas?",
    suggestions: ["¿Qué servicio me conviene?", "¿Cuánto cuesta una web?", "¿Cómo trabajan?", "Quiero un agente de IA como tú"],
    placeholder: "Escribe tu pregunta…",
    send: "Enviar",
    human: "Hablar con una persona",
    quote: "Cotiza gratis",
    disclaimer: "El-IAs es una IA y puede equivocarse. Para cotizar, te atiende una persona.",
    thinking: "El-IAs está escribiendo",
    handoff: "Esa te la responde mejor una persona del equipo. Escríbenos por WhatsApp y te atendemos personalmente.",
    unavailable: `Ahora mismo estoy descansando un ratito. Escríbenos por WhatsApp al ${site.whatsapp.display} y te atendemos personalmente.`,
    error: "Uy, se me cortó la señal. ¿Lo intentamos de nuevo? Si prefieres, escríbenos por WhatsApp.",
    rate: "Vamos muy rápido. Dame un minuto y seguimos, o escríbenos por WhatsApp.",
    open: "Abrir chat con El-IAs",
    close: "Cerrar chat",
    reset: "Nueva conversación",
    waMessage: "¡Hola Elevated Tech! Vengo de hablar con El-IAs en la web.",
  },
  en: {
    launcher: "Ask El-IAs",
    nudge: "Can I help you find the right solution for your business?",
    title: "El-IAs",
    status: "AI receptionist · online",
    greeting:
      "Hi there! I'm **El-IAs**, Elevated Tech's AI receptionist. I can help you figure out what your business needs, explain how we work and connect you with the team. What are you working on?",
    suggestions: ["Which service fits my business?", "How much does a website cost?", "How do you work?", "I want an AI agent like you"],
    placeholder: "Type your question…",
    send: "Send",
    human: "Talk to a person",
    quote: "Free quote",
    disclaimer: "El-IAs is an AI and can make mistakes. Quotes are handled by a person.",
    thinking: "El-IAs is typing",
    handoff: "A person on our team can answer that one better. Message us on WhatsApp and we'll help you personally.",
    unavailable: `I'm taking a short break right now. Message us on WhatsApp at ${site.whatsapp.display} and we'll help you personally.`,
    error: "Oops, I lost the signal. Shall we try again? Or message us on WhatsApp.",
    rate: "We're going fast! Give me a minute, or message us on WhatsApp.",
    open: "Open chat with El-IAs",
    close: "Close chat",
    reset: "New conversation",
    waMessage: "Hi Elevated Tech! I just chatted with El-IAs on your website.",
  },
} as const;

const STORE_KEY = "elias-chat-v1";
const HANDOFF = "__ELIAS_HANDOFF__";

/** Minimal, safe formatting: **bold**, "- " lists, site paths and URLs as links. No HTML injection. */
function Rich({ text }: { text: string }) {
  const lines = text.split("\n");
  const inline = (line: string, key: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|\/(?:es|en)\/servicios\/[a-z-]+|\/(?:es|en)(?:#[a-z-]+)?(?=[\s.,)]|$))/g);
    return parts.map((p, i) => {
      if (!p) return null;
      if (p.startsWith("**") && p.endsWith("**")) return <strong key={`${key}-${i}`} className="font-semibold text-ink">{p.slice(2, -2)}</strong>;
      if (/^https?:\/\//.test(p) || /^\/(es|en)/.test(p))
        return (
          <a
            key={`${key}-${i}`}
            href={p}
            target={p.startsWith("http") ? "_blank" : undefined}
            rel={p.startsWith("http") ? "noopener noreferrer" : undefined}
            className="font-medium text-brand-ink underline decoration-brand decoration-2 underline-offset-2"
          >
            {p.startsWith("http") ? p.replace(/^https?:\/\//, "") : p}
          </a>
        );
      return <Fragment key={`${key}-${i}`}>{p}</Fragment>;
    });
  };
  const out: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  const flush = (k: number) => {
    if (list.length) {
      out.push(<ul key={`ul-${k}`} className="my-1.5 space-y-1 pl-4 [list-style:disc]">{list}</ul>);
      list = [];
    }
  };
  lines.forEach((l, i) => {
    const m = l.match(/^\s*[-•*]\s+(.*)$/);
    if (m) list.push(<li key={i}>{inline(m[1], `li${i}`)}</li>);
    else {
      flush(i);
      if (l.trim()) out.push(<p key={i} className="[&:not(:first-child)]:mt-2">{inline(l, `p${i}`)}</p>);
    }
  });
  flush(lines.length);
  return <>{out}</>;
}

export function Elias({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const { open: openLeadForm } = useLeadForm();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore this tab's conversation
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE_KEY);
      if (saved) setMessages(JSON.parse(saved) as Msg[]);
    } catch {
      /* storage unavailable */
    }
    const id = window.setTimeout(() => {
      try {
        if (!sessionStorage.getItem(`${STORE_KEY}-nudged`)) setNudge(true);
      } catch {
        setNudge(true);
      }
    }, 9000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage unavailable */
    }
  }, [messages]);

  // Scroll to newest
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  // Open/close side effects
  useEffect(() => {
    if (!open) return;
    const lenis = lenisStore.get();
    const small = window.matchMedia("(max-width: 639px)").matches;
    if (small) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      if (small) {
        lenis?.start();
        document.body.style.overflow = "";
      }
    };
  }, [open]);

  const dismissNudge = () => {
    setNudge(false);
    try {
      sessionStorage.setItem(`${STORE_KEY}-nudged`, "1");
    } catch {
      /* ignore */
    }
  };

  const toggle = () => {
    setOpen((o) => {
      if (!o) track("elias_open", { locale });
      return !o;
    });
    dismissNudge();
  };

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      setInput("");
      const history: Msg[] = [...messages, { role: "user", content: q }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setBusy(true);
      track("elias_message", { locale, turn: history.filter((m) => m.role === "user").length });

      const setLast = (fn: (s: string) => string) =>
        setMessages((ms) => {
          const copy = ms.slice();
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: fn(last.content) };
          return copy;
        });

      if (offline) {
        setLast(() => t.unavailable);
        setBusy(false);
        return;
      }

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: ctrl.signal,
        });
        if (res.status === 503) {
          setOffline(true);
          setLast(() => t.unavailable);
          return;
        }
        if (res.status === 429) {
          setLast(() => t.rate);
          return;
        }
        if (!res.ok || !res.body) throw new Error(String(res.status));
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          const shown = acc.includes(HANDOFF) ? acc.replace(HANDOFF, t.handoff) : acc;
          setLast(() => shown);
        }
        if (!acc.trim()) setLast(() => t.error);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setLast((s) => s || t.error);
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages, offline, locale, t],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
  };

  const showGreeting = messages.length === 0;
  const lastIsEmptyAssistant = busy && messages[messages.length - 1]?.content === "";

  return (
    <>
      {/* Launcher */}
      <div className="fixed bottom-5 right-5 z-[45] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        {nudge && !open && (
          <div className="elias-pop relative max-w-[16rem] rounded-2xl rounded-br-md border border-line bg-white p-3.5 pr-8 text-sm text-ink shadow-[0_20px_50px_-20px_rgb(4_57_28/0.45)]">
            {t.nudge}
            <button type="button" onClick={dismissNudge} aria-label={t.close} className="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-muted hover:bg-mist hover:text-ink">
              <Close className="size-3.5" />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="elias-panel"
          aria-label={open ? t.close : t.open}
          className={cn(
            "group relative flex h-14 items-center gap-2.5 rounded-full bg-ink pl-1.5 text-white shadow-[0_18px_44px_-14px_rgb(4_57_28/0.75)] transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-0.5",
            open ? "pr-1.5" : "pr-5",
          )}
        >
          <span className="relative grid size-11 place-items-center overflow-hidden rounded-full bg-gradient-to-b from-brand-100 to-white ring-2 ring-brand/70">
            {open ? (
              <Close className="size-5 text-ink" />
            ) : (
              <Image src="/robot/elias-avatar.webp" alt="" width={88} height={88} className="size-11 object-cover" />
            )}
            {!open && <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-brand ring-2 ring-ink" />}
          </span>
          {!open && <span className="text-sm font-semibold">{t.launcher}</span>}
        </button>
      </div>

      {/* Panel */}
      <section
        id="elias-panel"
        role="dialog"
        aria-modal="false"
        aria-label={t.title}
        inert={!open}
        className={cn(
          "fixed inset-0 z-[60] flex flex-col overflow-hidden bg-white transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] sm:inset-auto sm:bottom-24 sm:right-7 sm:h-[min(42rem,calc(100dvh-8rem))] sm:w-[25rem] sm:rounded-[1.75rem] sm:border sm:border-line sm:shadow-[0_40px_100px_-30px_rgb(4_57_28/0.5)]",
          open ? "visible translate-y-0 opacity-100 sm:scale-100" : "invisible translate-y-6 opacity-0 sm:scale-95",
          "origin-bottom-right",
        )}
      >
        {/* Header */}
        <header className="relative flex items-center gap-3 overflow-hidden bg-night px-4 py-3.5 text-white">
          <div aria-hidden="true" className="absolute -right-10 -top-10 size-40 rounded-full bg-brand/30 blur-2xl" />
          <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-b from-brand-100 to-white ring-2 ring-brand/70">
            <Image src="/robot/elias-avatar.webp" alt="" width={88} height={88} className="size-11 object-cover" />
          </span>
          <div className="relative min-w-0 flex-1">
            <p className="font-semibold leading-tight">{t.title}</p>
            <p className="flex items-center gap-1.5 truncate text-xs text-white/60">
              <span className="size-1.5 shrink-0 rounded-full bg-brand" />
              {t.status}
            </p>
          </div>
          {messages.length > 0 && (
            <button type="button" onClick={reset} aria-label={t.reset} title={t.reset} className="relative grid size-9 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
              </svg>
            </button>
          )}
          <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="relative grid size-9 place-items-center rounded-full transition hover:bg-white/10">
            <Close className="size-5" />
          </button>
        </header>

        {/* Messages */}
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-mist/60 px-4 py-5" aria-live="polite" data-lenis-prevent>
          {showGreeting && (
            <>
              <Bubble role="assistant">
                <Rich text={t.greeting} />
              </Bubble>
              <div className="flex flex-wrap gap-2 pt-1">
                {t.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-brand/40 bg-white px-3 py-1.5 text-left text-[13px] font-medium text-brand-ink transition hover:border-brand hover:bg-brand-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
          {messages.map((m, i) =>
            m.role === "assistant" && m.content === "" ? null : (
              <Bubble key={i} role={m.role}>
                {m.role === "assistant" ? <Rich text={m.content} /> : m.content}
              </Bubble>
            ),
          )}
          {lastIsEmptyAssistant && (
            <div className="flex items-center gap-1.5 pl-1" aria-label={t.thinking}>
              <span className="elias-dot" />
              <span className="elias-dot [animation-delay:150ms]" />
              <span className="elias-dot [animation-delay:300ms]" />
            </div>
          )}
        </div>

        {/* Hand-offs */}
        <div className="flex gap-2 border-t border-line bg-white px-4 pt-3">
          <a
            href={whatsappUrl(t.waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "elias" })}
            className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-mist px-3 py-2 text-[13px] font-medium text-ink transition hover:bg-brand-50"
          >
            <WhatsApp className="size-4 text-[#25D366]" />
            {t.human}
          </a>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openLeadForm({ location: "elias" });
            }}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2 text-[13px] font-semibold text-ink transition hover:bg-[#2df07a]"
          >
            {t.quote}
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Composer */}
        <form
          className="bg-white px-4 pb-3 pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-white p-1.5 pl-3.5 transition focus-within:border-brand-ink/50 focus-within:ring-4 focus-within:ring-brand/15">
            <label htmlFor="elias-input" className="sr-only">{t.placeholder}</label>
            <textarea
              id="elias-input"
              ref={inputRef}
              rows={1}
              maxLength={1500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={t.placeholder}
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label={t.send}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-white transition hover:bg-brand hover:text-ink disabled:opacity-40"
            >
              <ArrowRight className="size-5 -rotate-90" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted">{t.disclaimer}</p>
        </form>
      </section>
    </>
  );
}

function Bubble({ role, children }: { role: Msg["role"]; children: React.ReactNode }) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "elias-in max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-relaxed",
          role === "user" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md border border-line bg-white text-ink-soft [&_p]:whitespace-normal [&_ul]:whitespace-normal",
        )}
      >
        {children}
      </div>
    </div>
  );
}
