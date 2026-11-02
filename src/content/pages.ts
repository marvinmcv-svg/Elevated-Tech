import type { Locale } from "@/lib/i18n";
import type { Service } from "./services";

/**
 * Copy for the site's inner pages (services index, projects, case studies, about, contact,
 * schools, restaurants) plus the home-page teasers that link to them.
 * Section copy that already exists (process, FAQ, team…) stays in es.ts / en.ts.
 */

type Meta = { title: string; description: string };

export type PagesCopy = {
  home: {
    servicesCta: string;
    workEyebrow: string;
    workTitle: string;
    workBody: string;
    workCta: string;
    industriesEyebrow: string;
    industriesTitle: string;
    industries: { href: string; title: string; body: string; cta: string }[];
    aboutCta: string;
  };
  services: { meta: Meta; eyebrow: string; title: string; body: string; casesLink: string };
  projects: { meta: Meta };
  caseStudy: {
    back: string;
    caseStudy: string;
    client: string;
    industry: string;
    city: string;
    type: string;
    services: string;
    challenge: string;
    approach: string;
    built: string;
    desktop: string;
    mobile: string;
    viewLive: string;
    visit: string;
    next: string;
    related: string;
    ctaTitle: string;
    ctaBody: string;
    ctaPrimary: string;
  };
  serviceCases: { eyebrow: string; title: string; body: string; viewCase: string; allProjects: string };
  about: { meta: Meta; valuesTitle: string; values: { title: string; body: string }[] };
  contact: { meta: Meta };
  schools: { meta: Meta };
  restaurants: { meta: Meta };
  breadcrumbHome: string;
};

