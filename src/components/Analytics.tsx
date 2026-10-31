import Script from "next/script";

/**
 * Google Analytics 4. Set NEXT_PUBLIC_GA_ID (TODO(launch)). Custom events
 * (whatsapp_click, lead_form_open, lead_form_submit, …) are sent from lib/analytics.ts.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
