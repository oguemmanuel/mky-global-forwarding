# Website redesign proposal

**For:** MKY Global Forwarding (Medhat, Aakash)
**From:** Ogu Emmanuel
**Date:** October 2026

---

## 1. The problem

The current website doesn't do the two things a forwarder's site must do: **earn trust** and **capture enquiries**. It shows placeholder staff and testimonials, has no quote form or contact page, promises tracking it doesn't offer, and still carries the WordPress default name in Google. Full details are in [`AUDIT.md`](AUDIT.md).

## 2. Goals

| Goal | Measure |
|---|---|
| More quote requests | Quote form submissions per month (baseline: 0, no form exists today) |
| Faster quoting | Requests arrive with mode, route, weight and dimensions, so fewer back-and-forth emails |
| Credibility | No placeholder content; real team, clients and accreditations |
| Visibility in search | Rank for searches like "freight forwarder Kraków", "customs clearance Kraków", "spedycja Kraków" |
| Fewer "where is my cargo?" calls | Tracking page usage once real data is connected |

## 3. The solution

A new site built as a **logistics platform rather than a brochure**: deep navy and graphite surfaces, copper-orange actions, teal for live data, bold wide typography, and real tools customers can use.

### What's built (working preview in this repository)

| Feature | What it does for MKY |
|---|---|
| **Hero command bar** | Visitors price a shipment (chargeable weight, CBM, container suggestion) or track one, straight from the homepage |
| **4-step quote request** | Collects everything needed to price a job: mode, Incoterm, customs, route, cargo, dimensions, dangerous goods, contact. Emails the team with a reference number |
| **Shipment tracking** | Lookup by MKY reference, AWB, B/L or container number with milestone timeline. Validates container numbers (ISO 6346) |
| **Service pages** | Air, ocean, road and customs, each with what's included, documents needed and who it suits |
| **Freight tools** | Chargeable-weight and CBM calculator, container number checker, container guide, Incoterms explorer. Useful content that also brings in search traffic |
| **Network map** | Lanes from Kraków drawn on a world map |
| **Contact page + WhatsApp** | Form with topic routing, address with map link, WhatsApp button on every page |
| **SEO foundation** | Proper titles and descriptions, sitemap, structured data, share images |
| **EN / PL switch** | Navigation, footer and headline already translated |

### Sitemap

```
Home
├── Services
│   ├── Air freight
│   ├── Ocean freight
│   ├── Road freight
│   └── Customs clearance
├── Tools
├── Track shipment
├── Request a quote
├── About
├── Contact
└── Privacy
```

## 4. Roadmap

| Phase | Scope | Duration (estimate) |
|---|---|---|
| **0. Quick fixes** | On the current WordPress site: remove placeholder people, fix site name and broken links | 1 day |
| **1. Launch** | Everything in section 3 with MKY's real content, logo and photos · email delivery · analytics · GDPR privacy policy · go live on mkyglobalforwarding.com | 2 to 3 weeks after content is received |
| **2. Grow** | Full Polish version (`/pl`) · content management so staff edit text without code · real tracking data (manual status page, TMS or carrier API) · quote dashboard for the team | 4 to 6 weeks |
| **3. Optimise** | Monthly SEO content (guides on Incoterms, customs, lanes) · conversion tracking and A/B tests · customer portal with documents | Ongoing |

## 5. What I need from MKY

- [ ] Logo files (SVG or high-resolution PNG) and any brand colours to keep
- [ ] Real team names, roles and photos (or a decision to leave the team section out)
- [ ] 1 to 3 client testimonials, with permission to publish
- [ ] Accreditations and memberships held (IATA, FIATA, AEO, PISiL, insurance)
- [ ] Key numbers: countries served, shipments per year, years of experience, typical quote reply time
- [ ] Confirmed services, main ports and core lanes
- [ ] Office hours and company registration details (NIP/KRS)
- [ ] Inbox that should receive quote requests
- [ ] Domain/DNS access (or a contact who manages it)
- [ ] Decision on tracking: manual updates, existing system, or a carrier API

## 6. Running costs (to confirm at setup)

| Item | Notes |
|---|---|
| Hosting (Vercel) | Commercial sites need a paid plan; small monthly fee |
| Email delivery (Resend) | Free tier likely enough for form notifications at launch |
| Domain | Already owned |
| Tracking data (Phase 2, optional) | Only if a carrier visibility API is chosen |

No WordPress plugin licences or theme updates to maintain.

## 7. Why this approach

- **Fast:** pages are pre-built and served from a global CDN.
- **Low maintenance:** no plugins to patch; content lives in one file now and a CMS later.
- **Built to grow:** tracking, Polish and a customer portal plug in without a rebuild.
- **Owned by MKY:** code in MKY's GitHub, deployable anywhere.

## 8. Next steps

1. Review the live preview and this proposal together (30 minutes).
2. Agree Phase 1 scope and the content list in section 5.
3. I set up the repository under MKY's GitHub and a preview URL for the team.
4. Launch once content is in and the team signs off.
