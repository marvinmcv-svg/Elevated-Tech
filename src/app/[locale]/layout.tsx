import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";
import { LeadFormProvider } from "@/components/lead/LeadFormProvider";
import { PreviewProvider } from "@/components/portfolio/PreviewProvider";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/sections/WhatsAppFloat";
import { Elias } from "@/components/elias/Elias";
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
    ...pageMetadata(locale, "", t),
    metadataBase: new URL(site.url),
    applicationName: site.name,
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

/**
 * Adds `.js` before first paint so scroll-reveal targets can start hidden without a flash.
 * Safety net: if the app hasn't booted within 2.5s (blocked JS, old browser), show everything.
 */
const bootScript = `(function(d){d.documentElement.classList.add('js');setTimeout(function(){if(!window.__motionReady)d.documentElement.classList.remove('js')},2500)})(document)`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <html lang={locale as Locale} className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans antialiased">
        <LeadFormProvider copy={t.contact} closeLabel={t.a11y.close}>
          <PreviewProvider copy={t.projects} locale={locale} needs={t.contact.form.needs}>
            <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
              {t.a11y.skip}
            </a>
            <Header locale={locale} nav={t.nav} a11y={t.a11y} />
            <main id="main">{children}</main>
            <Footer locale={locale} copy={t.footer} nav={t.nav} />
            <WhatsAppFloat label={t.whatsappFloat} />
            <Elias locale={locale} />
            <MotionRoot />
          </PreviewProvider>
        </LeadFormProvider>
        <Analytics />
      </body>
    </html>
  );
}
