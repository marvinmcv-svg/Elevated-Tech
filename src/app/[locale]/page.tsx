import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { isLocale } from "@/lib/i18n";
import { LeadFormProvider } from "@/components/lead/LeadFormProvider";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { StructuredData } from "@/components/StructuredData";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Restaurant } from "@/components/sections/Restaurant";
import { Schools } from "@/components/sections/Schools";
import { PreviewProvider } from "@/components/portfolio/PreviewProvider";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/sections/WhatsAppFloat";
import { Elias } from "@/components/elias/Elias";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const needs = t.contact.form.needs;

  return (
    <LeadFormProvider copy={t.contact} closeLabel={t.a11y.close}>
      <PreviewProvider copy={t.projects} locale={locale} needs={needs}>
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t.a11y.skip}
      </a>
      <Header locale={locale} nav={t.nav} a11y={t.a11y} />
      <main id="main">
        {/* 1. Hero slideshow */}
        <Hero copy={t.hero} needs={needs} />
        <Stats stats={t.stats} />
        <Marquee items={t.marquee} />
        {/* 2. Services */}
        <Services copy={t.services} locale={locale} />
        {/* 3. Portfolio: every live project, filterable, with live previews */}
        <Projects copy={t.projects} locale={locale} />
        {/* 4. Featured: schools (HyperFrames film) */}
        <Schools copy={t.schools} film={t.film} locale={locale} need={needs[4]} />
        {/* 5. Featured: restaurants (HyperFrames film) */}
        <Restaurant copy={t.restaurant} film={t.film} locale={locale} need={needs[5]} />
        {/* 6. Process */}
        <Process copy={t.process} />
        {/* 7. Testimonials */}
        <Testimonials copy={t.testimonials} locale={locale} />
        {/* 8. About & team */}
        <About copy={t.about} locale={locale} />
        {/* 9. FAQ */}
        <Faq copy={t.faq} locale={locale} />
        {/* 10. Final CTA + form */}
        <Contact copy={t.contact} />
      </main>
      {/* 11. Footer */}
      <Footer copy={t.footer} nav={t.nav} />
      <WhatsAppFloat label={t.whatsappFloat} />
      <Elias locale={locale} />
      <MotionRoot />
      <StructuredData dict={t} locale={locale} />
      </PreviewProvider>
    </LeadFormProvider>
  );
}
