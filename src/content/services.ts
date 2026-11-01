import type { Locale } from "@/lib/i18n";

/**
 * Service catalogue: the single source of truth for
 *  - the service cards on the home page,
 *  - each service page (/[locale]/servicios/[slug]),
 *  - El-IAs, the AI receptionist (her knowledge is built from this file).
 *
 * Tone: we care first, then we persuade. Name the real cost of standing still without fear-mongering,
 * never invent numbers, never promise what we can't control.
 */

export type ServiceCopy = {
  title: string;
  /** Card: one short line about what it is. */
  short: string;
  /** Card: what standing still costs you today (shown after serviceUi.costLabel). */
  cost: string;
  /** Card: the outcome. */
  outcome: string;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string; primary: string };
  costOfWaiting: { title: string; body: string; items: { title: string; body: string }[] };
  offer: { title: string; body: string; items: { title: string; body: string }[] };
  change: { title: string; items: { before: string; after: string }[] };
  idealFor: { title: string; items: string[] };
  faq: { q: string; a: string }[];
  cta: { title: string; body: string };
};

export type Service = {
  key: "web" | "ai" | "automation" | "apps" | "systems" | "ux" | "content" | "social";
  slug: string;
  /** Index into contact.form.needs, pre-selected when the lead form opens from this service. */
  need: number;
  copy: Record<Locale, ServiceCopy>;
};

