# MKY Global Forwarding website

Redesign of [mkyglobalforwarding.com](https://mkyglobalforwarding.com) as a fast, bilingual-ready Next.js site with a quote request flow, shipment tracking and freight tools.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod |
| **Hosting** | Vercel (recommended) or any Node 20+ host |
| **Status** | Preview build. Items marked `TODO("...")` need content from MKY |
| **Maintainer** | Ogu Emmanuel |

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: add email settings
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also type-checks)
npm run start      # serve the production build
npm run lint       # ESLint
```

## What's in the site

| Route | Purpose |
|---|---|
| `/` | Homepage: hero with quick estimate and tracking bar, services, network map, tracking showcase, destinations, process, proof, CTA |
| `/services`, `/services/[slug]` | Air, ocean, road and customs pages, generated from `src/content/site.ts` |
| `/quote` | 4-step quote request (mode, route, cargo, contact) with live chargeable-weight estimate |
| `/track` | Shipment tracking by reference, AWB, B/L or container number (demo data for now) |
| `/tools` | Chargeable weight / CBM calculator, ISO 6346 container check, container guide, Incoterms explorer |
| `/about`, `/contact`, `/privacy` | Company, contact form, privacy placeholder |
| `/api/quote`, `/api/contact` | Validate submissions with Zod and email them to the team (Resend) |
| `/api/track` | Tracking lookup. Swap the demo source for a real TMS or carrier API |

SEO is built in: per-page metadata, `sitemap.xml`, `robots.txt`, Open Graph image, and `LocalBusiness` JSON-LD.

## Editing content

Almost all copy and company data lives in **`src/content/site.ts`**:

- `company`: name, address, phone, email, WhatsApp, hours, NIP
- `services`: the four service pages (what's included, documents, ideal for)
- `stats`, `accreditations`, `testimonial`, `team`: currently placeholders
- `lanes`: the routes drawn on the network map

Placeholders use `TODO("label")` and render as orange `[label]` tags so nothing fake ships by accident. To list everything still open:

```bash
grep -rn 'TODO("' src
```

Photos are in `src/content/media.ts` (free Unsplash images for now). Replace them with MKY's own photography in `public/media/`.

UI strings for the header, footer and hero are in `src/i18n/dictionaries.ts` (English and Polish).

## Environment variables

See `.env.example`. None are required to run locally; without `RESEND_API_KEY`, form submissions are logged to the server console.

## Branching

- `main`: production. Protected, deploys to the live domain.
- `develop`: integration branch. Deploys to the preview URL.
- `feature/<name>`: one branch per change, opened as a pull request into `develop`.

```bash
git checkout develop
git checkout -b feature/real-team-photos
# ...work...
git push -u origin feature/real-team-photos
```

## Documentation

- [`docs/AUDIT.md`](docs/AUDIT.md): audit of the current website
- [`docs/PROPOSAL.md`](docs/PROPOSAL.md): redesign proposal, scope and roadmap
- [`docs/TECHNICAL_SPEC.md`](docs/TECHNICAL_SPEC.md): architecture, integrations, deployment and handover
