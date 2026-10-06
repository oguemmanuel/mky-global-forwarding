# MKY Global Forwarding website

Redesign of [mkyglobalforwarding.com](https://mkyglobalforwarding.com): vehicle shipping from European ports to the Middle East, with tracking by VIN, WhatsApp quote requests and a staff data view. Built in phases, see [`docs/PHASES.md`](docs/PHASES.md).

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod |
| **Hosting** | Vercel (recommended) or any Node 20+ host |
| **Status** | Phase 1 preview. Items marked `TODO("...")` need content from MKY |
| **Maintainer** | Ogu Emmanuel |

## Quick start

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD to open /admin
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also type-checks)
npm run start      # serve the production build
npm run lint       # ESLint
```

## What's in the site (Phase 1)

| Route | Purpose |
|---|---|
| `/` | Homepage: hero, VIN tracking and quote bar, services, lanes map, process, CTA |
| `/services`, `/services/[slug]` | Vehicle shipping, export documents (MRN, EUR.1, ACID), inland transport, container cargo |
| `/quote` | 4-step quote request. Sent on WhatsApp (pre-filled message) or saved as a form |
| `/track` | Track a vehicle by VIN / chassis number (demo data for now) |
| `/admin` | Staff only: quote requests, tracking searches, KPIs, CSV export |
| `/about`, `/contact`, `/privacy` | Company, WhatsApp / phone / email contact, privacy placeholder |
| `/api/quote`, `/api/track` | Validate with Zod, save to the data store |
| `/api/admin/*` | Login, logout, CSV export |

Try tracking with the demo VINs `VF7DEMXXX00000001` or `WDBDEMXXX00000002`.

Phase 2 features (email notifications, contact form, Polish, tools) are already in the code but switched off in `features` in `src/content/site.ts`.

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

See `.env.example`.

| Variable | Needed for | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | `/admin` | Without it the admin page is switched off |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Saving data in production | Server-only, never commit. Without them data goes to `.data/store.json` (local) |
| `NEXT_PUBLIC_PREVIEW_BANNER` | Preview deploys | Shows the "preview" banner and blocks indexing |
| `RESEND_API_KEY`, `QUOTE_INBOX`, `MAIL_FROM` | Phase 2 emails | Only used when `features.emailNotifications` is on |

Database tables are in `supabase/schema.sql` (run once in the Supabase SQL editor).

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
- [`docs/03-user-journey-flows.md`](docs/03-user-journey-flows.md): customer, owner and staff flows
- [`docs/04-ui-ux-brief.md`](docs/04-ui-ux-brief.md): design system and screens
- [`docs/PHASES.md`](docs/PHASES.md): what is in each phase, and the changelog
