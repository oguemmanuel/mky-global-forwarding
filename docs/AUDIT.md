# Website audit: mkyglobalforwarding.com

**Prepared by:** Ogu Emmanuel
**Date:** October 2026
**Pages reviewed:** Home, Services, About (the only pages linked from the site)

---

## Summary

The current site is a WordPress template that was published in June 2025 and has barely changed since. It looks acceptable at a glance, but it has **trust problems** (placeholder team and testimonials), **no way to request a quote or track a shipment**, and **SEO defaults that were never set up**. For a freight forwarder, whose customers judge reliability before sending cargo, these issues cost enquiries.

| Area | Rating | Headline |
|---|---|---|
| Trust and credibility | 🔴 Critical | Stock-photo team, unverifiable testimonials, dead social links |
| Conversion | 🔴 Critical | No quote form, no contact page, misdirected buttons |
| SEO | 🟠 High | "My WordPress Blog" as site name, thin and duplicated copy |
| Content | 🟠 High | Generic text, no routes, ports, certifications or numbers |
| Features | 🟠 High | Promises tracking that doesn't exist |
| Design | 🟡 Medium | Template look, weak hierarchy, muddy palette |
| Localisation | 🟡 Medium | English only, despite a Kraków base |

---

## 1. Trust and credibility 🔴

| # | Finding | Evidence | Impact |
|---|---|---|---|
| 1.1 | **Placeholder team members** | About page lists "Michael Carter", "Sophia Reynolds", "Daniel Kim" and "Emily Vargas" with Unsplash stock portraits. Their Twitter and LinkedIn links point to `#`. | A visitor who reverse-image-searches a photo, or clicks a social link, concludes the company isn't real. |
| 1.2 | **Unverifiable testimonials** | Homepage quote from "Helen Grant, Shipping Line Operations Manager" and About quote from "Global Traders Inc." use the **same stock photo**. | Reads as invented. Fake reviews can also breach consumer-protection rules in the EU. |
| 1.3 | **No proof points** | No certifications (IATA, FIATA, AEO), memberships, insurance partner, company registration number, years in business or shipment volumes. | Shippers have nothing to check before trusting MKY with cargo. |

**Recommendation:** remove all placeholder people now. Replace with real team names and photos (or no team section), 1 to 3 genuine client quotes with permission, and only the accreditations MKY actually holds.

## 2. Conversion 🔴

| # | Finding | Impact |
|---|---|---|
| 2.1 | **No quote request form.** The most important action for a forwarder is missing. Visitors have to find the email address at the bottom of the page. | Most visitors leave instead of writing a free-form email. |
| 2.2 | **No contact page.** Navigation links only to Services and About. | Hard to find phone, email and address. |
| 2.3 | **Buttons go to the wrong place.** "Discover Services" links to `/about`. "Learn More" on Services also links to `/about`. | Confusing; breaks the visitor's path. |
| 2.4 | **"Discover our competitive rates"** with no rates, calculator or quote route. | Promise without follow-through. |
| 2.5 | A chat-style "We are here 😊" element with no clear action. | Looks unfinished. |

**Recommendation:** a structured quote form reachable from every page, a contact page, a WhatsApp button, and correct links on every call to action.

## 3. SEO 🟠

| # | Finding | Fix |
|---|---|---|
| 3.1 | Site name is **"MKY GLOBAL FORWARDING - My WordPress Blog"** (WordPress default), shown in Google results and in link previews on WhatsApp and LinkedIn. | Set the site name, titles and descriptions per page. |
| 3.2 | Meta descriptions are auto-generated from page text and cut off mid-sentence. | Write a unique description for every page. |
| 3.3 | Heading structure is weak: the main headline is styled at about 20px, and similar H2s repeat across pages. | One clear H1 per page; descriptive H2s. |
| 3.4 | Thin, duplicated copy: variants of "Reliable freight forwarding tailored to your needs" appear at least four times. | Specific copy per service, with the terms shippers search for (FCL, LCL, customs clearance Kraków, air freight Poland). |
| 3.5 | No local business data (structured data, Google Business Profile link). | Add `LocalBusiness` schema and link the profile. |
| 3.6 | No Polish pages, so the site can't rank for Polish searches. | Add a Polish version. |

## 4. Content 🟠

- Nothing about **which routes, ports or countries** MKY serves.
- Services are described in one generic sentence each; no detail on FCL/LCL, documents, or what's included.
- "Land freight" is mentioned once but has no service section.
- About page has no founding story, mission specifics or location advantages (Kraków on the A4 corridor, access to Baltic ports).

## 5. Features 🟠

| Promised on the site | Exists? |
|---|---|
| "Real-time tracking ... available around the clock" | ❌ No tracking page |
| "Competitive rates" | ❌ No quote or estimate tool |
| "Dedicated customer service" | ⚠️ Email and phone in footer only |

## 6. Design 🟡

- Recognisable WordPress block theme; nothing distinctive to MKY.
- Palette (tan `#A89F84`, orange `#FF9900`, dark grey) lacks contrast and hierarchy.
- All images are hotlinked from Unsplash, generic and unrelated to MKY's own operations.
- Sharp-cornered blocks with even weight; no clear focal point per section.

## 7. Technical notes

- Platform: WordPress with All in One SEO plugin.
- Images load from a third-party host (Unsplash) rather than optimised local files.
- Services and About pages have not been modified since first publication (June 2025).
- The sitemap could not be retrieved during the audit; confirm it exists and is submitted in Google Search Console.

---

## Priority list

| Priority | Action | Effort |
|---|---|---|
| **Now** (this week, on the current site) | Remove fake team and testimonials · fix site name · fix button links | 1 to 2 hours |
| **Phase 1** (new site) | Quote form · contact page · service pages · tools · SEO setup · new design | See proposal |
| **Phase 2** | Polish version · real tracking data · CMS · analytics dashboard | See proposal |

The redesign that addresses every item above is in this repository; see [`PROPOSAL.md`](PROPOSAL.md).