export const pages: Record<Locale, PagesCopy> = {
  es: {
    home: {
      servicesCta: "Ver todos los servicios",
      workEyebrow: "Trabajo reciente",
      workTitle: "Proyectos reales, funcionando hoy.",
      workBody: "Cada caso es una web, app o sistema en vivo. Entra, mira cómo lo resolvimos y pruébalo tú mismo.",
      workCta: "Ver los 17 proyectos",
      industriesEyebrow: "Soluciones por industria",
      industriesTitle: "Lo conocemos desde adentro.",
      industries: [
        {
          href: "/colegios",
          title: "Colegios",
          body: "SIS, Student OS, web de admisiones y tienda de uniformes: un ecosistema completo para tu colegio.",
          cta: "Ver la solución para colegios",
        },
        {
          href: "/restaurantes",
          title: "Restaurantes",
          body: "Tu web, tu menú y RestoBar OS, nuestro sistema POS, hablando el mismo idioma.",
          cta: "Ver la solución para restaurantes",
        },
      ],
      aboutCta: "Conoce al equipo",
    },
    services: {
      meta: {
        title: "Servicios: webs, agentes de IA, apps y sistemas | Elevated Tech",
        description:
          "Páginas web, agentes de IA, automatización, apps móviles, sistemas a medida (CRM, ERP, SIS, POS), diseño UX/UI, contenido con IA y redes sociales desde Santa Cruz de la Sierra.",
      },
      eyebrow: "Servicios",
      title: "Todo lo que tu negocio necesita para crecer, en un solo equipo.",
      body: "Elige por dónde empezar. Cada servicio tiene su propia página con lo que incluye, lo que cambia en tu día a día y casos reales que puedes visitar.",
      casesLink: "casos reales",
    },
    projects: {
      meta: {
        title: "Proyectos y casos de éxito | Elevated Tech",
        description:
          "17 proyectos en vivo: webs, apps y sistemas para colegios, restaurantes, marcas y personas en Bolivia. Mira el problema, la solución y pruébalos en vivo.",
      },
    },
    caseStudy: {
      back: "Todos los proyectos",
      caseStudy: "Caso de estudio",
      client: "Cliente",
      industry: "Industria",
      city: "Ciudad",
      type: "Proyecto",
      services: "Servicios",
      challenge: "El reto",
      approach: "Lo que hicimos",
      built: "Lo que incluye",
      desktop: "En escritorio",
      mobile: "En el celular",
      viewLive: "Probar en vivo",
      visit: "Visitar el sitio",
      next: "Siguiente proyecto",
      related: "Proyectos relacionados",
      ctaTitle: "¿Quieres algo así para tu negocio?",
      ctaBody: "Agenda una llamada gratis. Te contamos cómo lo construiríamos para ti y ves el diseño antes de pagar.",
      ctaPrimary: "Agenda tu llamada gratis",
    },
    serviceCases: {
      eyebrow: "Casos reales",
      title: "Proyectos en vivo donde aplicamos este servicio.",
      body: "No son maquetas: son sitios y sistemas que hoy usan clientes reales. Entra a cada caso para ver el reto y cómo lo resolvimos.",
      viewCase: "Ver caso",
      allProjects: "Ver todos los proyectos",
    },
    about: {
      meta: {
        title: "Nosotros: el equipo detrás de Elevated Tech",
        description:
          "Somos un equipo de Santa Cruz de la Sierra que trabajó en colegios, restaurantes y hoteles antes de construir software para ellos. Conoce cómo trabajamos.",
      },
      valuesTitle: "Cómo trabajamos",
      values: [
        { title: "Ves el diseño antes de pagar", body: "Te mostramos cómo se verá tu proyecto antes de que inviertas en construirlo." },
        { title: "Todo es tuyo", body: "Al terminar, el código y el diseño son 100% tuyos. Sin rehenes ni letras chicas." },
        { title: "Hablamos claro", body: "Sin tecnicismos. Te explicamos qué hacemos, por qué y cuánto tarda." },
        { title: "No desaparecemos", body: "Después del lanzamiento seguimos contigo para que todo funcione como el primer día." },
      ],
    },
    contact: {
      meta: {
        title: "Contacto: cotiza gratis tu proyecto | Elevated Tech",
        description: "Cuéntanos qué necesitas y te respondemos personalmente por WhatsApp. Cotización gratis y sin compromiso.",
      },
    },
    schools: {
      meta: {
        title: "Software para colegios: SIS, Student OS y webs | Elevated Tech",
        description:
          "Sistema de información estudiantil, Student OS, web de admisiones y tienda de uniformes para colegios en Bolivia. Mira el caso de Santa Cruz Cooperative School.",
      },
    },
    restaurants: {
      meta: {
        title: "Software para restaurantes: web + POS RestoBar OS | Elevated Tech",
        description:
          "Tu web, tu menú y RestoBar OS, un POS en la nube con pedidos desde el celular, pantalla de cocina y cierre diario por WhatsApp.",
      },
    },
    breadcrumbHome: "Inicio",
  },
  en: {
    home: {
      servicesCta: "See all services",
      workEyebrow: "Recent work",
      workTitle: "Real projects, working today.",
      workBody: "Every case is a live website, app or system. Go in, see how we solved it and try it yourself.",
      workCta: "See all 17 projects",
      industriesEyebrow: "Solutions by industry",
      industriesTitle: "We know it from the inside.",
      industries: [
        {
          href: "/colegios",
          title: "Schools",
          body: "SIS, Student OS, admissions website and uniform store: a complete ecosystem for your school.",
          cta: "See the school solution",
        },
        {
          href: "/restaurantes",
          title: "Restaurants",
          body: "Your website, your menu and RestoBar OS, our POS system, speaking the same language.",
          cta: "See the restaurant solution",
        },
      ],
      aboutCta: "Meet the team",
    },
    services: {
      meta: {
        title: "Services: websites, AI agents, apps and systems | Elevated Tech",
        description:
          "Websites, AI agents, automation, mobile apps, custom systems (CRM, ERP, SIS, POS), UX/UI design, AI content and social media from Santa Cruz de la Sierra, Bolivia.",
      },
      eyebrow: "Services",
      title: "Everything your business needs to grow, in one team.",
      body: "Pick where to start. Every service has its own page with what's included, what changes in your day-to-day and real cases you can visit.",
      casesLink: "real cases",
    },
    projects: {
      meta: {
        title: "Projects and case studies | Elevated Tech",
        description:
          "17 live projects: websites, apps and systems for schools, restaurants, brands and people in Bolivia. See the problem, the solution and try them live.",
      },
    },
    caseStudy: {
      back: "All projects",
      caseStudy: "Case study",
      client: "Client",
      industry: "Industry",
      city: "City",
      type: "Project",
      services: "Services",
      challenge: "The challenge",
      approach: "What we did",
      built: "What's inside",
      desktop: "On desktop",
      mobile: "On mobile",
      viewLive: "Try it live",
      visit: "Visit the site",
      next: "Next project",
      related: "Related projects",
      ctaTitle: "Want something like this for your business?",
      ctaBody: "Book a free call. We'll tell you how we'd build it for you, and you see the design before paying.",
      ctaPrimary: "Book your free call",
    },
    serviceCases: {
      eyebrow: "Real cases",
      title: "Live projects where we applied this service.",
      body: "Not mockups: sites and systems real clients use today. Open each case to see the challenge and how we solved it.",
      viewCase: "View case",
      allProjects: "See all projects",
    },
    about: {
      meta: {
        title: "About us: the team behind Elevated Tech",
        description:
          "We're a team from Santa Cruz de la Sierra who worked in schools, restaurants and hotels before building software for them. See how we work.",
      },
      valuesTitle: "How we work",
      values: [
        { title: "You see the design before paying", body: "We show you how your project will look before you invest in building it." },
        { title: "It's all yours", body: "When we finish, the code and design are 100% yours. No hostages, no fine print." },
        { title: "We speak plainly", body: "No jargon. We explain what we're doing, why, and how long it takes." },
        { title: "We don't disappear", body: "After launch we stay with you so everything keeps working like day one." },
      ],
    },
    contact: {
      meta: {
        title: "Contact: get a free quote | Elevated Tech",
        description: "Tell us what you need and we'll reply personally on WhatsApp. Free quote, no strings attached.",
      },
    },
    schools: {
      meta: {
        title: "Software for schools: SIS, Student OS and websites | Elevated Tech",
        description:
          "Student information system, Student OS, admissions website and uniform store for schools in Bolivia. See the Santa Cruz Cooperative School case.",
      },
    },
    restaurants: {
      meta: {
        title: "Software for restaurants: website + RestoBar OS POS | Elevated Tech",
        description:
          "Your website, your menu and RestoBar OS, a cloud POS with orders from a phone, kitchen display and a daily close on WhatsApp.",
      },
    },
    breadcrumbHome: "Home",
  },
};

