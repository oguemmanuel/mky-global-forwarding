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

- `QuoteWizard` has four modes (`vehicle`, `cargo`, `road`, `documents`) and four steps: service and documents (MRN, EUR.1, ACID / CargoX), route and collection, vehicle or cargo details (VINs checked as you type), contact.
- Each step validates against `quoteSchema` (Zod `superRefine` per mode); the server validates again in `/api/quote`.
- The server creates a reference (`MKY-Q-YYMMDD-XXXX`) and saves the request with `saveQuote()`.
- **Send on WhatsApp:** the client gets a `wa.me` link with a pre-filled message (`src/lib/quoteMessage.ts`), because MKY already handles enquiries on WhatsApp. **Send by email:** saved only in Phase 1; emailed to the team when `features.emailNotifications` is on.
- The homepage command bar deep-links into the wizard (`/quote?mode=vehicle&from=...&to=...&type=car&count=2`).
- A hidden honeypot field (`website`) drops bot submissions.

### 4.2 VIN checks (`src/lib/vin.ts`)

- ISO 3779 format: 17 characters, letters and digits, no I, O or Q. `vinProblem()` returns a plain-English message.
- `vinRegion()` reads the first character (world manufacturer region) for display only.
- Container numbers (for container cargo) are checked with the ISO 6346 check digit.

### 4.3 Tracking

- `/api/track?ref=...` returns `{ ok, shipment }` or `{ ok: false, reason, message }` and logs the search (`track_search` event) for the admin page.
- `findShipment()` in `src/lib/tracking.ts` reads demo data now. Milestones follow MKY's sheet: booked, MRN, EUR.1, ACID, loaded, B/L, arrived, released.
- **Phase 2 source: Google Sheets API.** MKY keeps a tab with one row per vehicle (VIN, vehicle, route, sailing, status columns). A read-only service account reads it on the server and returns only the row that matches the VIN. Client names, prices and other rows never leave the server. Cache for a few minutes to stay within API limits.
- Only `findShipment()` changes; the UI and API contract stay the same.

### 4.3a Data store and admin

- `src/lib/store.ts` saves quotes and events to Supabase (REST, service role key, server-only) when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, otherwise to `.data/store.json` (git-ignored), otherwise memory.
- `supabase/schema.sql`: tables `quotes` and `events` with row-level security on and no public policies (only the server can read or write), plus views `quotes_weekly` and `quotes_by_lane` for reporting.
- `/admin`: shared password (`ADMIN_PASSWORD`), compared in constant time; session is an HMAC-signed httpOnly cookie valid for 12 hours. Shows KPIs, breakdowns by service, destination and vehicle type, the quotes table and recent searches. `/api/admin/export?type=quotes|events` downloads CSV.
- `/admin` and `/api/` are blocked in `robots.txt` and marked `noindex`.

### 4.3b Feature flags

`features` in `src/content/site.ts` turns Phase 2 parts on without new deploy work: `tools`, `polish`, `contactForm`, `emailNotifications`. Disabled pages return 404 and drop out of the nav and sitemap.

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
- Phase 1 stores quote requests (contact details included) in Supabase in the EU region. Only the admin cookie is set; no tracking cookies.
- The Supabase service role key and admin password live in Vercel env vars only.
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
