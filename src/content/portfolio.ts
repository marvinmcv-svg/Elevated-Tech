/**
 * PORTFOLIO — every live project on the site, in ES and EN.
 * Each one links to the real, working site. `embed: false` means the site refuses to load inside
 * an iframe (X-Frame-Options), so the preview opens it in a new tab instead.
 * Edit here to add, remove or reorder projects; the grid, the filters, the preview window,
 * the featured sections and El-IAs all read from this file.
 */

type T = { es: string; en: string };

export type Category = "schools" | "restaurants" | "brands" | "apps" | "portfolios";

export type Cover = {
  /** Visual treatment of the card cover (an illustrated browser or phone in the client's colours). */
  device: "browser" | "phone";
  bg: string;
  fg: string;
  accent: string;
  /** Typeface family that echoes the real site. */
  face: "sans" | "serif" | "display" | "mono";
  /** Small label above the headline (e.g. "Est. 1955"). */
  kicker: T;
  /** The real headline of the live site. */
  headline: T;
  /** Optional big monogram or number behind the headline. */
  mark?: string;
};

export type Project = {
  key: string;
  name: string;
  url: string;
  embed: boolean;
  category: Category;
  type: T;
  city: string;
  problem: T;
  solution: T;
  highlights: { es: string[]; en: string[] };
  cover: Cover;
};

export const categories: Record<Category | "all", T> = {
  all: { es: "Todos", en: "All" },
  schools: { es: "Colegios", en: "Schools" },
  restaurants: { es: "Restaurantes", en: "Restaurants" },
  brands: { es: "Marcas y empresas", en: "Brands" },
  apps: { es: "Apps", en: "Apps" },
  portfolios: { es: "Portafolios", en: "Portfolios" },
};

