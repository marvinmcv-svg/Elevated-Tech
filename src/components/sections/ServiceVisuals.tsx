import type { Locale } from "@/lib/i18n";
import type { Service } from "@/content/services";

/**
 * One small animated scene per service, drawn in HTML/CSS/SVG (no images to download).
 * All motion is CSS keyframes in globals.css (.sv-*); it only runs while the grid is on screen
 * (ServiceCards toggles data-live) and is switched off for prefers-reduced-motion.
 */

const T = {
  es: {
    chat: ["¿Tienen turno mañana?", "¡Sí! 10:00 o 15:30. ¿Te reservo?", "10:00 porfa 🙌", "Listo ✅ Te mandé la confirmación."],
    chatMeta: "Respondió en 2 s · 03:12",
    online: "en línea",
    flow: ["WhatsApp", "IA", "CRM", "Reporte"],
    notif: "Nuevo pedido · Mesa 4",
    kpi: ["Ventas", "Clientes"],
    prompt: "Reel para el lanzamiento de verano…",
    generate: "Generar",
    likes: "me gusta",
    speed: "Velocidad",
    buy: "Comprar",
  },
  en: {
    chat: ["Any slots tomorrow?", "Yes! 10:00 or 15:30. Book one?", "10:00 please 🙌", "Done ✅ Confirmation sent."],
    chatMeta: "Replied in 2 s · 03:12 am",
    online: "online",
    flow: ["WhatsApp", "AI", "CRM", "Report"],
    notif: "New order · Table 4",
    kpi: ["Sales", "Customers"],
    prompt: "Reel for the summer launch…",
    generate: "Generate",
    likes: "likes",
    speed: "Speed",
    buy: "Buy",
  },
} as const;

