import { NextResponse, type NextRequest } from "next/server";
import { isLocale, LOCALE_COOKIE, localeFromAcceptLanguage } from "@/lib/i18n";

/**
 * Locale routing: /es (default) and /en.
 * A saved choice (cookie from the language toggle) always wins; otherwise Spanish browsers
 * get Spanish and everyone else gets English. Crawlers without Accept-Language get Spanish.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : localeFromAcceptLanguage(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url);
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, robots.txt, sitemap.xml…)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
