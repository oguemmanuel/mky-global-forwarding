# UI/UX brief

**Project:** MKY Global Forwarding website
**Author:** Ogu Emmanuel
**Status:** Draft for review with Medhat and Aakash

This brief defines how the site looks, how it behaves and how it talks. It covers the customer-facing screens (built) and the admin screens (Phase 2). The tokens below match `src/app/globals.css`, so this document and the code stay in sync.

---

## 1. Design direction

**Cinematic, precise, enterprise-ready.** MKY should feel like a modern operator, not a template: deep graphite and navy surfaces, real freight imagery, bold wide headlines, and data shown the way a logistics platform shows it.

**Principles**

1. **Every page leads to an action.** Quote, track or contact is always one click away.
2. **Show, don't claim.** Calculators, tracking and real numbers instead of adjectives like "reliable" and "seamless".
3. **Nothing fake.** Missing content shows as a marked placeholder, never invented people, quotes or figures.
4. **Data looks like data.** Codes, references, weights and ports use the mono face and tabular numbers.
5. **Fast and accessible.** Static pages, readable contrast, keyboard friendly, works on a phone.

---

## 2. Design system

### 2.1 Colour

| Token | Hex | Use |
|---|---|---|
| `ink-950` | `#03050A` | Page background on dark sections, header, footer |
| `ink-900` | `#070C16` | Dark panels, cards on dark |
| `ink-800` | `#0D1626` | Raised dark cards |
| `ink-700` | `#19304F` | Navy accents, gradients |
| `ink-600` | `#2A4266` | Borders on dark, dark input borders |
| `ink-400` | `#7F8EA6` | Labels and captions on dark |
| `ink-300` | `#AAB6C8` | Body text on dark |
| `paper` | `#F4F5F7` | Light section background |
| `line` | `#D9DEE6` | Borders on light |
| `slate` | `#555F6E` | Body text on light |
| `signal-500` | `#E0662C` | **Primary actions only** (buttons, active step, key numbers) |
| `signal-400` | `#DF9B67` | Highlights on dark (headline accent, chargeable weight) |
| `signal-700` | `#A8461A` | Orange text on light backgrounds (meets contrast) |
| `sky-400` | `#6FD0D6` | **Live data only** (routes, "In transit", tracking) |
| `ok-500` / `warn-500` / `danger-500` | `#17A673` / `#F2A024` / `#D93B3B` | Success, warning, error states |

Rules: orange means "do something"; teal means "this is live data". Don't use either as decoration.

### 2.2 Typography

| Role | Face | Style | Use |
|---|---|---|---|
| Display | Archivo (variable, wide) | 800, uppercase, tight leading | Page headlines, section titles, big numbers |
| Body | Geist Sans | 400 to 600 | Paragraphs, forms, buttons, navigation |
| Data | Geist Mono | 400 to 500, often uppercase with letter-spacing | References, port codes, container numbers, labels, eyebrows |

**Scale (desktop):** hero 86px · page title 60px · section title 58px · card title 24 to 28px · body 17 to 18px · small 14 to 15px · label 11 to 12px mono. Mobile scales headlines down by about 40%.

### 2.3 Layout and spacing

- Max content width 1280px, side gutters 16 / 24 / 32px (mobile / tablet / desktop).
- Section padding 96 to 128px vertical on desktop, 64 to 96px on mobile.
- 4px spacing base; cards use 24 to 40px inner padding.
- Radius: 8px inputs and buttons, 16px cards, 24px large panels.
- Dark and light sections alternate to pace long pages.

### 2.4 Components

| Component | Variants / notes |
|---|---|
| Button | Primary (orange), secondary (navy), ghost (outline on light), ghost-dark (outline on dark); sizes sm / md / lg |
| Header | Sticky, dark, blurred on scroll; desktop nav + EN/PL switch + Track + Get a quote; mobile menu |
| Footer | Services, company, contact columns; legal row |
| Page hero | Dark, grid texture, breadcrumb, display title, lead, optional actions |
| Command bar | Glass panel with tabs: Quick estimate / Track shipment |
| Service card | Photo, code (AIR, SEA, ROAD, CUSTOMS), title, summary, hover lift |
| Shipment card | Route codes, progress bar with mode icon, ETA / equipment / container, milestone timeline |
| Stat block | Big display number + mono label |
| Form field | Label above, input, hint or error below; dark and light versions |
| Stepper | 4 numbered steps, active in orange, done in navy |
| Placeholder tag | Dashed orange tag `[Label]` for content MKY must supply |
| Coverage map | Dotted world map, glowing lanes coloured by mode |
| WhatsApp button | Floating, bottom right, green |

---

## 3. Customer screens (built)

| Screen | Route | Purpose | Main sections | Primary action |
|---|---|---|---|---|
| Home | `/` | Prove capability, start a quote | Hero + command bar · key figures · services · network map · tracking showcase · destinations · process · proof · closing CTA | Get a quote |
| Services | `/services` | Overview of all modes | List of 4 services with inclusions | Details per service |
| Service detail | `/services/[slug]` | Explain one mode | Hero · what's included · good fit for · documents needed · tools promo · other services | Quote this service |
| Quote | `/quote` | Capture a complete request | 4-step wizard · contact sidebar · reply-time note | Send quote request |
| Track | `/track` | Self-service status | Search · demo refs · shipment card | Track |
| Tools | `/tools` | Useful calculators | Chargeable weight · container check · container guide · Incoterms explorer | Get an exact rate |
| About | `/about` | Trust | Story placeholder · how we work · team · office | Get in touch |
| Contact | `/contact` | Non-quote enquiries | Form with topics · address, phone, email, WhatsApp · hours | Send message |
| Privacy | `/privacy` | GDPR | Policy text (to be supplied) | |
| Not found | any bad URL | Recover | Message + links to home, track, quote | Home |

