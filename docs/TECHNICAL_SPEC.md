# Technical specification

**Project:** MKY Global Forwarding website redesign
**Author:** Ogu Emmanuel
**Audience:** MKY tech team (Aakash) and anyone maintaining the site

---

## 1. Goals

1. Replace the WordPress template site with a fast, maintainable site that turns visitors into quote requests.
2. Give customers self-service tools: quote estimate, tracking, freight calculators.
3. Make content easy to change without touching layout code.
4. Be ready for Polish, real tracking data and a CMS without a rebuild.

## 2. Stack and why

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16, App Router | Static pages by default (fast, cheap to host), server routes for forms and tracking, first-class SEO APIs |
| Language | TypeScript | Catches mistakes in content and API shapes at build time |
| Styling | Tailwind CSS 4 with design tokens in `globals.css` | One place to change colours and type; no CSS drift |
| Validation | Zod (`src/lib/schemas.ts`) | Same schema validates the quote form in the browser and on the server |
| Fonts | Geist (UI), Geist Mono (data), Archivo variable (display) | Self-hosted from npm, no Google Fonts request, Polish characters supported |
| Icons | lucide-react | Tree-shaken, consistent stroke icons |
| Map | dotted-map, rendered on the server at build time | No map API key, no client JavaScript, tiny output |
| Email | Resend HTTP API (optional) | Simple, reliable transactional email; falls back to console logging |

## 3. Project structure

```
src/
  app/                    Routes (App Router)
    page.tsx              Homepage
    services/[slug]/      Service pages generated from content
    quote/                Quote wizard (client) + page
    track/                Tracking UI (client) + page
    tools/                Freight tools page
    api/quote|contact|track/route.ts   Server endpoints
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    layout/               Header, Footer, preview banner, WhatsApp button
    home/                 Hero, CommandBar, CoverageMap
    shipment/             ShipmentView (tracking card)
    tools/                Calculators and Incoterms explorer
    ui.tsx                Buttons, Fill (placeholder renderer), Logo, headings
  content/
    site.ts               Company data, services, stats, lanes, Incoterms
    media.ts              Photography sources
  i18n/                   EN/PL dictionaries and LocaleProvider
  lib/
    freight.ts            Chargeable weight, CBM, container suggestion
    container.ts          ISO 6346 check digit
    tracking.ts           Shipment lookup (demo data source)
    schemas.ts            Zod schemas
    notify.ts             Email delivery + reference numbers
```

## 4. Key behaviours

### 4.1 Quote request

- `QuoteWizard` collects mode, Incoterm, customs need, route, ready date, service level, goods, HS code, equipment, pieces, weight, dimensions, dangerous-goods flag and contact details.
- Each step validates against `quoteSchema` before moving on; the server validates again in `/api/quote`.
- A hidden honeypot field (`website`) silently drops bot submissions.
- On success the server creates a reference (`MKY-Q-YYMMDD-XXXX`) and emails the team via `notifyTeam()`.
- The homepage command bar and service pages deep-link into the wizard with prefilled values (`/quote?mode=sea&to=Tema`).

### 4.2 Freight maths (`src/lib/freight.ts`)

| Mode | Volumetric factor | Rule |
|---|---|---|
| Air | 167 kg per m³ (6,000 cm³/kg, IATA) | Chargeable = max(actual, volumetric) |
| Road | 333 kg per m³ | Chargeable = max(actual, volumetric) |
| Sea (LCL) | 1,000 kg per m³ | Revenue tonnes = max(tonnes, m³) |

Factors are industry conventions and are shown as indicative. **MKY should confirm the factors they use** and adjust `VOLUMETRIC_FACTOR` if needed.

### 4.3 Tracking

- `/api/track?ref=...` returns `{ ok, shipment }` or `{ ok: false, reason, message }`.
- Container numbers are checked with the ISO 6346 check digit before lookup, so typos get a clear message.
- `findShipment()` in `src/lib/tracking.ts` currently reads demo data (`MKY-DEMO-001`, `MKY-DEMO-002`). Milestone dates are relative to today so the demo never looks stale.

**Tracking integration options** (decide with MKY):

1. **Manual status page:** staff update shipments in a simple admin or a Google Sheet; the API reads it. Cheapest, fastest to launch.
2. **MKY's TMS/ERP:** if MKY uses a forwarding system with an API, `findShipment()` calls it and maps fields to the `Shipment` type.
3. **Carrier visibility API:** container and AWB tracking via a third-party aggregator. Best data, monthly cost.

Only `findShipment()` changes; the UI and API contract stay the same.

### 4.4 Internationalisation

- Phase 1 (this build): `LocaleProvider` switches header, footer and hero between English and Polish, remembering the choice in `localStorage`.
- Phase 2: move to locale routes (`/pl/...`) with `generateStaticParams`, translated content per page, and `hreflang` alternates. Content in `site.ts` becomes `{ en, pl }` pairs or moves to a CMS.

### 4.5 SEO

- Metadata per page, canonical URLs, Open Graph image generated at build time.
- `sitemap.xml` lists all pages and service pages; `robots.txt` blocks `/api/` and blocks everything on preview builds.
- `LocalBusiness` JSON-LD with address, geo and services.
- Static rendering for all marketing pages for fast Core Web Vitals.

### 4.6 Security and privacy

- Inputs validated server-side with Zod; no raw HTML rendered from user input.
- Security headers set in `next.config.ts` (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
- No database or cookies in Phase 1. Form data goes to email only.
- Before launch: GDPR privacy policy text (placeholder at `/privacy`), consent line on forms, and rate limiting on `/api/*` (Vercel firewall or Upstash).

## 5. Environments and deployment

| Environment | Branch | URL | Notes |
|---|---|---|---|
| Local | any | `localhost:3000` | No secrets needed |
| Preview | `develop` and PRs | `*.vercel.app` | `NEXT_PUBLIC_PREVIEW_BANNER=true` |
| Production | `main` | `mkyglobalforwarding.com` | DNS moved from WordPress host after sign-off |

Steps to go live:

1. Create a Vercel project from the GitHub repo; set env vars from `.env.example`.
2. Verify the sending domain in Resend (SPF/DKIM records) and set `RESEND_API_KEY`.
3. Point the domain's DNS to Vercel. Keep the old WordPress site reachable on a subdomain for two weeks as a fallback.
4. Add 301 redirects for old URLs if any have backlinks (`/services/`, `/about/` already match).
5. Submit the sitemap in Google Search Console and update the Google Business Profile link.

## 6. Quality checklist

- [x] `npm run build` passes with no type errors
- [x] No horizontal scroll at 390px width
- [x] Keyboard focus visible, skip link, labelled form fields
- [x] `prefers-reduced-motion` respected
- [ ] Lighthouse 90+ on performance, accessibility, SEO (run on preview URL with real images)
- [ ] All `TODO("...")` placeholders resolved
- [ ] Real logo in SVG added (current mark is a placeholder)
- [ ] Polish copy reviewed by a native speaker

## 7. Handover

- Content edits: `src/content/site.ts` (no layout knowledge needed).
- Design tokens: `src/app/globals.css` `@theme` block.
- New service: add an object to `services` in `site.ts`; the page, sitemap and footer link appear automatically.
- New page: add a folder under `src/app/` with `page.tsx` and `metadata`, then add it to `sitemap.ts` and `nav` if needed.
