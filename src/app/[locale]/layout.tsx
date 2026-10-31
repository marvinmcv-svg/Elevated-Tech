import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Analytics } from "@/components/Analytics";
import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL(site.url),
    title: t.title,
    description: t.description,
    applicationName: site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.title,
      description: t.description,
      url: `/${locale}`,
      locale: locale === "es" ? "es_BO" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_BO"],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

/**
 * Adds `.js` before first paint so scroll-reveal targets can start hidden without a flash.
 * Safety net: if the app hasn't booted within 4s (blocked JS, old browser), show everything.
 */
const bootScript = `(function(d){d.documentElement.classList.add('js');setTimeout(function(){if(!window.__motionReady)d.documentElement.classList.remove('js')},4000)})(document)`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale as Locale} className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
