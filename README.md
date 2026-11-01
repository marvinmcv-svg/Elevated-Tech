# Elevated Tech: landing page

The company site for Elevated Tech, an AI solutions company in Santa Cruz de la Sierra, Bolivia. It is bilingual (Spanish by default, English), fully server-rendered for SEO, and built with Next.js, TypeScript, Tailwind CSS, GSAP and Three.js.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000 → redirects to /es or /en
```

```bash
npm run build && npm start   # production build
npm run typecheck && npm run lint
```

Deploy: import the repo in Vercel and add the environment variables below. No other config is needed.

## Environment variables

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Real domain (canonical URLs, sitemap, Open Graph). |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID. Leave empty to disable analytics. |
| `LEAD_WEBHOOK_URL` | Server-only. Every form submission is POSTed here as JSON (n8n webhook, Google Apps Script → Sheet, Zapier…). |
| `NEXT_PUBLIC_SHOW_PLACEHOLDERS` | `true` (default) shows the yellow **TODO** badges. Set `false` for clean previews. |
| `ANTHROPIC_API_KEY` | Server-only. Powers El-IAs, the AI receptionist. Without it the chat hands visitors off to WhatsApp. |

## How it works

- **Languages:** `/es` and `/en`. Visiting `/` redirects by saved choice (cookie from the ES/EN toggle), then browser language. Spanish browsers and crawlers get Spanish; everyone else gets English. All copy lives in `src/content/es.ts` (written natively) and `src/content/en.ts`.
- **Service pages:** `/[locale]/servicios/[slug]`, one per service (8 × ES/EN), statically generated with their own metadata, JSON-LD (Service, FAQ, breadcrumbs) and sitemap entries. All service copy lives in **`src/content/services.ts`**, which also feeds the home-page cards and El-IAs.
- **El-IAs (AI receptionist):** chat widget (`src/components/elias/Elias.tsx`) → `/api/chat`, which streams replies from Claude. His knowledge is generated from the site content (`src/lib/elias.ts`), so editing the copy updates what he knows. The system prompt is prompt-cached, refusals fall back server-side, and there's a basic per-IP rate limit. Events: `elias_open`, `elias_message`.
- **Lead funnel:** every "Cotiza gratis / Start your project" button opens a short form (name, business, need, optional budget/timeline). On submit it saves the lead to `/api/lead` → `LEAD_WEBHOOK_URL`, then opens WhatsApp (+591 77165787) with a prefilled message built from the answers.
- **Analytics events** (GA4 + `dataLayer`): `whatsapp_click` (with `location`), `lead_form_open`, `lead_form_submit`, `hero_slide_change`, `language_switch`.
- **Motion:** `src/components/motion/MotionRoot.tsx` drives every scroll animation through data attributes (`data-reveal`, `data-split`, `data-count`, `data-parallax`, `data-draw`, the pinned project rail). Lenis handles smooth scrolling.
- **3D robot ("El Camba"):** `src/components/three/Robot.tsx` is a fully procedural robot. He changes outfit with each hero slide (see `OUTFITS`), doing a quick hop-and-spin and swapping clothes while he faces away: **camba** (sombrero de paja, green neckerchief, white shirt and trousers, tari gourd at the waist), **AI receptionist** (headset, green tie, name badge, chat bubble), **web designer** (sideways cap, hoodie, jeans, floating browser window), **teacher** (glasses, bow tie, sweater vest, khakis, book) and **chef** (toque, double-breasted coat, apron, wooden spoon). He follows the pointer with head and eyes, blinks, breathes and gestures on each slide (`GESTURE_FOR_SLIDE`). Every 25–40 s, or when clicked, he dances a takirari, twirling a green pañuelo. `HeroScene.tsx` is lazy-loaded only on capable devices (WebGL2, ≥4 cores/GB, no data saver, motion allowed) and pauses when off-screen. Everyone else sees still renders, `public/robot/el-camba-0…4.webp` (one per outfit, cross-faded with the slides). `public/robot/walker.webp` is the little robot that walks down the process timeline. Re-render these if you change the robot: `<Robot still />` (and `<HeroScene still bare />` for a cut-out) freezes him in a neutral pose for screenshots.
- **Services:** a dark bento grid (`ServiceCards.tsx`) where every card has its own animated scene (`ServiceVisuals.tsx`: building website, live WhatsApp chat, automation flow, app notification, dashboard, design canvas, AI content generation, social growth). The scenes are HTML/CSS/SVG, so nothing to download, and only animate while on screen.
- **Process:** a vertical timeline; the robot walks down it as you scroll, the line fills behind him and each step lights up as he reaches it (`[data-timeline]` in `MotionRoot.tsx`).
- **Safety nets:** content is server-rendered and visible without JavaScript. `prefers-reduced-motion` turns off smooth scroll, reveals, autoplay and 3D. The hero slideshow has a pause button and keyboard navigation (arrow keys, Home, End).
- **SEO:** per-locale metadata, `hreflang` alternates, generated Open Graph images, JSON-LD (`ProfessionalService` + `FAQPage`), `sitemap.xml` and `robots.txt`.

## Placeholders to fill before launch

Search the code for `TODO(launch)`. Most real content goes in **one file: `src/content/media.ts`**.

| # | Item | Where |
| --- | --- | --- |
| 1 | **Logo** (svg, plus a white version for dark backgrounds) | `public/brand/`, then swap the wordmark in `src/components/ui/Logo.tsx` |
| 2 | **Team photos** (same style, lighting and backdrop for all three, 4:5 portrait) | `public/team/`, then `teamPhotos` in `media.ts` |
| 3 | **Origin story** (3–4 sentences, ES + EN) | `originStory` in `media.ts` |
| 4 | **Daniel's and Alex's bios** | `about.team` in `es.ts` / `en.ts` (set `bioTodo: false`) |
| 5 | **Client testimonials** (real quotes and/or screenshots only) | `testimonials` in `media.ts` |
| 6 | **Project screenshots + live links** (9 projects) | `projectMedia` in `media.ts` |
| 7 | **School AI receptionist** video or screenshots | `aiReceptionist` in `media.ts` |
| 8 | **Domain (.com) and company email** | `NEXT_PUBLIC_SITE_URL` + `email` in `src/lib/site.ts` |
| 9 | **After-launch support details** (FAQ) | `supportDetails` in `media.ts` |
| 10 | **GA4 ID and lead webhook URL** | Vercel environment variables |
| 11 | **Confirm stats** ("10+ projects", "3 cities", "2–6 weeks", "100% ownership") | `stats` in `es.ts` / `en.ts` |
| 12 | **Heliport project**: confirm category (currently "Web") | `projects.items` in `es.ts` / `en.ts` |

There are no social icons on purpose, because there are no social accounts yet. There are no prices anywhere on the page.