### 3.1 Screen states

| State | Pattern |
|---|---|
| Loading | Spinner inside the button that was pressed; button disabled |
| Empty | Track page shows demo references to try; placeholders show `[Label]` tags |
| Validation error | Red message under the field, focus stays on the step |
| Not found (tracking) | Neutral card explaining what to check next |
| Network error | Red banner with what to do ("try again, or email us directly") |
| Success | Green check, headline, reference number, next steps |

### 3.2 Responsive behaviour

- **Mobile (< 640px):** single column; command bar fields stack; service cards full width; hero data panels hidden; menu button replaces nav.
- **Tablet (640 to 1024px):** two-column grids; stepper labels show numbers only below 640px.
- **Desktop (> 1024px):** full layouts, floating hero panels, sticky quote sidebar.
- No horizontal scrolling at any width; wide tables scroll inside their own box.

---

## 4. Admin screens (Phase 2)

Private area at `/admin`, behind login. Roles: **Owner** (everything), **Staff** (quotes and shipments), **Editor** (content only).

| Screen | Purpose | Key elements |
|---|---|---|
| Login | Secure access | Email + magic link or password; no public sign-up |
| Dashboard | Owner overview | Requests this week / month, by mode, top lanes, average reply time, won vs lost, recent activity |
| Quote inbox | Work the requests | Table: ref, date, customer, mode, route, chargeable kg, DG flag, status (New, In progress, Quoted, Won, Lost), assignee; filters and search |
| Quote detail | Price and reply | All submitted fields, notes thread, assign, status change, "Convert to shipment" |
| Shipments | Active shipments | Table: ref, customer, mode, route, ETA, current milestone, coordinator; filter by status |
| Shipment editor | Update tracking | Header fields (container / AWB / B/L, equipment, ETA), milestone list with one-click "mark done" + date + location, customer email toggle |
| Content | Keep site current | Edit team, testimonials, stats, accreditations, lanes, service inclusions; draft / preview / publish |
| Settings | Configuration | Quote inbox email, reply-time promise, office hours, users and roles |

**Admin design rules**

- Same tokens as the public site, but light theme by default for long working sessions.
- Dense tables with sticky headers, status shown as coloured pills with text (never colour alone).
- Every destructive action asks for confirmation in the page (no browser pop-ups).
- Keyboard shortcuts for frequent actions (next request, mark milestone done) once the basics are in.

---

## 5. Copy rules

**Voice:** a knowledgeable coordinator talking to a busy shipper. Clear, direct, specific.

| Do | Don't |
|---|---|
| "Request a quote" | "Discover our competitive rates" |
| "Air freight when the deadline can't move" | "Reliable freight solutions tailored to your needs" |
| Name things shippers recognise: FCL, LCL, AWB, B/L, CMR, HS code, Incoterm | Explain basic freight terms in a patronising way |
| Use numbers and units: "641 kg chargeable", "40' high cube" | Vague claims: "fast", "seamless", "world-class" |
| Error messages say what to fix: "Enter the total weight in kg" | "Invalid input" or "Something went wrong" |
| Buttons say what happens: "Send quote request", "Track" | "Submit", "Click here" |

**Mechanics**

- British English, sentence case for UI text and buttons; uppercase only for display headlines and mono labels.
- No em dashes; use commas, colons or full stops.
- Numbers: thousands with commas (`1,200 kg`), units after a space (`3.84 m³`), dates as `14 Oct`.
- References always in mono: `MKY-Q-261005-X7KD`, `MKYU 482150 5`.
- Polish copy is written or reviewed by a native speaker at MKY before launch.
- Never publish an unverified claim. If it isn't confirmed, it stays a `[placeholder]`.

---

## 6. Imagery

- Real MKY photos first: cargo being loaded, the team, the Kraków office, trucks and containers with MKY involvement.
- Until then: high-quality free stock (currently Unsplash), always under a dark gradient so text stays readable.
- No stock photos of "team members" or "clients".
- Icons: Lucide line icons, 1.5 to 2px stroke, used sparingly.

---

## 7. Accessibility

- Text contrast at least 4.5:1 (3:1 for large display text).
- Visible focus ring (orange) on every interactive element; skip-to-content link.
- Every input has a label; errors are announced (`aria-live`) and tied to fields.
- Status never relies on colour alone ("In transit" pill has text).
- Animations respect `prefers-reduced-motion`.
- Target size at least 40px for tap targets on mobile.

---

## 8. Motion

- Subtle only: route lines flow slowly on the map, live-status dot pulses, cards lift 2px on hover, service photos zoom slightly on hover.
- No page-load animations that hide content, no parallax, no auto-playing video.

---

## 9. Open items

| Item | Owner |
|---|---|
| Official logo (SVG) to replace the placeholder mark | MKY |
| Real photography | MKY |
| Native Polish review | MKY |
| Admin roles and who gets access | Medhat |
| Approval of this brief | Medhat, Aakash |
