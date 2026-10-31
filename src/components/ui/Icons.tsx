import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowUpRight = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const Plus = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Check = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} strokeWidth={2} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const Close = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Menu = (p: P) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...stroke} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const Play = (p: P) => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor" {...p}>
    <path d="M7 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 7 5.5Z" />
  </svg>
);
export const Pause = (p: P) => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor" {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
export const Pin = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const Mail = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.76-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

/** Service icons — simple geometric line icons. */
export const ServiceIcon = ({ name, ...p }: P & { name: string }) => {
  const paths: Record<string, React.ReactNode> = {
    web: (<><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>),
    ai: (<><rect x="5" y="7" width="14" height="11" rx="4" /><path d="M12 3v4M9 12h.01M15 12h.01M9.5 15h5M3 12v2M21 12v2" /></>),
    automation: (<><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H14a4 4 0 0 1 4 4v5.5M15.5 18H10a4 4 0 0 1-4-4V8.5" /></>),
    apps: (<><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></>),
    systems: (<><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></>),
    ux: (<><path d="M4 20 9 4l11 5-6 2.5L11.5 18 4 20Z" /></>),
    content: (<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9.5 4.5 2.5-4.5 2.5v-5Z" /></>),
    social: (<><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" /></>),
  };
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...stroke} {...p}>
      {paths[name] ?? paths.web}
    </svg>
  );
};