export const projects: Project[] = [
  {
    key: "restobar-os",
    name: "RestoBar OS",
    url: "https://restobar-os.vercel.app/",
    embed: true,
    category: "restaurants",
    type: { es: "Sistema POS · SaaS", en: "POS system · SaaS" },
    city: "Santa Cruz",
    problem: {
      es: "Comandas en papel que se pierden, ventas que se borran y la caja cerrada a mano a medianoche.",
      en: "Paper tickets that get lost, sales that get deleted and the register closed by hand at midnight.",
    },
    solution: {
      es: "Un POS en la nube: pedidos desde el celular del mesero, pantalla de cocina, permisos por rol y el cierre del día en WhatsApp.",
      en: "A cloud POS: orders from the waiter's phone, kitchen display, role permissions and the daily close on WhatsApp.",
    },
    highlights: {
      es: ["Pedidos desde el celular del mesero", "Pantalla de cocina con tiempos", "Anular pide PIN del encargado", "Cierre diario por WhatsApp"],
      en: ["Orders from the waiter's own phone", "Kitchen display with timers", "Voids need a manager PIN", "Daily close on WhatsApp"],
    },
    cover: {
      device: "browser",
      bg: "#0b1510",
      fg: "#ffffff",
      accent: "#19e36b",
      face: "sans",
      kicker: { es: "Para restaurantes y bares", en: "For restaurants and bars" },
      headline: { es: "Tu restaurante, bajo control. Desde tu celular.", en: "Your restaurant, under control. From your phone." },
    },
  },
  {
    key: "sccs-student-os",
    name: "SCCS Student OS",
    url: "https://sccs-student-os.vercel.app/welcome",
    embed: true,
    category: "schools",
    type: { es: "App web para colegios", en: "School web app" },
    city: "Santa Cruz",
    problem: {
      es: "Reportes de conducta en papel, alertas sin explicación y un sistema académico lleno de pantallas.",
      en: "Paper behavior referrals, unexplained alerts and a student system buried in screens.",
    },
    solution: {
      es: "Un espacio bilingüe que junta conducta, apoyo al aprendizaje y alertas tempranas, con los mismos códigos del SIS.",
      en: "One bilingual workspace for behavior, learning support and early warning, using the same codes as the SIS.",
    },
    highlights: {
      es: ["Reportes con los códigos del SIS", "Reconocimientos en dos toques (PBIS)", "Alertas tempranas que explican el porqué", "Búsqueda instantánea con Ctrl K"],
      en: ["Referrals with the SIS's own codes", "Recognition in two taps (PBIS)", "Early warning that explains itself", "Instant search with Ctrl K"],
    },
    cover: {
      device: "browser",
      bg: "#f4f1ea",
      fg: "#111827",
      accent: "#b91c1c",
      face: "sans",
      kicker: { es: "Conducta · Apoyo · Alertas", en: "Behavior · Support · Early warning" },
      headline: { es: "Cada alumno, visto con claridad.", en: "Every student, seen clearly." },
    },
  },
  {
    key: "helibol",
    name: "Helibol",
    url: "https://helibol.vercel.app/es",
    embed: true,
    category: "brands",
    type: { es: "Web corporativa", en: "Corporate website" },
    city: "Santa Cruz",
    problem: {
      es: "Un operador de helicópteros con 38 años de experiencia y una web que no lo reflejaba.",
      en: "A helicopter operator with 38 years of experience and a website that didn't show it.",
    },
    solution: {
      es: "Una web bilingüe con su flota, sus misiones y un asistente con IA que recibe pedidos de cotización.",
      en: "A bilingual site with its fleet, its missions and an AI assistant that takes quote requests.",
    },
    highlights: {
      es: ["Servicios por misión", "Flota Bell 212, Bell 412 y H125", "Asistente con IA (Heli)", "Cotización directa"],
      en: ["Services by mission", "Bell 212, Bell 412 and H125 fleet", "AI assistant (Heli)", "Direct quote requests"],
    },
    cover: {
      device: "browser",
      bg: "#06131f",
      fg: "#ffffff",
      accent: "#f59e0b",
      face: "display",
      kicker: { es: "Est. 1988 · Santa Cruz", en: "Est. 1988 · Santa Cruz" },
      headline: { es: "Donde terminan los caminos, empezamos nosotros.", en: "Where the roads end, we begin." },
    },
  },
  {
    key: "haras-la-alhambra",
    name: "Haras La Alhambra",
    url: "https://haras-la-alhambra.vercel.app/",
    embed: true,
    category: "brands",
    type: { es: "Web de marca · Ecuestre", en: "Brand website · Equestrian" },
    city: "Santa Cruz",
    problem: {
      es: "Tres décadas criando caballos de élite, contadas solo por Instagram.",
      en: "Three decades breeding elite horses, told only through Instagram.",
    },
    solution: {
      es: "Una web cinematográfica con sus linajes, su escuela de equitación, sus eventos y Spirit, un asistente con IA.",
      en: "A cinematic site with its bloodlines, riding school, events and Spirit, an AI assistant.",
    },
    highlights: {
      es: ["Intro en video a través de las letras", "Escuela de equitación y tarifas", "Bilingüe ES / EN", "Asistente con IA (Spirit)"],
      en: ["Video intro through the letters", "Riding school and rates", "Bilingual ES / EN", "AI assistant (Spirit)"],
    },
    cover: {
      device: "browser",
      bg: "#0f0d0b",
      fg: "#f4ead8",
      accent: "#c9a45c",
      face: "serif",
      kicker: { es: "Desde 1993", en: "Since 1993" },
      headline: { es: "Criados con paciencia. Seleccionados con rigor.", en: "Raised with patience. Selected with rigor." },
      mark: "LA",
    },
  },
  {
    key: "don-corte-fino",
    name: "Don Corte Fino",
    url: "https://new-don-corte-fino.vercel.app/en",
    embed: true,
    category: "restaurants",
    type: { es: "E-commerce · Carnes premium", en: "E-commerce · Premium beef" },
    city: "Santa Cruz",
    problem: {
      es: "Una carne premium (Wagyu × Angus) que se vendía solo por chat, sin explicar por qué vale lo que cuesta.",
      en: "A premium beef (Wagyu × Angus) sold only through chat, with nothing explaining why it's worth it.",
    },
    solution: {
      es: "Una tienda con guía de cortes, cajas armadas y pedidos por WhatsApp con delivery en Santa Cruz.",
      en: "A shop with a cut guide, curated boxes and WhatsApp ordering with delivery across Santa Cruz.",
    },
    highlights: {
      es: ["Guía de cortes interactiva", "Tienda y cajas armadas", "Pedidos por WhatsApp", "Bilingüe ES / EN"],
      en: ["Interactive cut guide", "Shop and curated boxes", "WhatsApp ordering", "Bilingual ES / EN"],
    },
    cover: {
      device: "browser",
      bg: "#1d1d1c",
      fg: "#f5efe6",
      accent: "#c8102e",
      face: "serif",
      kicker: { es: "Wagyu × Angus", en: "Wagyu × Angus" },
      headline: { es: "No es solo carne… es Wangus.", en: "It's not just beef… it's Wangus." },
    },
  },
  {
    key: "fogo-de-chao",
    name: "Fogo de Chão · Ventura Mall",
    url: "https://fogo-de-chao-ventura-sur.vercel.app/es",
    embed: true,
    category: "restaurants",
    type: { es: "Web de restaurante", en: "Restaurant website" },
    city: "Santa Cruz",
    problem: {
      es: "Un restaurante con una experiencia única en sala y nada que la transmitiera en línea.",
      en: "A restaurant with a unique dining-room experience and nothing online to convey it.",
    },
    solution: {
      es: "Una web inmersiva que cuenta el ritual del churrasco y hace que den ganas de ir esta misma noche.",
      en: "An immersive site that tells the churrasco ritual and makes you want to go tonight.",
    },
    highlights: {
      es: ["Animaciones fluidas, también en celular", "El ritual del churrasco", "Diseño inmersivo", "Bilingüe ES / EN"],
      en: ["Smooth animations, on phones too", "The churrasco ritual", "Immersive design", "Bilingual ES / EN"],
    },
    cover: {
      device: "browser",
      bg: "#150d08",
      fg: "#fff4e6",
      accent: "#ff7a3d",
      face: "display",
      kicker: { es: "Ventura Mall · Santa Cruz", en: "Ventura Mall · Santa Cruz" },
      headline: { es: "Fogo de Chão", en: "Fogo de Chão" },
    },
  },
  {
    key: "firu-walk",
    name: "FiruWalk",
    url: "https://firu-walk.vercel.app/",
    embed: true,
    category: "apps",
    type: { es: "App de paseo de perros", en: "Dog-walking app" },
    city: "Santa Cruz",
    problem: {
      es: "Dejar a tu perro con un desconocido sin saber si de verdad lo pasearon.",
      en: "Leaving your dog with a stranger without knowing if it really got walked.",
    },
    solution: {
      es: "Reservas con paseadores verificados, GPS en vivo, reporte con fotos y pago con QR.",
      en: "Bookings with verified walkers, live GPS, a photo report and QR payment.",
    },
    highlights: {
      es: ["Paseadores verificados", "GPS en vivo en cada paseo", "Reporte con fotos", "Pago con QR"],
      en: ["Verified walkers", "Live GPS on every walk", "Photo report", "QR payment"],
    },
    cover: {
      device: "phone",
      bg: "#fff3e6",
      fg: "#2b1b0e",
      accent: "#ff7a1a",
      face: "sans",
      kicker: { es: "Paseo en curso · Equipetrol", en: "Walk in progress · Equipetrol" },
      headline: { es: "Vuelve feliz y cansado. Tú lo ves todo en vivo.", en: "Back home happy and tired. You see it all live." },
    },
  },
  {
    key: "sccs-website",
    name: "Santa Cruz Cooperative School",
    url: "https://sccs-website-eight.vercel.app/",
    embed: true,
    category: "schools",
    type: { es: "Web de colegio", en: "School website" },
    city: "Santa Cruz",
    problem: {
      es: "Familias que no encontraban admisiones, costos ni la propuesta del colegio en una web antigua.",
      en: "Families who couldn't find admissions, fees or what makes the school special on an old site.",
    },
    solution: {
      es: "Una web de admisiones clara: doble diploma, vida estudiantil y una visita al campus agendada en dos minutos.",
      en: "A clear admissions site: dual diploma, student life and a campus tour booked in two minutes.",
    },
    highlights: {
      es: ["Admisiones en tres pasos", "Doble diploma explicado", "Vida estudiantil y clubes", "Búsqueda con ⌘K"],
      en: ["Admissions in three steps", "Dual diploma explained", "Student life and clubs", "Search with ⌘K"],
    },
    cover: {
      device: "browser",
      bg: "#fbf8f1",
      fg: "#14213d",
      accent: "#c8102e",
      face: "serif",
      kicker: { es: "Home of the Jaguars", en: "Home of the Jaguars" },
      headline: { es: "Dos diplomas. Un futuro sin igual.", en: "Two diplomas. One unrivaled future." },
    },
  },
  {
    key: "spc",
    name: "SPC Impresores",
    url: "https://spc-3-0.vercel.app/",
    embed: true,
    category: "brands",
    type: { es: "Web industrial + recepcionista IA", en: "Industrial website + AI receptionist" },
    city: "Santa Cruz",
    problem: {
      es: "Una imprenta líder desde 2001 que respondía cada cotización a mano.",
      en: "A leading printer since 2001 answering every quote request by hand.",
    },
    solution: {
      es: "Una web con sus 9 líneas de producto y SPenCer, una recepcionista con IA que lleva cada cotización a WhatsApp.",
      en: "A site with its 9 product lines and SPenCer, an AI receptionist that takes every quote to WhatsApp.",
    },
    highlights: {
      es: ["Catálogo de 9 líneas", "Recepcionista con IA (SPenCer)", "Cotización por WhatsApp", "Preguntas frecuentes resueltas"],
      en: ["Catalog of 9 product lines", "AI receptionist (SPenCer)", "Quotes via WhatsApp", "FAQs answered up front"],
    },
    cover: {
      device: "browser",
      bg: "#003c8d",
      fg: "#ffffff",
      accent: "#ffd400",
      face: "display",
      kicker: { es: "Gráfica industrial · desde 2001", en: "Industrial printing · since 2001" },
      headline: { es: "Imprimiendo lo mejor de Bolivia.", en: "Printing the best of Bolivia." },
    },
  },
  {
    key: "acs-calvert",
    name: "ACS Calvert",
    url: "https://acs-calvert.vercel.app/en",
    embed: true,
    category: "schools",
    type: { es: "Web de colegio", en: "School website" },
    city: "La Paz",
    problem: {
      es: "Setenta años de historia y un campus único, escondidos detrás de enlaces y PDFs.",
      en: "Seventy years of history and a unique campus, hidden behind links and PDFs.",
    },
    solution: {
      es: "Una web bilingüe que cuenta su historia, muestra el campus y lleva directo a postular o agendar una visita.",
      en: "A bilingual site that tells its story, shows the campus and goes straight to apply or book a tour.",
    },
    highlights: {
      es: ["Desde inicial hasta 12.º", "Recorrido por el campus", "Accesos a PowerSchool y pagos", "Bilingüe ES / EN"],
      en: ["From KG3 to Grade 12", "Campus tour", "Shortcuts to PowerSchool and payments", "Bilingual ES / EN"],
    },
    cover: {
      device: "browser",
      bg: "#003b1e",
      fg: "#ffffff",
      accent: "#f2c230",
      face: "serif",
      kicker: { es: "Est. 1955 · La Paz", en: "Est. 1955 · La Paz" },
      headline: { es: "El colegio americano de Bolivia desde 1955.", en: "Bolivia's American school since 1955." },
    },
  },
  {
    key: "sccs-sis",
    name: "SCCS SIS",
    url: "https://sccs-sis.vercel.app/?source=pwa",
    embed: false,
    category: "schools",
    type: { es: "Sistema académico (SIS) · PWA", en: "Student information system · PWA" },
    city: "Santa Cruz",
    problem: {
      es: "Depender de un sistema académico genérico, lleno de pantallas y difícil de adaptar.",
      en: "Relying on a generic student system, full of screens and hard to adapt.",
    },
    solution: {
      es: "Un sistema académico propio: alumnos, notas y asistencia en un solo lugar, instalable como app.",
      en: "The school's own student system: students, grades and attendance in one place, installable as an app.",
    },
    highlights: {
      es: ["Notas y asistencia", "Hecho a la medida del colegio", "Se instala como app (PWA)", "Datos del colegio, bajo su control"],
      en: ["Grades and attendance", "Built around the school", "Installs as an app (PWA)", "School data under its own control"],
    },
    cover: {
      device: "browser",
      bg: "#0f172a",
      fg: "#ffffff",
      accent: "#38bdf8",
      face: "sans",
      kicker: { es: "Sistema académico", en: "Student information system" },
      headline: { es: "Notas, asistencia y alumnos en un solo lugar.", en: "Grades, attendance and students in one place." },
    },
  },
  {
    key: "sccs-store",
    name: "SCCS Store",
    url: "https://sccs-store-app.vercel.app/",
    embed: false,
    category: "schools",
    type: { es: "Tienda en línea", en: "Online store" },
    city: "Santa Cruz",
    problem: {
      es: "Filas en el colegio para comprar uniformes, tallas agotadas y pagos en efectivo.",
      en: "Lines at school to buy uniforms, sold-out sizes and cash-only payments.",
    },
    solution: {
      es: "La tienda oficial en línea: uniformes por nivel, kits con descuento y recojo en el colegio.",
      en: "The official online store: uniforms by grade level, discounted kits and pickup at school.",
    },
    highlights: {
      es: ["Compra por nivel", "Kits con descuento", "Recojo en el colegio", "Bilingüe ES / EN"],
      en: ["Shop by grade level", "Discounted kits", "Pickup at school", "Bilingual ES / EN"],
    },
    cover: {
      device: "browser",
      bg: "#ffffff",
      fg: "#111111",
      accent: "#c8102e",
      face: "sans",
      kicker: { es: "Gestión 2026 – 2027", en: "School year 2026 – 2027" },
      headline: { es: "Vuelta a clases, Jaguars.", en: "Back to school, Jaguars." },
    },
  },
  {
    key: "fuerzaflow",
    name: "FuerzaFlow",
    url: "https://fuerzaflow.vercel.app/",
    embed: true,
    category: "apps",
    type: { es: "App de entrenamiento", en: "Fitness app" },
    city: "Remoto",
    problem: {
      es: "Rutinas en notas del celular y nadie que lleve la cuenta de tu progreso.",
      en: "Workouts in phone notes and nothing keeping track of your progress.",
    },
    solution: {
      es: "Una app de entrenamiento multilingüe, rápida y clara en el celular.",
      en: "A multilingual training app, fast and clear on your phone.",
    },
    highlights: {
      es: ["Seis idiomas", "Celular y web", "Animaciones fluidas"],
      en: ["Six languages", "Phone and web", "Smooth animations"],
    },
    cover: {
      device: "phone",
      bg: "#0b0b10",
      fg: "#ffffff",
      accent: "#ff3d5a",
      face: "display",
      kicker: { es: "Fuerza · Strength · Força", en: "Strength · Fuerza · Força" },
      headline: { es: "Entrena con un plan.", en: "Train with a plan." },
    },
  },
  {
    key: "bloom",
    name: "Bloom",
    url: "https://bloom-habits-two.vercel.app/",
    embed: true,
    category: "apps",
    type: { es: "App de hábitos (iOS · Android · web)", en: "Habit app (iOS · Android · web)" },
    city: "Remoto",
    problem: {
      es: "Buenos propósitos que se olvidan a la semana.",
      en: "Good intentions forgotten within a week.",
    },
    solution: {
      es: "Una app móvil para seguir tus hábitos día a día, hecha con un solo código para iOS, Android y web.",
      en: "A mobile app to track your habits day by day, built from one codebase for iOS, Android and web.",
    },
    highlights: {
      es: ["Seguimiento diario", "iOS, Android y web", "Diseño suave y claro"],
      en: ["Daily tracking", "iOS, Android and web", "Soft, clear design"],
    },
    cover: {
      device: "phone",
      bg: "#f3efff",
      fg: "#1e1442",
      accent: "#7b61ff",
      face: "sans",
      kicker: { es: "Habit tracker", en: "Habit tracker" },
      headline: { es: "Pequeños hábitos que florecen.", en: "Small habits, in bloom." },
    },
  },
  {
    key: "fabrizio-19",
    name: "Fabrizio Saunero · No. 19",
    url: "https://fabrizio-saunero-2.vercel.app/",
    embed: true,
    category: "portfolios",
    type: { es: "Portafolio universitario", en: "College portfolio" },
    city: "La Paz",
    problem: {
      es: "Un estudiante-atleta con mucho que contar y solo un formulario para contarlo.",
      en: "A student-athlete with a lot to tell and only an application form to tell it.",
    },
    solution: {
      es: "Un portafolio cinematográfico por capítulos, con videos de sus partidos y logros con cifras.",
      en: "A cinematic portfolio in chapters, with match footage and achievements in numbers.",
    },
    highlights: {
      es: ["Narrativa por capítulos", "Videos y fotos reales", "Cifras animadas", "En inglés para universidades"],
      en: ["Chapter-based story", "Real footage and photos", "Animated numbers", "In English for admissions"],
    },
    cover: {
      device: "browser",
      bg: "#0b0b0c",
      fg: "#ffffff",
      accent: "#ff5a1f",
      face: "display",
      kicker: { es: "College Application Portfolio", en: "College Application Portfolio" },
      headline: { es: "Built by experience. Driven by purpose.", en: "Built by experience. Driven by purpose." },
      mark: "19",
    },
  },
  {
    key: "fabrizio",
    name: "Fabrizio Saunero",
    url: "https://fabrizios.vercel.app/",
    embed: true,
    category: "portfolios",
    type: { es: "Portafolio universitario", en: "College portfolio" },
    city: "La Paz",
    problem: {
      es: "Un perfil versátil (deporte, servicio, negocios) difícil de resumir en una hoja.",
      en: "A versatile profile (sports, service, business) hard to fit on one page.",
    },
    solution: {
      es: "Una segunda edición editorial con galería, logros y una línea de tiempo de experiencias.",
      en: "A second, editorial edition with a gallery, honors and an experience timeline.",
    },
    highlights: {
      es: ["Diseño editorial", "Galería de logros", "Línea de tiempo", "En inglés para universidades"],
      en: ["Editorial design", "Honors gallery", "Experience timeline", "In English for admissions"],
    },
    cover: {
      device: "browser",
      bg: "#0a0b0d",
      fg: "#f4f1ea",
      accent: "#d4ff3a",
      face: "serif",
      kicker: { es: "La Paz · Bolivia", en: "La Paz · Bolivia" },
      headline: { es: "A life built on chances taken.", en: "A life built on chances taken." },
      mark: "FS",
    },
  },
  {
    key: "iker-torrico",
    name: "Iker Torrico",
    url: "https://ikertorrico-portfolio.vercel.app/",
    embed: true,
    category: "portfolios",
    type: { es: "Portafolio universitario", en: "College portfolio" },
    city: "La Paz",
    problem: {
      es: "Deportista, músico y emprendedor: demasiado para un ensayo de 650 palabras.",
      en: "Athlete, musician and entrepreneur: too much for a 650-word essay.",
    },
    solution: {
      es: "Un portafolio que muestra cada faceta, del básquet a la guitarra, con premios y proyectos reales.",
      en: "A portfolio that shows every side, from basketball to guitar, with real awards and projects.",
    },
    highlights: {
      es: ["Deporte, servicio, negocios y música", "Biblioteca de logros", "Animaciones fluidas", "En inglés para universidades"],
      en: ["Sports, service, business and music", "Library of achievements", "Smooth animations", "In English for admissions"],
    },
    cover: {
      device: "browser",
      bg: "#101418",
      fg: "#ffffff",
      accent: "#4f8cff",
      face: "display",
      kicker: { es: "Class of 2027", en: "Class of 2027" },
      headline: { es: "Jump right in. Connect with people. Learn by doing.", en: "Jump right in. Connect with people. Learn by doing." },
      mark: "IT",
    },
  },
];