/**
 * Live projects that show each service in action (shown as case studies on the service pages).
 * Order matters: the first ones are the strongest examples.
 */
export const serviceCases: Record<Service["key"], string[]> = {
  web: ["don-corte-fino", "haras-la-alhambra", "fogo-de-chao", "sccs-website", "acs-calvert", "helibol"],
  ai: ["spc", "helibol", "haras-la-alhambra"],
  automation: ["restobar-os", "spc", "don-corte-fino", "sccs-store"],
  apps: ["firu-walk", "bloom", "fuerzaflow", "sccs-sis"],
  systems: ["restobar-os", "sccs-sis", "sccs-student-os", "sccs-store"],
  ux: ["sccs-student-os", "firu-walk", "restobar-os", "bloom"],
  content: ["fogo-de-chao", "fabrizio-19", "haras-la-alhambra", "fabrizio"],
  social: ["iker-torrico", "fabrizio-19", "fabrizio"],
};

/** Services involved in a project (reverse of serviceCases). */
export function servicesOf(projectKey: string): Service["key"][] {
  return (Object.keys(serviceCases) as Service["key"][]).filter((k) => serviceCases[k].includes(projectKey));
}

/** Prefix a site path with the locale ("/proyectos" → "/es/proyectos"). Hashes and URLs pass through. */
export function localePath(locale: Locale, href: string) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  return `/${locale}${href === "/" ? "" : href}`;
}
