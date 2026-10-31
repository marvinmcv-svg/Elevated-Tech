import { ImageResponse } from "next/og";
import { getDictionary } from "@/content";
import { isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Elevated Tech";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "es");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ffffff", position: "relative" }}>
        <div style={{ position: "absolute", right: -160, top: -120, width: 620, height: 620, borderRadius: 9999, background: "radial-gradient(circle at 35% 30%, #c8ffdd 0%, #19e36b 35%, #067a37 70%, #04391c 100%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700, color: "#0a0f0c" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#0a0f0c", color: "#19e36b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>⌃</div>
          Elevated Tech
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.0, letterSpacing: -3, color: "#0a0f0c" }}>{t.hero.slides[0].title}</div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#3d4742" }}>{t.footer.tagline}</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#067a37", fontWeight: 600 }}>Santa Cruz de la Sierra · Bolivia</div>
      </div>
    ),
    size,
  );
}
