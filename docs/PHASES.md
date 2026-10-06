# Delivery phases

We ship the site in small steps. Each phase is switched on in `src/content/site.ts` (`features`) and gets its own branch, pull request and changelog entry below, so MKY can see exactly what changed and when.

## Phase 1: core (this release)

Goal: a live site that does three useful things well.

| Feature | Where | Status |
|---|---|---|
| Track a vehicle by VIN / chassis number | `/track`, homepage command bar, `/api/track` | Done (demo data) |
| Request a quote (vehicle, cargo, road, documents only), sent by WhatsApp or saved form | `/quote`, `/api/quote` | Done |
| Every quote and tracking search saved | `src/lib/store.ts`, `supabase/schema.sql` | Done (local file now, Supabase in production) |
| Staff view of the data: KPIs, quotes table, searches, CSV export | `/admin` (password: `ADMIN_PASSWORD`) | Done |
| Services, about, contact (WhatsApp, phone, email) | `/services`, `/about`, `/contact` | Done, content to confirm |

Switched off in Phase 1: `tools`, `polish`, `contactForm`, `emailNotifications`.

**Tracking data rules**

- Tracking returns only the status of the vehicle that matches the VIN. Never client names, prices or other rows.
- Demo VINs: `VF7DEMXXX00000001` (Ro-Ro, Antwerp to Alexandria) and `WDBDEMXXX00000002` (truck, Antwerp to Shuwaikh).
- No real VINs or client names from the MKY sheet are ever put in the code or the repo.

**Before go-live (needs MKY)**

- [ ] Confirm ports, lanes and services (Ro-Ro vs container, is general cargo offered?)
- [ ] Confirm what the status columns mean (e.g. BLC, Z-Reference) and the order of milestones
- [ ] Decide the tracking source: a clean "website" tab in the Google Sheet with one row per vehicle (recommended)
- [ ] Create the Supabase project and run `supabase/schema.sql`
- [ ] Set `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` on Vercel

## Phase 2: connect and notify (next, one item at a time)

Order matters: each step builds on the previous one.

1. **Live tracking from the Google Sheet.** `findShipment()` reads a dedicated tab through the Sheets API with a read-only service account. Only the matching row is returned.
2. **Email notifications.** Turn on `emailNotifications`, verify the domain in Resend, set `RESEND_API_KEY` and `QUOTE_INBOX`. Team gets each quote by email; client gets a confirmation.
3. **Contact form.** Turn on `contactForm` (same email pipeline).
4. **Quote status in admin.** Staff mark quotes as in progress, quoted, won or lost; admin shows conversion by lane.
5. **Polish language.** Turn on `polish`, move to `/pl/...` routes, native-speaker review.
6. **Tools.** Turn on `tools` (container check, Incoterms), adjusted for vehicle shipping.

## Phase 3: later ideas

- Client login to see all their vehicles
- Automatic status updates by WhatsApp or email when a milestone changes
- Analytics dashboard for Aakash (Looker Studio or Metabase on the Supabase views `quotes_weekly`, `quotes_by_lane`)
- Proper user accounts for admin instead of a shared password

## Changelog

| Date | Branch | Change |
|---|---|---|
| 2026-10 | `feature/phase1-vehicle-tracking` | Re-focused site on vehicle exports (Europe to Middle East). VIN tracking, WhatsApp quotes, saved data, `/admin` with CSV export, feature flags for phase 2 |