export const services: Service[] = [
  /* ─────────────────────────────── 1. WEBSITES ─────────────────────────────── */
  {
    key: "web",
    slug: "paginas-web",
    need: 0,
    copy: {
      es: {
        title: "Páginas web y tiendas online",
        short: "Webs y tiendas online rápidas, hermosas y hechas para vender.",
        cost: "Clientes que te buscan, no te encuentran y le compran a otro.",
        outcome: "Más pedidos",
        meta: {
          title: "Páginas web y tiendas online en Santa Cruz | Elevated Tech",
          description:
            "Diseñamos webs y tiendas online rápidas, modernas y optimizadas para Google desde Santa Cruz de la Sierra. Ves el diseño antes de invertir. Cotiza gratis.",
        },
        hero: {
          eyebrow: "Páginas web · E-commerce",
          title: "Tu web debería ser tu mejor vendedor, no tu peor tarjeta de presentación.",
          lead: "Antes de escribirte, casi todos tus clientes te buscan en el celular. Lo que ven en esos primeros segundos decide si te escriben a ti o a la competencia. Diseñamos webs y tiendas online que generan confianza al instante, cargan rapidísimo y llevan a la gente directo a comprar o a escribirte.",
          primary: "Quiero mi web",
        },
        costOfWaiting: {
          title: "Lo que te cuesta no tener una web a la altura",
          body: "No lo decimos para asustarte. Lo decimos porque lo vemos todos los días en negocios buenísimos que merecen más clientes de los que tienen.",
          items: [
            { title: "Clientes que se van sin avisar", body: "Si tu web tarda en cargar o se ve mal en el celular, la gente simplemente cierra y abre la siguiente opción. Nunca te enteras de la venta que perdiste." },
            { title: "Confianza que no se construye", body: "Una web vieja o descuidada hace que un negocio excelente parezca pequeño o poco serio. Tu calidad real merece verse desde el primer clic." },
            { title: "Depender solo de las redes", body: "Las redes son prestadas: cambian sus reglas y tu alcance baja. Tu web es tuya, aparece en Google y trabaja para ti las 24 horas." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "Una web completa, pensada desde cómo compran tus clientes, no desde una plantilla.",
          items: [
            { title: "Diseño a medida", body: "Nada de plantillas genéricas. Un diseño que refleja tu marca y que ves y apruebas antes de que construyamos." },
            { title: "Velocidad real", body: "Construimos con tecnología moderna para que tu web cargue casi al instante, incluso con datos móviles." },
            { title: "Pensada para el celular", body: "Cada pantalla se diseña primero para el teléfono, que es donde está tu cliente." },
            { title: "Lista para Google", body: "SEO técnico, textos bien estructurados y datos para que Google entienda qué haces y dónde estás." },
            { title: "Tienda online", body: "Catálogo, carrito y pedidos por WhatsApp o pago en línea, según cómo funciona tu negocio." },
            { title: "Todo es tuyo", body: "Al terminar, el código y el diseño son 100% tuyos. Sin rehenes, sin letras chicas." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Clientes que te preguntan lo mismo por WhatsApp todo el día", after: "Una web que responde horarios, precios de referencia y ubicación por ti" },
            { before: "Aparecer después de la competencia en Google", after: "Una web técnica y bien estructurada que Google puede entender y mostrar" },
            { before: "Mandar fotos sueltas para enseñar tu catálogo", after: "Un catálogo ordenado y lindo que se comparte con un solo link" },
            { before: "Vergüenza de pasar tu link", after: "Orgullo de mostrar tu negocio como realmente es" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Restaurantes y cafés", "Clínicas y consultorios", "Tiendas y marcas", "Colegios e institutos", "Servicios profesionales", "Emprendimientos que quieren crecer"] },
        faq: [
          { q: "¿Cuánto tarda una web?", a: "Normalmente entre dos y cuatro semanas, según el tamaño. En la llamada inicial te damos un cronograma claro." },
          { q: "¿Puedo actualizar mi web yo mismo?", a: "Sí. Si lo necesitas, te dejamos un panel sencillo para cambiar textos, fotos o productos sin tocar código." },
          { q: "¿Y si ya tengo una web?", a: "La revisamos contigo, te decimos honestamente qué vale la pena conservar y la llevamos al siguiente nivel." },
          { q: "¿Cuánto cuesta?", a: "Cada proyecto es a medida. Tras una llamada corta te enviamos una cotización gratis y sin compromiso." },
        ],
        cta: { title: "Tu próximo cliente ya te está buscando.", body: "Hagamos que te encuentre, confíe en ti y te escriba. Te mostramos el diseño antes de que inviertas un solo boliviano en el desarrollo." },
      },
      en: {
        title: "Websites & online stores",
        short: "Fast, beautiful websites and online stores built to sell.",
        cost: "People who look for you, can't find you, and buy elsewhere.",
        outcome: "More orders",
        meta: {
          title: "Websites & online stores in Bolivia | Elevated Tech",
          description:
            "We design fast, modern, Google-ready websites and online stores from Santa Cruz de la Sierra, Bolivia. See the design before you commit. Free quote.",
        },
        hero: {
          eyebrow: "Websites · E-commerce",
          title: "Your website should be your best salesperson, not your weakest first impression.",
          lead: "Before they message you, almost every customer looks you up on their phone. What they see in those first seconds decides whether they contact you or your competitor. We design websites and online stores that earn trust instantly, load in a blink and lead people straight to buying or reaching out.",
          primary: "Start my website",
        },
        costOfWaiting: {
          title: "What an outdated website is costing you",
          body: "We're not saying this to scare you. We say it because we see it every day in great businesses that deserve more customers than they get.",
          items: [
            { title: "Customers who leave without a word", body: "If your site is slow or looks off on a phone, people simply close it and open the next option. You never hear about the sale you lost." },
            { title: "Trust that never gets built", body: "An old or neglected website makes an excellent business look small or unreliable. Your real quality deserves to show from the first click." },
            { title: "Relying only on social media", body: "Social platforms are borrowed ground: rules change and reach drops. Your website is yours, shows up on Google and works for you around the clock." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "A complete website designed around how your customers actually buy, not around a template.",
          items: [
            { title: "Custom design", body: "No generic templates. A design that reflects your brand, which you see and approve before we build." },
            { title: "Real speed", body: "Built with modern technology so your site loads almost instantly, even on mobile data." },
            { title: "Mobile first", body: "Every screen is designed for the phone first, because that's where your customers are." },
            { title: "Ready for Google", body: "Technical SEO, well-structured content and data so Google understands what you do and where you are." },
            { title: "Online store", body: "Catalog, cart and orders via WhatsApp or online payment, depending on how your business works." },
            { title: "It's all yours", body: "When we're done, the code and design are 100% yours. No lock-in, no fine print." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Customers asking the same questions on WhatsApp all day", after: "A site that answers hours, reference prices and location for you" },
            { before: "Showing up after your competitors on Google", after: "A clean, well-structured site Google can understand and surface" },
            { before: "Sending loose photos to show your catalog", after: "A beautiful, organized catalog you share with a single link" },
            { before: "Feeling awkward sharing your link", after: "Being proud to show your business as it really is" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["Restaurants & cafés", "Clinics & practices", "Shops & brands", "Schools & institutes", "Professional services", "Businesses ready to grow"] },
        faq: [
          { q: "How long does a website take?", a: "Usually two to four weeks, depending on size. We give you a clear timeline on the first call." },
          { q: "Can I update my site myself?", a: "Yes. If you need it, we set up a simple panel so you can change text, photos or products without touching code." },
          { q: "What if I already have a website?", a: "We review it with you, tell you honestly what's worth keeping, and take it to the next level." },
          { q: "How much does it cost?", a: "Every project is custom. After a short call we send you a free quote with no strings attached." },
        ],
        cta: { title: "Your next customer is already looking for you.", body: "Let's make sure they find you, trust you and reach out. You see the design before you invest in the build." },
      },
    },
  },

  /* ─────────────────────────────── 2. AI AGENTS ─────────────────────────────── */
  {
    key: "ai",
    slug: "agentes-ia",
    need: 1,
    copy: {
      es: {
        title: "Agentes de IA y recepcionistas",
        short: "Recepcionistas y chatbots con IA que atienden 24/7 por WhatsApp y en tu web.",
        cost: "Mensajes que llegan de noche y nadie responde hasta mañana.",
        outcome: "Ningún mensaje sin respuesta",
        meta: {
          title: "Agentes de IA y recepcionistas virtuales en Bolivia | Elevated Tech",
          description:
            "Recepcionistas y chatbots con IA que responden 24/7 por WhatsApp y en tu web con la información real de tu negocio. Hechos en Santa Cruz de la Sierra.",
        },
        hero: {
          eyebrow: "Agentes de IA",
          title: "Que ningún cliente se quede esperando una respuesta. Nunca más.",
          lead: "Tus clientes escriben a la hora que pueden: a la noche, en domingo, en plena hora pico. Un agente de IA entrenado con la información de tu negocio responde al instante, con amabilidad y con datos correctos, y le pasa la conversación a una persona de tu equipo cuando hace falta.",
          primary: "Quiero mi agente de IA",
        },
        costOfWaiting: {
          title: "Lo que te cuesta responder tarde",
          body: "Tu equipo hace lo que puede. Pero nadie puede estar pegado al celular las 24 horas, y el cliente que no recibe respuesta no siempre espera.",
          items: [
            { title: "Ventas que se enfrían", body: "Quien pregunta está listo para comprar ahora. Si la respuesta llega horas después, muchas veces ya decidió por otro." },
            { title: "Tu equipo atrapado en lo mismo", body: "Horarios, precios, requisitos, ubicación: las mismas preguntas una y otra vez, en lugar de atender lo que de verdad necesita a una persona." },
            { title: "Una imagen que no te representa", body: "Un mensaje en visto o una respuesta apurada no reflejan lo mucho que te importan tus clientes." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "Un agente que conoce tu negocio, habla como tu marca y sabe cuándo pedir ayuda.",
          items: [
            { title: "Entrenado con tu información", body: "Responde con tus horarios, servicios, requisitos y políticas reales, no con respuestas genéricas." },
            { title: "WhatsApp y web", body: "Atiende donde ya están tus clientes: en tu WhatsApp Business y en el chat de tu página." },
            { title: "Pasa a una persona", body: "Cuando la consulta lo necesita, deriva la conversación a tu equipo con todo el contexto." },
            { title: "Agenda y captura datos", body: "Puede tomar reservas, registrar interesados y dejar los datos ordenados para tu equipo." },
            { title: "Habla como tu marca", body: "Definimos juntos el tono: cercano, formal, en español, en inglés o en ambos." },
            { title: "Mejora con el uso", body: "Revisamos las conversaciones contigo y lo ajustamos para que cada mes responda mejor." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Mensajes en visto hasta el día siguiente", after: "Respuesta inmediata, de día y de noche" },
            { before: "Tu equipo respondiendo las mismas diez preguntas", after: "Tu equipo atendiendo los casos que necesitan a una persona" },
            { before: "Interesados que se pierden en el chat", after: "Datos ordenados de cada interesado, listos para el seguimiento" },
            { before: "Filas y llamadas en recepción", after: "Respuestas claras antes de que el cliente llegue" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Colegios e institutos", "Clínicas y consultorios", "Restaurantes con reservas", "Inmobiliarias", "Tiendas con muchas consultas", "Cualquier negocio con WhatsApp lleno"] },
        faq: [
          { q: "¿Va a inventar respuestas?", a: "Lo configuramos para responder solo con la información oficial de tu negocio y para derivar a una persona cuando no está seguro." },
          { q: "¿Necesito cambiar mi número de WhatsApp?", a: "Normalmente no. Revisamos tu caso y te recomendamos la forma más simple de conectarlo." },
          { q: "¿Ya lo hicieron antes?", a: "Sí. Construimos una recepcionista con IA para un colegio que responde a padres y postulantes sobre inscripciones, horarios y requisitos." },
          { q: "¿Cuánto cuesta?", a: "Depende de los canales y de lo que deba hacer. Te enviamos una cotización gratis después de una llamada corta." },
        ],
        cta: { title: "Tus clientes ya están escribiendo. Respondámosles.", body: "En una llamada gratis vemos qué preguntas te llegan más y te mostramos cómo las respondería tu agente." },
      },
      en: {
        title: "AI agents & receptionists",
        short: "AI receptionists and chatbots that answer 24/7 on WhatsApp and your site.",
        cost: "Messages that arrive at night and wait until tomorrow.",
        outcome: "No message left unanswered",
        meta: {
          title: "AI agents & virtual receptionists | Elevated Tech",
          description:
            "AI receptionists and chatbots that answer 24/7 on WhatsApp and your website with your business's real information. Built in Santa Cruz de la Sierra, Bolivia.",
        },
        hero: {
          eyebrow: "AI agents",
          title: "Never leave a customer waiting for an answer again.",
          lead: "Your customers write whenever they can: at night, on Sundays, in the middle of rush hour. An AI agent trained on your business answers instantly, kindly and accurately, and hands the conversation to someone on your team when it should.",
          primary: "I want my AI agent",
        },
        costOfWaiting: {
          title: "What slow replies are costing you",
          body: "Your team does its best. But nobody can be glued to a phone 24 hours a day, and a customer who doesn't get an answer doesn't always wait.",
          items: [
            { title: "Sales that go cold", body: "Whoever asks is ready to buy now. If the answer comes hours later, they've often already chosen someone else." },
            { title: "A team stuck on repeat", body: "Hours, prices, requirements, location: the same questions again and again, instead of the cases that truly need a person." },
            { title: "An image that isn't you", body: "A message left on read or a rushed reply doesn't reflect how much you care about your customers." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "An agent that knows your business, speaks like your brand and knows when to ask for help.",
          items: [
            { title: "Trained on your information", body: "Answers with your real hours, services, requirements and policies, not generic replies." },
            { title: "WhatsApp and web", body: "Works where your customers already are: your WhatsApp Business and your website chat." },
            { title: "Hands off to a person", body: "When a conversation needs it, it passes to your team with the full context." },
            { title: "Books and captures leads", body: "It can take bookings, register prospects and leave the details organized for your team." },
            { title: "Speaks like your brand", body: "We define the tone together: friendly or formal, in Spanish, English or both." },
            { title: "Gets better with use", body: "We review conversations with you and fine-tune it so it answers better every month." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Messages left on read until the next day", after: "Instant replies, day and night" },
            { before: "Your team answering the same ten questions", after: "Your team handling the cases that need a person" },
            { before: "Prospects lost in the chat", after: "Organized details for every prospect, ready for follow-up" },
            { before: "Lines and calls at the front desk", after: "Clear answers before the customer even arrives" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["Schools & institutes", "Clinics & practices", "Restaurants with bookings", "Real estate", "Shops with lots of questions", "Any business with a busy WhatsApp"] },
        faq: [
          { q: "Will it make things up?", a: "We set it up to answer only with your business's official information and to hand off to a person when it isn't sure." },
          { q: "Do I need a new WhatsApp number?", a: "Usually not. We review your case and recommend the simplest way to connect it." },
          { q: "Have you done this before?", a: "Yes. We built an AI receptionist for a school that answers parents and applicants about enrollment, schedules and requirements." },
          { q: "How much does it cost?", a: "It depends on the channels and what it needs to do. We send a free quote after a short call." },
        ],
        cta: { title: "Your customers are already writing. Let's answer them.", body: "On a free call we look at the questions you get most and show you how your agent would answer them." },
      },
    },
  },

  /* ─────────────────────────────── 3. AUTOMATION ─────────────────────────────── */
  {
    key: "automation",
    slug: "automatizacion",
    need: 2,
    copy: {
      es: {
        title: "Automatización de procesos",
        short: "Flujos que conectan tus herramientas y eliminan el trabajo repetitivo.",
        cost: "Horas de tu equipo copiando datos de un lado a otro.",
        outcome: "Menos tareas manuales",
        meta: {
          title: "Automatización de procesos para empresas en Bolivia | Elevated Tech",
          description:
            "Automatizamos seguimientos, reservas, reportes y tareas repetitivas conectando tus herramientas. Tu equipo recupera horas cada semana. Santa Cruz de la Sierra.",
        },
        hero: {
          eyebrow: "Automatización",
          title: "Tu equipo vale demasiado para pasar el día copiando y pegando.",
          lead: "Planillas que se llenan a mano, recordatorios que dependen de la memoria de alguien, reportes que te toman el fin de semana. Conectamos tus herramientas para que esas tareas se hagan solas, sin errores y a tiempo, y tu gente pueda enfocarse en lo que solo una persona puede hacer.",
          primary: "Quiero automatizar",
        },
        costOfWaiting: {
          title: "Lo que te cuesta seguir haciéndolo a mano",
          body: "El trabajo manual no aparece en ninguna factura, por eso es tan fácil subestimarlo. Pero se paga todos los días.",
          items: [
            { title: "Horas que no vuelven", body: "Cada tarea repetitiva parece pequeña. Sumadas en un mes, son días enteros de trabajo de tu equipo." },
            { title: "Errores que salen caros", body: "Un dato mal copiado, un seguimiento olvidado o un pedido que se traspapela. No es descuido: es humano." },
            { title: "Un negocio que no puede crecer", body: "Si cada cliente nuevo suma trabajo manual, crecer significa más estrés en lugar de más ganancia." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "Empezamos por entender cómo trabajas hoy. Después automatizamos lo que más te duele.",
          items: [
            { title: "Diagnóstico de procesos", body: "Mapeamos contigo dónde se va el tiempo y qué conviene automatizar primero." },
            { title: "Herramientas conectadas", body: "WhatsApp, correo, planillas, formularios, tu sistema y más, hablando entre sí." },
            { title: "Seguimientos automáticos", body: "Recordatorios a clientes, avisos de pago y mensajes de seguimiento que salen solos y a tiempo." },
            { title: "Reportes sin esfuerzo", body: "Tus números importantes, actualizados y ordenados, sin armar planillas a mano." },
            { title: "IA donde suma", body: "Clasificar mensajes, resumir documentos o extraer datos de facturas: la IA hace lo tedioso." },
            { title: "Documentado y tuyo", body: "Te explicamos cómo funciona cada flujo y queda documentado para tu equipo." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Copiar pedidos de WhatsApp a una planilla", after: "Pedidos que llegan solos y ordenados a tu sistema" },
            { before: "Acordarte de llamar a cada cliente", after: "Seguimientos que salen automáticamente en el momento justo" },
            { before: "Armar el reporte del mes un domingo", after: "Un reporte que se actualiza solo y llega a tu correo" },
            { before: "Depender de que una persona no falte", after: "Procesos que funcionan igual, haya quien haya" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Equipos de ventas", "Administración y cobranzas", "Colegios", "Restaurantes y delivery", "Clínicas", "Negocios en crecimiento"] },
        faq: [
          { q: "¿Tengo que cambiar las herramientas que uso?", a: "Casi nunca. Preferimos conectar lo que tu equipo ya conoce antes que obligarte a aprender algo nuevo." },
          { q: "¿Qué pasa si algo falla?", a: "Diseñamos los flujos con avisos de error para que nada se pierda en silencio, y te acompañamos después del lanzamiento." },
          { q: "¿Por dónde empiezo?", a: "Por una llamada gratis. Elegimos juntos el proceso que más tiempo te quita y empezamos por ahí." },
        ],
        cta: { title: "Devuélvele las horas a tu equipo.", body: "Cuéntanos qué tarea te tiene harto. Probablemente se pueda automatizar, y te lo mostramos sin compromiso." },
      },
      en: {
        title: "Workflow automation",
        short: "Flows that connect your tools and remove repetitive work.",
        cost: "Hours of your team copying data from one place to another.",
        outcome: "Fewer manual tasks",
        meta: {
          title: "Business workflow automation | Elevated Tech",
          description:
            "We automate follow-ups, bookings, reports and repetitive tasks by connecting your tools. Your team gets hours back every week. Built in Santa Cruz de la Sierra, Bolivia.",
        },
        hero: {
          eyebrow: "Automation",
          title: "Your team is worth far too much to spend the day copying and pasting.",
          lead: "Spreadsheets filled by hand, reminders that depend on someone's memory, reports that eat your weekend. We connect your tools so those tasks run on their own, error-free and on time, and your people can focus on what only a person can do.",
          primary: "Automate my business",
        },
        costOfWaiting: {
          title: "What doing it by hand is costing you",
          body: "Manual work never shows up on an invoice, which is why it's so easy to underestimate. But you pay for it every single day.",
          items: [
            { title: "Hours you never get back", body: "Each repetitive task feels small. Added up over a month, they're whole days of your team's time." },
            { title: "Mistakes that cost money", body: "A mistyped number, a forgotten follow-up, a lost order. It isn't carelessness: it's human." },
            { title: "A business that can't scale", body: "If every new customer adds manual work, growing means more stress instead of more profit." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "We start by understanding how you work today. Then we automate what hurts the most.",
          items: [
            { title: "Process diagnosis", body: "We map with you where the time goes and what's worth automating first." },
            { title: "Connected tools", body: "WhatsApp, email, spreadsheets, forms, your system and more, talking to each other." },
            { title: "Automatic follow-ups", body: "Customer reminders, payment notices and follow-up messages that go out on their own, on time." },
            { title: "Effortless reports", body: "Your key numbers, up to date and organized, without building spreadsheets by hand." },
            { title: "AI where it helps", body: "Sorting messages, summarizing documents, pulling data from invoices: AI does the tedious part." },
            { title: "Documented and yours", body: "We explain how each flow works and document it for your team." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Copying WhatsApp orders into a spreadsheet", after: "Orders that arrive organized in your system on their own" },
            { before: "Remembering to call every customer", after: "Follow-ups that go out automatically at the right moment" },
            { before: "Building the monthly report on a Sunday", after: "A report that updates itself and lands in your inbox" },
            { before: "Depending on one person never being absent", after: "Processes that work the same no matter who's in" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["Sales teams", "Admin & collections", "Schools", "Restaurants & delivery", "Clinics", "Growing businesses"] },
        faq: [
          { q: "Do I have to change the tools I use?", a: "Almost never. We'd rather connect what your team already knows than force you to learn something new." },
          { q: "What if something breaks?", a: "We build flows with error alerts so nothing gets lost silently, and we stay with you after launch." },
          { q: "Where do I start?", a: "With a free call. We pick the process that takes the most of your time and start there." },
        ],
        cta: { title: "Give your team their hours back.", body: "Tell us which task drives you crazy. It can probably be automated, and we'll show you how, no strings attached." },
      },
    },
  },

  /* ─────────────────────────────── 4. MOBILE APPS ─────────────────────────────── */
  {
    key: "apps",
    slug: "apps-moviles",
    need: 3,
    copy: {
      es: {
        title: "Apps móviles",
        short: "Tu idea convertida en una app a medida para iOS y Android.",
        cost: "Clientes que te olvidan porque no estás en su celular.",
        outcome: "Clientes más fieles",
        meta: {
          title: "Desarrollo de apps móviles iOS y Android en Bolivia | Elevated Tech",
          description:
            "Diseñamos y desarrollamos apps móviles a medida para iOS y Android: reservas, pagos, seguimiento y fidelización. Desde la idea hasta la tienda. Santa Cruz de la Sierra.",
        },
        hero: {
          eyebrow: "Apps móviles",
          title: "De la idea en tu cabeza a la app en el celular de tus clientes.",
          lead: "Una buena app pone tu negocio a un toque de distancia: reservas, pedidos, pagos y avisos sin intermediarios. Te acompañamos desde la idea hasta la publicación en las tiendas, con un diseño que la gente disfruta usar y una base técnica que aguanta el crecimiento.",
          primary: "Quiero mi app",
        },
        costOfWaiting: {
          title: "Lo que te cuesta seguir esperando",
          body: "Las ideas buenas no esperan. Y una app mal hecha cuesta más que ninguna app.",
          items: [
            { title: "La idea que se queda en idea", body: "Mientras lo piensas, alguien más puede estar construyendo algo parecido. El primero en hacerlo bien suele quedarse con el mercado." },
            { title: "Clientes que no vuelven", body: "Sin un canal directo, dependes de que se acuerden de ti. Una app con avisos útiles los trae de vuelta." },
            { title: "Procesos atados al papel", body: "Reservas por llamada, pagos en efectivo sin registro, seguimiento por mensajes sueltos. Todo eso puede vivir en una app." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "Un producto completo, no solo pantallas lindas.",
          items: [
            { title: "Estrategia de producto", body: "Definimos contigo la versión inicial que resuelve lo más importante, para lanzar rápido y aprender." },
            { title: "Diseño UX/UI", body: "Prototipos que pruebas antes del desarrollo, para que la app se sienta natural desde el primer uso." },
            { title: "iOS y Android", body: "Una sola base de código moderna para ambas plataformas, con rendimiento nativo." },
            { title: "Funciones reales", body: "Cuentas, reservas, pagos, mapas, seguimiento en vivo y notificaciones, según lo que necesites." },
            { title: "Publicación en tiendas", body: "Nos encargamos del proceso de publicación en App Store y Google Play." },
            { title: "Panel de administración", body: "Una web interna para que gestiones usuarios, contenido y pedidos." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Reservas por llamada y mensajes sueltos", after: "Reservas en dos toques, con confirmación automática" },
            { before: "Clientes que se olvidan de ti", after: "Avisos útiles que los traen de vuelta" },
            { before: "Una idea en una servilleta", after: "Una app publicada, en manos de usuarios reales" },
            { before: "No saber cómo usan tu servicio", after: "Datos claros para decidir qué mejorar" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Servicios a domicilio", "Gimnasios y academias", "Restaurantes con delivery", "Startups", "Comunidades y colegios", "Programas de fidelización"] },
        faq: [
          { q: "¿Cuánto tarda una app?", a: "Depende del alcance. Solemos empezar con una primera versión enfocada, para lanzar rápido. En la llamada te damos un cronograma real." },
          { q: "¿Ya hicieron apps?", a: "Sí. Entregamos una app a medida y estamos construyendo una app de paseo de perros con reservas, seguimiento en vivo y pagos." },
          { q: "¿La app es mía?", a: "Sí. Al terminar, el código y el diseño son 100% tuyos." },
        ],
        cta: { title: "Tu idea merece salir de tu cabeza.", body: "Cuéntanosla en una llamada gratis. Te ayudamos a definir la primera versión y te mostramos cómo se vería." },
      },
      en: {
        title: "Mobile apps",
        short: "Your idea turned into a custom app for iOS and Android.",
        cost: "Customers who forget you because you're not on their phone.",
        outcome: "More loyal customers",
        meta: {
          title: "iOS & Android app development | Elevated Tech",
          description:
            "We design and build custom iOS and Android apps: bookings, payments, tracking and loyalty. From idea to app store. Built in Santa Cruz de la Sierra, Bolivia.",
        },
        hero: {
          eyebrow: "Mobile apps",
          title: "From the idea in your head to the app on your customers' phones.",
          lead: "A great app puts your business one tap away: bookings, orders, payments and notifications with no middlemen. We go with you from idea to app store, with a design people enjoy using and a technical foundation that can handle growth.",
          primary: "Build my app",
        },
        costOfWaiting: {
          title: "What waiting is costing you",
          body: "Good ideas don't wait. And a badly built app costs more than no app at all.",
          items: [
            { title: "The idea that stays an idea", body: "While you think it over, someone else may be building something similar. Whoever does it well first often wins the market." },
            { title: "Customers who don't come back", body: "Without a direct channel, you depend on them remembering you. An app with useful notifications brings them back." },
            { title: "Processes stuck on paper", body: "Bookings by phone, untracked cash payments, follow-up over scattered messages. All of it can live in an app." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "A complete product, not just pretty screens.",
          items: [
            { title: "Product strategy", body: "We define with you a first version that solves what matters most, so you launch fast and learn." },
            { title: "UX/UI design", body: "Prototypes you try before development, so the app feels natural from the first tap." },
            { title: "iOS and Android", body: "One modern codebase for both platforms, with native performance." },
            { title: "Real features", body: "Accounts, bookings, payments, maps, live tracking and notifications, as you need them." },
            { title: "App store launch", body: "We handle the App Store and Google Play publishing process." },
            { title: "Admin panel", body: "An internal web dashboard to manage users, content and orders." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Bookings by phone and scattered messages", after: "Bookings in two taps, with automatic confirmation" },
            { before: "Customers who forget about you", after: "Useful notifications that bring them back" },
            { before: "An idea on a napkin", after: "A published app in the hands of real users" },
            { before: "Not knowing how people use your service", after: "Clear data to decide what to improve" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["On-demand services", "Gyms & academies", "Restaurants with delivery", "Startups", "Communities & schools", "Loyalty programs"] },
        faq: [
          { q: "How long does an app take?", a: "It depends on scope. We usually start with a focused first version so you launch fast. You get a real timeline on the call." },
          { q: "Have you built apps before?", a: "Yes. We delivered a custom app and are building a dog-walking app with bookings, live tracking and payments." },
          { q: "Do I own the app?", a: "Yes. When we're done, the code and design are 100% yours." },
        ],
        cta: { title: "Your idea deserves to leave your head.", body: "Tell us about it on a free call. We'll help you define the first version and show you how it would look." },
      },
    },
  },

  /* ─────────────────────────────── 5. CUSTOM SYSTEMS ─────────────────────────────── */
  {
    key: "systems",
    slug: "sistemas-a-medida",
    need: 4,
    copy: {
      es: {
        title: "Sistemas a medida: CRM, ERP, SIS y POS",
        short: "Sistemas de gestión construidos alrededor de cómo trabajas de verdad.",
        cost: "Información repartida en cuadernos, planillas y la memoria de alguien.",
        outcome: "Todo en un solo lugar",
        meta: {
          title: "CRM, ERP, SIS y POS a medida en Bolivia | Elevated Tech",
          description:
            "Desarrollamos sistemas de gestión a medida: CRM, ERP, sistemas escolares (SIS) y puntos de venta (POS). Hechos para cómo trabaja tu equipo. Santa Cruz de la Sierra.",
        },
        hero: {
          eyebrow: "CRM · ERP · SIS · POS",
          title: "Un sistema que se adapta a tu negocio, no al revés.",
          lead: "Los sistemas genéricos te obligan a trabajar como ellos quieren, y terminas con parches, planillas al costado y un equipo frustrado. Construimos sistemas a medida para tu forma real de vender, cobrar, enseñar o atender, con pantallas tan claras que tu equipo los aprende en un día.",
          primary: "Quiero mi sistema",
        },
        costOfWaiting: {
          title: "Lo que te cuesta trabajar sin un sistema a tu medida",
          body: "No es falta de orden. Es que las herramientas que tienes no fueron hechas para tu negocio.",
          items: [
            { title: "Decisiones a ciegas", body: "Si los datos están en cinco lugares distintos, saber cuánto vendiste o quién te debe toma horas, y llega tarde." },
            { title: "Plata que se escapa", body: "Cobros que se olvidan, inventario que no cuadra, descuentos sin control. Pequeñas fugas que suman mucho." },
            { title: "Software que tu equipo odia", body: "Un sistema complicado no se usa bien. Y un sistema que no se usa bien es plata tirada." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "Hemos trabajado en colegios, restaurantes y hoteles antes de construirles software. Diseñamos para el día a día real.",
          items: [
            { title: "CRM", body: "Clientes, oportunidades y seguimientos en un solo lugar, para que ninguna venta se enfríe." },
            { title: "ERP", body: "Inventario, compras, ventas y finanzas conectados, con reportes claros." },
            { title: "SIS para colegios", body: "Estudiantes, notas, asistencia, pensiones y portal para padres. Conocemos los portales escolares por dentro y sabemos qué mejorar." },
            { title: "POS para restaurantes y tiendas", body: "Mesas, pedidos, comandas a cocina y cierre de caja en segundos." },
            { title: "Accesos por rol", body: "Cada persona ve solo lo que necesita: dueño, administración, caja, docentes o padres." },
            { title: "Seguro y rápido", body: "Backend sólido, copias de seguridad y una interfaz ágil incluso en equipos modestos." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Cuadernos, planillas y mensajes sueltos", after: "Toda la información en un solo sistema" },
            { before: "Cerrar caja a mano a medianoche", after: "Cierre de caja en segundos, cuadrado al centavo" },
            { before: "Padres llamando para preguntar notas o pagos", after: "Un portal donde lo ven todo, cuando quieren" },
            { before: "Adivinar qué se vende y qué no", after: "Reportes claros para decidir con datos" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Colegios e institutos", "Restaurantes", "Distribuidoras", "Tiendas con inventario", "Empresas de servicios", "Equipos comerciales"] },
        faq: [
          { q: "¿No es más barato un sistema genérico?", a: "Al principio puede parecerlo. Pero si te obliga a cambiar cómo trabajas o a mantener planillas al costado, el costo real aparece cada mes." },
          { q: "¿Pueden migrar mis datos actuales?", a: "Sí. Importamos tu información desde planillas u otros sistemas para que empieces sin perder nada." },
          { q: "¿Mi equipo va a poder usarlo?", a: "Ese es el punto. Diseñamos con tu equipo, probamos con ellos y los capacitamos antes del lanzamiento." },
        ],
        cta: { title: "Ordena tu negocio de una vez.", body: "En una llamada gratis entendemos cómo trabajas y te mostramos cómo se vería tu sistema antes de construirlo." },
      },
      en: {
        title: "Custom systems: CRM, ERP, SIS & POS",
        short: "Operating systems built around how you really work.",
        cost: "Information scattered across notebooks, spreadsheets and someone's memory.",
        outcome: "Everything in one place",
        meta: {
          title: "Custom CRM, ERP, SIS & POS systems | Elevated Tech",
          description:
            "We build custom management systems: CRM, ERP, school information systems (SIS) and point of sale (POS), designed around how your team actually works. Santa Cruz de la Sierra, Bolivia.",
        },
        hero: {
          eyebrow: "CRM · ERP · SIS · POS",
          title: "A system that adapts to your business, not the other way around.",
          lead: "Off-the-shelf systems force you to work their way, and you end up with workarounds, side spreadsheets and a frustrated team. We build custom systems for the way you actually sell, collect, teach or serve, with screens so clear your team learns them in a day.",
          primary: "Build my system",
        },
        costOfWaiting: {
          title: "What working without the right system is costing you",
          body: "It isn't a lack of discipline. The tools you have simply weren't made for your business.",
          items: [
            { title: "Flying blind", body: "When data lives in five places, knowing what you sold or who owes you takes hours, and arrives too late." },
            { title: "Money slipping away", body: "Forgotten payments, inventory that doesn't add up, untracked discounts. Small leaks that add up fast." },
            { title: "Software your team hates", body: "A complicated system doesn't get used properly. And a system nobody uses properly is money down the drain." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "We worked in schools, restaurants and hotels before building software for them. We design for the real day-to-day.",
          items: [
            { title: "CRM", body: "Customers, deals and follow-ups in one place, so no sale goes cold." },
            { title: "ERP", body: "Inventory, purchasing, sales and finance connected, with clear reports." },
            { title: "SIS for schools", body: "Students, grades, attendance, tuition and a parent portal. We know school portals from the inside and what to improve." },
            { title: "POS for restaurants and shops", body: "Tables, orders, kitchen tickets and closing the register in seconds." },
            { title: "Role-based access", body: "Everyone sees only what they need: owner, admin, cashier, teachers or parents." },
            { title: "Secure and fast", body: "A solid backend, backups and a snappy interface, even on modest computers." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Notebooks, spreadsheets and loose messages", after: "All your information in one system" },
            { before: "Closing the register by hand at midnight", after: "Closing in seconds, balanced to the cent" },
            { before: "Parents calling to ask about grades or payments", after: "A portal where they see everything, anytime" },
            { before: "Guessing what sells and what doesn't", after: "Clear reports to decide with data" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["Schools & institutes", "Restaurants", "Distributors", "Shops with inventory", "Service companies", "Sales teams"] },
        faq: [
          { q: "Isn't an off-the-shelf system cheaper?", a: "At first it can look that way. But if it forces you to change how you work or keep spreadsheets on the side, the real cost shows up every month." },
          { q: "Can you migrate my current data?", a: "Yes. We import your information from spreadsheets or other systems so you start without losing anything." },
          { q: "Will my team be able to use it?", a: "That's the whole point. We design with your team, test with them and train them before launch." },
        ],
        cta: { title: "Get your business organized for good.", body: "On a free call we learn how you work and show you how your system would look before we build it." },
      },
    },
  },

  /* ─────────────────────────────── 6. UX/UI ─────────────────────────────── */
  {
    key: "ux",
    slug: "diseno-ux-ui",
    need: 0,
    copy: {
      es: {
        title: "Diseño UX/UI",
        short: "Interfaces claras y hermosas, probadas con personas reales.",
        cost: "Usuarios que se confunden, se frustran y abandonan.",
        outcome: "Usuarios más felices",
        meta: {
          title: "Diseño UX/UI de webs, apps y sistemas en Bolivia | Elevated Tech",
          description:
            "Diseño UX/UI de webs, apps y sistemas: investigación, prototipos y pruebas con usuarios reales para productos claros, hermosos y fáciles de usar. Santa Cruz de la Sierra.",
        },
        hero: {
          eyebrow: "Diseño UX/UI",
          title: "Cuando algo es fácil de usar, la gente lo usa. Y vuelve.",
          lead: "El buen diseño no es decoración: es la diferencia entre un cliente que compra y uno que se rinde. Investigamos cómo piensa tu usuario, prototipamos y probamos con personas reales antes de escribir una línea de código, para que tu producto se sienta obvio desde el primer toque.",
          primary: "Quiero mejorar mi diseño",
        },
        costOfWaiting: {
          title: "Lo que te cuesta un mal diseño",
          body: "Nadie te escribe para decirte que tu app es confusa. Simplemente dejan de usarla.",
          items: [
            { title: "Abandono silencioso", body: "Formularios largos, botones escondidos, pasos de más. Cada fricción es un cliente que se va a mitad de camino." },
            { title: "Soporte que no da abasto", body: "Si la gente no entiende cómo usar algo, te escribe. Un diseño claro responde antes de que pregunten." },
            { title: "Desarrollo que se repite", body: "Corregir un problema de diseño después de programarlo cuesta mucho más que resolverlo en un prototipo." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "Diseño con criterio, basado en cómo usa la gente las cosas de verdad.",
          items: [
            { title: "Investigación", body: "Entrevistas y observación para entender a tus usuarios y sus frustraciones reales." },
            { title: "Arquitectura y flujos", body: "Ordenamos la información y los pasos para que cada tarea tome lo mínimo." },
            { title: "Prototipos interactivos", body: "Pruebas tu producto antes de construirlo y decides con algo tangible en la mano." },
            { title: "Pruebas con usuarios", body: "Vemos a personas reales usarlo y corregimos lo que se traba." },
            { title: "Diseño visual", body: "Una interfaz hermosa, coherente con tu marca y accesible para todos." },
            { title: "Sistema de diseño", body: "Componentes y reglas documentadas para que tu producto crezca sin perder coherencia." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Usuarios que no encuentran lo que buscan", after: "Caminos obvios hacia lo importante" },
            { before: "Opiniones internas sobre qué color usar", after: "Decisiones basadas en cómo usa la gente el producto" },
            { before: "Rediseñar después de programar", after: "Validar en prototipo y construir una sola vez" },
            { before: "Una marca que se ve distinta en cada pantalla", after: "Una experiencia coherente y profesional" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Apps que ya existen y no despegan", "Sistemas internos", "Startups antes de programar", "Portales escolares", "Tiendas online", "Rediseños de marca"] },
        faq: [
          { q: "¿Solo diseñan o también desarrollan?", a: "Las dos cosas. Puedes contratarnos solo para el diseño o para todo el producto, de principio a fin." },
          { q: "¿Pueden mejorar algo que ya tengo?", a: "Sí. Empezamos con una revisión de tu producto actual y priorizamos las mejoras que más impacto tienen." },
          { q: "¿Quién lidera el diseño?", a: "Marvin, nuestro diseñador UX/UI. Viene de trabajar en restaurantes y en educación, así que diseña para el uso real, no para la foto." },
        ],
        cta: { title: "Haz que usar tu producto se sienta fácil.", body: "Muéstranos lo que tienes o lo que imaginas. En una llamada gratis te decimos qué mejoraríamos primero." },
      },
      en: {
        title: "UX/UI design",
        short: "Clear, beautiful interfaces tested with real people.",
        cost: "Users who get confused, frustrated and give up.",
        outcome: "Happier users",
        meta: {
          title: "UX/UI design for websites, apps & systems | Elevated Tech",
          description:
            "UX/UI design for websites, apps and systems: research, prototypes and real-user testing for products that are clear, beautiful and easy to use. Santa Cruz de la Sierra, Bolivia.",
        },
        hero: {
          eyebrow: "UX/UI design",
          title: "When something is easy to use, people use it. And come back.",
          lead: "Good design isn't decoration: it's the difference between a customer who buys and one who gives up. We study how your users think, prototype and test with real people before writing a line of code, so your product feels obvious from the very first tap.",
          primary: "Improve my design",
        },
        costOfWaiting: {
          title: "What bad design is costing you",
          body: "Nobody writes to tell you your app is confusing. They just stop using it.",
          items: [
            { title: "Silent drop-off", body: "Long forms, hidden buttons, extra steps. Every bit of friction is a customer leaving halfway." },
            { title: "Support that can't keep up", body: "When people can't figure something out, they message you. Clear design answers before they ask." },
            { title: "Building things twice", body: "Fixing a design problem after it's coded costs far more than solving it in a prototype." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "Design with judgment, grounded in how people actually use things.",
          items: [
            { title: "Research", body: "Interviews and observation to understand your users and their real frustrations." },
            { title: "Architecture & flows", body: "We organize information and steps so every task takes as little as possible." },
            { title: "Interactive prototypes", body: "You try your product before it's built and decide with something tangible in hand." },
            { title: "User testing", body: "We watch real people use it and fix whatever gets in their way." },
            { title: "Visual design", body: "A beautiful interface, true to your brand and accessible to everyone." },
            { title: "Design system", body: "Documented components and rules so your product grows without losing consistency." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Users who can't find what they need", after: "Obvious paths to what matters" },
            { before: "Internal debates about which color to use", after: "Decisions based on how people use the product" },
            { before: "Redesigning after development", after: "Validating in a prototype and building once" },
            { before: "A brand that looks different on every screen", after: "A consistent, professional experience" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["Existing apps that aren't taking off", "Internal systems", "Startups before coding", "School portals", "Online stores", "Brand redesigns"] },
        faq: [
          { q: "Do you only design, or build too?", a: "Both. You can hire us for design only or for the whole product, start to finish." },
          { q: "Can you improve something I already have?", a: "Yes. We start with a review of your current product and prioritize the improvements with the biggest impact." },
          { q: "Who leads design?", a: "Marvin, our UX/UI designer. He's worked in restaurants and in education, so he designs for real use, not for the photo." },
        ],
        cta: { title: "Make using your product feel effortless.", body: "Show us what you have or what you're imagining. On a free call we'll tell you what we'd improve first." },
      },
    },
  },

  /* ─────────────────────────────── 7. AI CONTENT ─────────────────────────────── */
  {
    key: "content",
    slug: "contenido-ia",
    need: 6,
    copy: {
      es: {
        title: "Contenido con IA",
        short: "UGC, imágenes y videos generados con IA para tu marca.",
        cost: "Semanas sin publicar porque producir contenido es caro y lento.",
        outcome: "Más contenido, menor costo",
        meta: {
          title: "Contenido con IA: UGC, imágenes y videos para marcas | Elevated Tech",
          description:
            "Creamos contenido con IA para tu marca: videos estilo UGC, fotos de producto e imágenes para campañas. Más contenido, más rápido y a menor costo. Santa Cruz de la Sierra.",
        },
        hero: {
          eyebrow: "Contenido con IA",
          title: "Contenido de calidad, todas las semanas, sin un estudio de producción.",
          lead: "Las marcas que crecen publican seguido, y producir fotos y videos a la antigua es caro y lento. Combinamos inteligencia artificial con criterio de marca para crear videos estilo UGC, fotos de producto e imágenes de campaña que se ven bien, se sienten tuyas y llegan a tiempo.",
          primary: "Quiero más contenido",
        },
        costOfWaiting: {
          title: "Lo que te cuesta no tener contenido constante",
          body: "No es que no sepas qué publicar. Es que producirlo te quita tiempo y plata que no siempre tienes.",
          items: [
            { title: "Desaparecer del feed", body: "Si publicas poco, los algoritmos te muestran poco. Y lo que no se ve, no se vende." },
            { title: "Producciones que no escalan", body: "Una sesión de fotos para cada producto o campaña hace que probar ideas nuevas sea carísimo." },
            { title: "Anuncios que se cansan", body: "La misma imagen durante meses pierde efecto. Variedad de creatividades es lo que mantiene vivas las campañas." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "IA con criterio humano: cada pieza pasa por nuestro ojo antes de llegar al tuyo.",
          items: [
            { title: "Videos estilo UGC", body: "Videos cortos con el estilo cercano de las reseñas reales, ideales para redes y anuncios." },
            { title: "Fotos de producto", body: "Tus productos en escenas y ambientes nuevos, sin organizar una sesión cada vez." },
            { title: "Imágenes de campaña", body: "Piezas para promociones, fechas especiales y lanzamientos, coherentes con tu marca." },
            { title: "Variaciones para anuncios", body: "Varias versiones de cada idea para probar qué funciona mejor." },
            { title: "Guiones y textos", body: "Ganchos, guiones y textos que acompañan cada pieza." },
            { title: "Uso responsable", body: "Contenido transparente y respetuoso: nada de testimonios falsos ni personas reales sin permiso." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Publicar cuando hay tiempo", after: "Un calendario de contenido que se cumple" },
            { before: "Una sola foto por producto", after: "Variedad de escenas y formatos" },
            { before: "Esperar semanas por una producción", after: "Contenido listo en días" },
            { before: "Probar una idea de anuncio a la vez", after: "Probar varias y quedarte con la que funciona" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Marcas de producto", "Restaurantes", "Tiendas online", "Lanzamientos", "Campañas pagadas", "Emprendimientos"] },
        faq: [
          { q: "¿Se nota que es IA?", a: "Cuidamos cada pieza para que se vea natural y de calidad. Y somos transparentes: no creamos contenido que engañe a tus clientes." },
          { q: "¿Pueden usar mis productos reales?", a: "Sí. Partimos de fotos reales de tus productos para que lo que el cliente ve sea lo que recibe." },
          { q: "¿También lo publican?", a: "Si quieres, lo combinamos con nuestro servicio de redes sociales y nos encargamos de todo." },
        ],
        cta: { title: "Que tu marca se vea, todas las semanas.", body: "Cuéntanos qué vendes y a quién. Te preparamos ideas de contenido sin compromiso." },
      },
      en: {
        title: "AI content",
        short: "AI-generated UGC, images and videos for your brand.",
        cost: "Weeks without posting because content is slow and expensive.",
        outcome: "More content, lower cost",
        meta: {
          title: "AI content: UGC, images & videos for brands | Elevated Tech",
          description:
            "We create AI content for your brand: UGC-style videos, product photos and campaign images. More content, faster and at lower cost. Santa Cruz de la Sierra, Bolivia.",
        },
        hero: {
          eyebrow: "AI content",
          title: "Quality content every week, without a production studio.",
          lead: "Growing brands post often, and producing photos and videos the old way is slow and expensive. We combine AI with brand judgment to create UGC-style videos, product photos and campaign images that look great, feel like you and arrive on time.",
          primary: "I want more content",
        },
        costOfWaiting: {
          title: "What inconsistent content is costing you",
          body: "It's not that you don't know what to post. It's that producing it takes time and money you don't always have.",
          items: [
            { title: "Vanishing from the feed", body: "Post rarely and algorithms show you rarely. What isn't seen doesn't sell." },
            { title: "Productions that don't scale", body: "A photo shoot for every product or campaign makes testing new ideas very expensive." },
            { title: "Ads that wear out", body: "The same image for months loses impact. Creative variety is what keeps campaigns alive." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "AI with human judgment: every piece passes our eye before it reaches yours.",
          items: [
            { title: "UGC-style videos", body: "Short videos with the relatable feel of real reviews, ideal for social and ads." },
            { title: "Product photos", body: "Your products in new scenes and settings, without organizing a shoot each time." },
            { title: "Campaign images", body: "Pieces for promotions, special dates and launches, consistent with your brand." },
            { title: "Ad variations", body: "Several versions of every idea so you can test what works best." },
            { title: "Scripts and copy", body: "Hooks, scripts and captions to go with every piece." },
            { title: "Responsible use", body: "Transparent, respectful content: no fake testimonials and no real people without permission." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Posting when there's time", after: "A content calendar you actually keep" },
            { before: "One photo per product", after: "A variety of scenes and formats" },
            { before: "Waiting weeks for a production", after: "Content ready in days" },
            { before: "Testing one ad idea at a time", after: "Testing several and keeping the winner" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["Product brands", "Restaurants", "Online stores", "Launches", "Paid campaigns", "Startups"] },
        faq: [
          { q: "Can you tell it's AI?", a: "We polish every piece so it looks natural and high quality. And we're transparent: we never create content that misleads your customers." },
          { q: "Can you use my real products?", a: "Yes. We start from real photos of your products so what customers see is what they get." },
          { q: "Do you post it too?", a: "If you'd like, we pair it with our social media service and handle everything." },
        ],
        cta: { title: "Let your brand be seen, every week.", body: "Tell us what you sell and to whom. We'll prepare content ideas for you, no strings attached." },
      },
    },
  },

  /* ─────────────────────────────── 8. SOCIAL MEDIA ─────────────────────────────── */
  {
    key: "social",
    slug: "redes-sociales",
    need: 6,
    copy: {
      es: {
        title: "Redes sociales",
        short: "Estrategia y gestión que hacen crecer tu marca en línea.",
        cost: "Publicar sin rumbo y no ver resultados.",
        outcome: "Más alcance",
        meta: {
          title: "Gestión de redes sociales para negocios en Bolivia | Elevated Tech",
          description:
            "Estrategia, contenido y gestión de redes sociales para negocios en Bolivia. Publicaciones con propósito, comunidad activa y campañas medibles. Santa Cruz de la Sierra.",
        },
        hero: {
          eyebrow: "Redes sociales",
          title: "Redes con propósito: menos publicar por publicar, más clientes que te eligen.",
          lead: "Tus redes son la vitrina que la gente revisa antes de confiar en ti. Definimos una estrategia clara, creamos contenido que conecta con tu público y gestionamos tus cuentas para que crezcan con constancia, mientras tú te dedicas a tu negocio.",
          primary: "Quiero crecer en redes",
        },
        costOfWaiting: {
          title: "Lo que te cuesta manejar tus redes sin estrategia",
          body: "Sabemos lo que es: entre atender el negocio y todo lo demás, las redes quedan para cuando sobra tiempo. Y nunca sobra.",
          items: [
            { title: "Esfuerzo sin dirección", body: "Publicar sin un plan consume tiempo y rara vez trae clientes. No es falta de ganas: es falta de estrategia." },
            { title: "Una vitrina descuidada", body: "Una cuenta abandonada hace dudar a quien te descubre. Una cuenta activa y coherente genera confianza." },
            { title: "Plata en anuncios mal dirigidos", body: "Promocionar publicaciones sin segmentar ni medir es la forma más rápida de gastar sin ver resultados." },
          ],
        },
        offer: {
          title: "Lo que hacemos por ti",
          body: "Estrategia, contenido y gestión, con números claros cada mes.",
          items: [
            { title: "Estrategia de marca", body: "Definimos a quién le hablas, qué te diferencia y qué tipo de contenido te acerca a tus objetivos." },
            { title: "Calendario de contenido", body: "Un plan mensual de publicaciones que apruebas antes de que salga." },
            { title: "Diseño y producción", body: "Piezas gráficas, reels y textos con identidad propia, potenciados con IA cuando suma." },
            { title: "Gestión de comunidad", body: "Respondemos comentarios y mensajes con el tono de tu marca." },
            { title: "Campañas pagadas", body: "Anuncios bien segmentados y medidos para que cada boliviano invertido rinda." },
            { title: "Reportes claros", body: "Cada mes te mostramos qué funcionó, qué no y qué haremos distinto." },
          ],
        },
        change: {
          title: "Lo que cambia",
          items: [
            { before: "Publicar cuando te acuerdas", after: "Presencia constante y planificada" },
            { before: "Contenido que no se parece entre sí", after: "Una identidad reconocible en cada publicación" },
            { before: "Promocionar a ciegas", after: "Campañas medidas y ajustadas con datos" },
            { before: "No saber si las redes sirven", after: "Un reporte mensual claro y honesto" },
          ],
        },
        idealFor: { title: "Ideal para", items: ["Restaurantes y cafés", "Tiendas y marcas", "Colegios e institutos", "Clínicas", "Profesionales independientes", "Lanzamientos"] },
        faq: [
          { q: "¿Qué redes manejan?", a: "Las que tengan sentido para tu negocio: normalmente Instagram, Facebook y TikTok, y LinkedIn para servicios a empresas." },
          { q: "¿Garantizan seguidores?", a: "No prometemos números mágicos. Prometemos estrategia, constancia y reportes honestos para crecer de forma real." },
          { q: "¿Quién lleva las redes?", a: "Alex lidera redes, ventas y marca, con el apoyo del resto del equipo en diseño y contenido." },
        ],
        cta: { title: "Que tus redes trabajen para tu negocio.", body: "En una llamada gratis revisamos tus cuentas y te damos ideas concretas para empezar." },
      },
      en: {
        title: "Social media",
        short: "Strategy and management that grows your brand online.",
        cost: "Posting without direction and seeing no results.",
        outcome: "More reach",
        meta: {
          title: "Social media management | Elevated Tech",
          description:
            "Social media strategy, content and management for businesses. Purposeful posts, an active community and measurable campaigns. Built in Santa Cruz de la Sierra, Bolivia.",
        },
        hero: {
          eyebrow: "Social media",
          title: "Social media with purpose: less posting for the sake of it, more customers choosing you.",
          lead: "Your social accounts are the storefront people check before they trust you. We define a clear strategy, create content that connects with your audience and manage your accounts so they grow steadily, while you focus on your business.",
          primary: "Grow my social media",
        },
        costOfWaiting: {
          title: "What social media without a strategy is costing you",
          body: "We get it: between running the business and everything else, social media waits until there's spare time. There never is.",
          items: [
            { title: "Effort without direction", body: "Posting without a plan eats time and rarely brings customers. It's not a lack of effort: it's a lack of strategy." },
            { title: "A neglected storefront", body: "An abandoned account makes new people hesitate. An active, consistent one builds trust." },
            { title: "Money on poorly targeted ads", body: "Boosting posts without targeting or measuring is the fastest way to spend without results." },
          ],
        },
        offer: {
          title: "What we do for you",
          body: "Strategy, content and management, with clear numbers every month.",
          items: [
            { title: "Brand strategy", body: "We define who you're talking to, what sets you apart and which content moves you toward your goals." },
            { title: "Content calendar", body: "A monthly posting plan you approve before anything goes live." },
            { title: "Design and production", body: "Graphics, reels and copy with a distinct identity, boosted by AI where it helps." },
            { title: "Community management", body: "We reply to comments and messages in your brand's voice." },
            { title: "Paid campaigns", body: "Well-targeted, measured ads so every boliviano you invest works harder." },
            { title: "Clear reports", body: "Every month we show you what worked, what didn't and what we'll do differently." },
          ],
        },
        change: {
          title: "What changes",
          items: [
            { before: "Posting when you remember", after: "A steady, planned presence" },
            { before: "Posts that look nothing alike", after: "A recognizable identity in every post" },
            { before: "Boosting blindly", after: "Campaigns measured and tuned with data" },
            { before: "Not knowing if social media pays off", after: "A clear, honest monthly report" },
          ],
        },
        idealFor: { title: "Ideal for", items: ["Restaurants & cafés", "Shops & brands", "Schools & institutes", "Clinics", "Independent professionals", "Launches"] },
        faq: [
          { q: "Which platforms do you manage?", a: "Whichever make sense for your business: usually Instagram, Facebook and TikTok, plus LinkedIn for B2B services." },
          { q: "Do you guarantee followers?", a: "We don't promise magic numbers. We promise strategy, consistency and honest reports to grow for real." },
          { q: "Who runs the accounts?", a: "Alex leads social media, sales and branding, supported by the rest of the team on design and content." },
        ],
        cta: { title: "Make your social media work for your business.", body: "On a free call we review your accounts and give you concrete ideas to start." },
      },
    },
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/** Labels for the service pages' shared UI. */
export const serviceUi: Record<
  Locale,
  {
    viewService: string;
    costLabel: string;
    allServices: string;
    breadcrumbHome: string;
    whatsapp: string;
    processTitle: string;
    faqTitle: string;
    otherServices: string;
    before: string;
    after: string;
  }
> = {
  es: {
    viewService: "Ver servicio",
    costLabel: "Hoy te cuesta",
    allServices: "Todos los servicios",
    breadcrumbHome: "Inicio",
    whatsapp: "Escríbenos por WhatsApp",
    processTitle: "Cómo trabajamos",
    faqTitle: "Preguntas frecuentes",
    otherServices: "Otros servicios",
    before: "Antes",
    after: "Con Elevated Tech",
  },
  en: {
    viewService: "View service",
    costLabel: "Today it costs you",
    allServices: "All services",
    breadcrumbHome: "Home",
    whatsapp: "Message us on WhatsApp",
    processTitle: "How we work",
    faqTitle: "Frequently asked questions",
    otherServices: "Other services",
    before: "Before",
    after: "With Elevated Tech",
  },
};