export const projectByKey = (key: string) => projects.find((p) => p.key === key);

/** The narrated films (rendered with HyperFrames) for the featured sections. */
export const films = {
  schools: {
    src: { es: "/media/films/schools-es.mp4", en: "/media/films/schools-en.mp4" },
    poster: { es: "/media/films/schools-es.webp", en: "/media/films/schools-en.webp" },
    duration: 25,
    chapters: [
      { at: 0, label: { es: "El problema", en: "The problem" } },
      { at: 5, label: { es: "Todo el alumno", en: "The whole student" } },
      { at: 11, label: { es: "Dos toques", en: "Two taps" } },
      { at: 16.2, label: { es: "Ecosistema", en: "Ecosystem" } },
      { at: 20.8, label: { es: "Resultado", en: "Result" } },
    ],
    projects: ["sccs-student-os", "sccs-sis", "sccs-website", "sccs-store", "acs-calvert"],
  },
  restaurants: {
    src: { es: "/media/films/restaurants-es.mp4", en: "/media/films/restaurants-en.mp4" },
    poster: { es: "/media/films/restaurants-es.webp", en: "/media/films/restaurants-en.webp" },
    duration: 25,
    chapters: [
      { at: 0, label: { es: "El problema", en: "The problem" } },
      { at: 5, label: { es: "Mesero", en: "Waiter" } },
      { at: 10.8, label: { es: "Cocina", en: "Kitchen" } },
      { at: 15.8, label: { es: "Cierre", en: "Daily close" } },
      { at: 20.6, label: { es: "Resultado", en: "Result" } },
    ],
    projects: ["restobar-os", "fogo-de-chao", "don-corte-fino"],
  },
} as const;