function Web({ t }: { t: (typeof T)[Locale] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 p-6">
      <div className="relative w-[68%] max-w-[22rem] overflow-hidden rounded-xl border border-white/10 bg-[#0f1913] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-3 h-3.5 flex-1 rounded-full bg-white/5 px-2 font-mono text-[8px] leading-[14px] text-white/40">tunegocio.bo</span>
        </div>
        <div className="space-y-2.5 p-4">
          <div className="sv-type h-3 rounded bg-white/85" style={{ "--w": "78%" } as React.CSSProperties} />
          <div className="sv-type h-3 rounded bg-white/85 [animation-delay:.25s]" style={{ "--w": "52%" } as React.CSSProperties} />
          <div className="sv-type h-1.5 rounded bg-white/20 [animation-delay:.5s]" style={{ "--w": "64%" } as React.CSSProperties} />
          <div className="relative pt-1">
            <span className="sv-cta inline-flex h-6 items-center rounded-full bg-brand px-3 text-[9px] font-semibold text-ink">{t.buy} →</span>
            <svg className="sv-click absolute left-14 top-3 size-4 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2l16 9-7 2-3 7z" /></svg>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="sv-shimmer aspect-[4/3] rounded-md bg-[linear-gradient(110deg,rgb(255_255_255/0.05)_30%,rgb(25_227_107/0.25)_50%,rgb(255_255_255/0.05)_70%)] bg-[length:250%_100%]" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
      {/* responsive phone + speed score */}
      <div className="relative hidden w-[22%] max-w-[6.5rem] sm:block">
        <div className="sv-float aspect-[9/18] rounded-[1rem] border-[3px] border-white/20 bg-[#0f1913] p-1.5">
          <div className="h-[30%] rounded-md bg-brand/30" />
          <div className="mt-1.5 h-1.5 w-3/4 rounded bg-white/70" />
          <div className="mt-1 h-1 w-1/2 rounded bg-white/20" />
          <div className="mt-2 h-3 rounded-full bg-brand" />
        </div>
        <div className="absolute -bottom-3 -left-8 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b130e]/90 px-2.5 py-1.5 backdrop-blur">
          <svg viewBox="0 0 36 36" className="size-7 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(255 255 255/0.1)" strokeWidth="4" />
            <circle className="sv-ring" cx="18" cy="18" r="15" fill="none" stroke="#19e36b" strokeWidth="4" strokeLinecap="round" strokeDasharray="94.2" />
          </svg>
          <div className="leading-none">
            <p className="text-[11px] font-semibold text-white">100</p>
            <p className="mt-0.5 text-[8px] text-white/50">{t.speed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ai({ t }: { t: (typeof T)[Locale] }) {
  const m = t.chat;
  return (
    <div className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full max-w-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1611] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]">
        <div className="flex items-center gap-2.5 border-b border-white/10 bg-white/[0.03] px-3.5 py-2.5">
          <span className="relative grid size-7 place-items-center rounded-full bg-brand text-[11px] font-bold text-ink">
            IA
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#0d1611] bg-brand" />
          </span>
          <div className="leading-tight">
            <p className="text-[12px] font-semibold text-white">El-IAs</p>
            <p className="text-[10px] text-brand">{t.online}</p>
          </div>
        </div>
        <div className="flex h-[10.5rem] flex-col justify-end gap-1.5 p-3 text-[11.5px] leading-snug">
          <p className="sv-m1 max-w-[78%] self-end rounded-2xl rounded-br-md bg-white/10 px-3 py-1.5 text-white/90">{m[0]}</p>
          <div className="relative">
            <p className="sv-m2 max-w-[82%] rounded-2xl rounded-bl-md bg-brand px-3 py-1.5 font-medium text-ink">{m[1]}</p>
            <span className="sv-typing1 absolute bottom-0 left-0 flex gap-1 rounded-2xl bg-white/10 px-3 py-2.5"><i className="sv-dot" /><i className="sv-dot [animation-delay:.15s]" /><i className="sv-dot [animation-delay:.3s]" /></span>
          </div>
          <p className="sv-m3 max-w-[78%] self-end rounded-2xl rounded-br-md bg-white/10 px-3 py-1.5 text-white/90">{m[2]}</p>
          <div className="relative">
            <p className="sv-m4 max-w-[82%] rounded-2xl rounded-bl-md bg-brand px-3 py-1.5 font-medium text-ink">{m[3]}</p>
            <span className="sv-typing2 absolute bottom-0 left-0 flex gap-1 rounded-2xl bg-white/10 px-3 py-2.5"><i className="sv-dot" /><i className="sv-dot [animation-delay:.15s]" /><i className="sv-dot [animation-delay:.3s]" /></span>
          </div>
          <p className="sv-m4 mt-0.5 font-mono text-[9px] text-white/40">{t.chatMeta}</p>
        </div>
      </div>
    </div>
  );
}

function Automation({ t }: { t: (typeof T)[Locale] }) {
  const nodes = [
    { x: 14, y: 30 },
    { x: 50, y: 50 },
    { x: 86, y: 28 },
    { x: 80, y: 78 },
  ];
  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        {[
          "M14 30 C 30 30, 34 50, 50 50",
          "M50 50 C 66 50, 70 28, 86 28",
          "M50 50 C 66 50, 64 78, 80 78",
        ].map((d, i) => (
          <g key={d}>
            <path d={d} stroke="rgb(255 255 255/0.12)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            <path className="sv-flow" d={d} stroke="#19e36b" strokeWidth="2" strokeDasharray="3 9" vectorEffect="non-scaling-stroke" style={{ animationDelay: `${i * 0.3}s` }} />
          </g>
        ))}
      </svg>
      {nodes.map((n, i) => (
        <span
          key={i}
          className="sv-node absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-[#0f1913] px-2.5 py-1.5 font-mono text-[10px] text-white/85 shadow-lg"
          style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${i * 0.45}s` }}
        >
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-brand align-middle" />
          {t.flow[i]}
        </span>
      ))}
    </div>
  );
}

function Apps({ t }: { t: (typeof T)[Locale] }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="sv-float relative h-[84%] aspect-[9/17] rounded-[1.6rem] border-[4px] border-white/20 bg-[#0f1913] p-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]">
        <div className="mx-auto mb-2 h-1.5 w-8 rounded-full bg-white/25" />
        <div className="h-[34%] rounded-xl bg-[radial-gradient(circle_at_30%_30%,#8af5b5,#067a37)]" />
        <div className="mt-2 h-1.5 w-3/4 rounded bg-white/70" />
        <div className="mt-1 h-1 w-1/2 rounded bg-white/25" />
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <div className="h-6 rounded-lg bg-white/10" />
          <div className="h-6 rounded-lg bg-white/10" />
          <div className="h-6 rounded-lg bg-white/10" />
          <div className="h-6 rounded-lg bg-brand" />
        </div>
        <div className="sv-toast absolute inset-x-[-18%] top-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/95 px-2.5 py-2 shadow-xl">
          <span className="grid size-5 shrink-0 place-items-center rounded-md bg-brand text-[9px] font-bold text-ink">ET</span>
          <span className="truncate text-[10px] font-medium text-ink">{t.notif}</span>
        </div>
      </div>
    </div>
  );
}

function Systems({ t }: { t: (typeof T)[Locale] }) {
  const bars = [40, 62, 48, 80, 66, 92, 74];
  return (
    <div className="absolute inset-0 p-5">
      <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0f1913] p-3">
        <div className="grid grid-cols-2 gap-2">
          {t.kpi.map((k, i) => (
            <div key={k} className="rounded-lg bg-white/5 px-2.5 py-1.5">
              <p className="font-mono text-[8px] uppercase tracking-wider text-white/45">{k}</p>
              <p className="text-[13px] font-semibold text-white">
                {i === 0 ? "+24%" : "1.284"} <span className="text-[9px] text-brand">▲</span>
              </p>
            </div>
          ))}
        </div>
        <div className="relative mt-2 flex flex-1 items-end gap-1.5">
          {bars.map((h, i) => (
            <span key={i} className="sv-bar w-full origin-bottom rounded-t bg-gradient-to-t from-brand/30 to-brand" style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />
          ))}
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 50" preserveAspectRatio="none" fill="none">
            <path className="sv-draw" d="M0 40 L16 34 L32 37 L48 22 L64 26 L80 12 L100 6" stroke="#fff" strokeWidth="1.5" strokeDasharray="130" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Ux() {
  return (
    <div className="absolute inset-0 p-5">
      <div className="relative h-full rounded-xl border border-white/10 bg-[#0f1913] bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:12px_12px]">
        <div className="absolute left-[12%] top-[16%] w-[46%] rounded-lg border border-white/15 bg-white/[0.04] p-2">
          <div className="h-2 w-3/4 rounded bg-white/70" />
          <div className="mt-1.5 h-1.5 w-1/2 rounded bg-white/25" />
          <div className="mt-2 h-4 w-12 rounded-full bg-brand" />
        </div>
        <div className="sv-drag absolute left-[30%] top-[50%] w-[42%] rounded-lg border-2 border-[#7c9cff] bg-white/[0.06] p-2">
          <div className="h-8 rounded bg-[linear-gradient(135deg,#8af5b5,#19e36b)]" />
          <div className="mt-1.5 h-1.5 w-2/3 rounded bg-white/40" />
          {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((p) => (
            <span key={p} className={`absolute ${p} size-1.5 bg-white ring-1 ring-[#7c9cff]`} />
          ))}
          <span className="absolute -bottom-6 -right-6 flex items-center">
            <svg className="size-3.5 text-[#7c9cff]" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2l16 9-7 2-3 7z" /></svg>
            <span className="rounded-full bg-[#7c9cff] px-1.5 py-px text-[8px] font-semibold text-white">Marvin</span>
          </span>
        </div>
        <div className="absolute right-[8%] top-[14%] flex flex-col gap-1.5">
          {["#19e36b", "#0a0f0c", "#f5f8f6", "#7c9cff"].map((c, i) => (
            <span key={c} className="sv-swatch size-4 rounded-full ring-1 ring-white/20" style={{ background: c, animationDelay: `${i * 0.25}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Content({ t }: { t: (typeof T)[Locale] }) {
  const tiles = [
    "bg-[radial-gradient(circle_at_30%_30%,#ffd29a,#e2733b_60%,#7a2e12)]",
    "bg-[linear-gradient(160deg,#8af5b5,#067a37)]",
    "bg-[radial-gradient(circle_at_70%_20%,#c9d4ff,#4b5fd1_70%)]",
    "bg-[linear-gradient(200deg,#ffd0cf,#d94f6a)]",
    "bg-[radial-gradient(circle_at_50%_80%,#fff1b8,#e0a400_70%)]",
    "bg-[linear-gradient(140deg,#1d2b24,#19e36b)]",
  ];
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f1913] p-1.5 pl-3">
        <span className="text-brand">✦</span>
        <span className="relative flex-1 overflow-hidden whitespace-nowrap text-[11px] text-white/80">
          <span className="sv-prompt inline-block overflow-hidden whitespace-nowrap align-bottom">{t.prompt}</span>
          <span className="sv-caret ml-px inline-block h-3 w-px bg-brand align-middle" />
        </span>
        <span className="sv-cta rounded-lg bg-brand px-2.5 py-1 text-[10px] font-semibold text-ink">{t.generate}</span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 sm:grid-cols-6">
        {tiles.map((c, i) => (
          <div key={i} className={`sv-tile relative overflow-hidden rounded-lg ${c}`} style={{ animationDelay: `${1.6 + i * 0.15}s` }}>
            {i % 3 === 1 && <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 font-mono text-[7px] text-white">0:15</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Social({ t }: { t: (typeof T)[Locale] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 p-5">
      <div className="relative w-[44%] max-w-[11rem] rounded-xl border border-white/10 bg-[#0f1913] p-2">
        <div className="flex items-center gap-1.5 pb-1.5">
          <span className="size-4 rounded-full bg-[conic-gradient(#19e36b,#8af5b5,#067a37,#19e36b)] p-px" />
          <span className="h-1.5 w-12 rounded bg-white/50" />
        </div>
        <div className="aspect-square rounded-lg bg-[radial-gradient(circle_at_30%_30%,#ffd29a,#e2733b_55%,#5a1f0b)]" />
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-white/80">
          <span className="text-[#ff4d6d]">♥</span>
          <span className="sv-count font-semibold tabular-nums" />
          <span className="text-white/45">{t.likes}</span>
        </div>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="sv-heart absolute bottom-8 text-[14px] text-[#ff4d6d]" style={{ left: `${20 + i * 18}%`, animationDelay: `${i * 0.6}s` }}>
            ♥
          </span>
        ))}
      </div>
      <div className="hidden w-[40%] sm:block">
        <svg viewBox="0 0 100 60" className="w-full" fill="none">
          <defs>
            <linearGradient id="sv-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#19e36b" stopOpacity="0.35" />
              <stop offset="1" stopColor="#19e36b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 52 L20 46 L40 44 L60 30 L80 22 L100 6 L100 60 L0 60Z" fill="url(#sv-area)" />
          <path className="sv-draw" d="M0 52 L20 46 L40 44 L60 30 L80 22 L100 6" stroke="#19e36b" strokeWidth="2" strokeDasharray="130" />
        </svg>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/45">+ 3.2k</p>
      </div>
    </div>
  );
}

export function ServiceVisual({ kind, locale }: { kind: Service["key"]; locale: Locale }) {
  const t = T[locale];
  return (
    <div aria-hidden="true" className="sv pointer-events-none absolute inset-0 select-none">
      {kind === "web" && <Web t={t} />}
      {kind === "ai" && <Ai t={t} />}
      {kind === "automation" && <Automation t={t} />}
      {kind === "apps" && <Apps t={t} />}
      {kind === "systems" && <Systems t={t} />}
      {kind === "ux" && <Ux />}
      {kind === "content" && <Content t={t} />}
      {kind === "social" && <Social t={t} />}
    </div>
  );
}
