/**
 * UI strings for the site chrome and homepage hero.
 * Phase 1 translates navigation, footer and primary calls to action.
 * Phase 2 (see docs/PROPOSAL.md) moves to locale routes (/pl/...) with full Polish content.
 * Polish strings should be reviewed by a native speaker at MKY before launch.
 */
export const dictionaries = {
  en: {
    nav: { services: "Services", tools: "Tools", track: "Track", about: "About", contact: "Contact" },
    cta: { quote: "Get a quote", track: "Track by VIN", talk: "Talk to us" },
    hero: {
      eyebrow: "Vehicle shipping · Export documents",
      title: "Vehicles shipped. Europe to the Middle East.",
      sub: "We ship cars, trucks and trailers from European ports to Egypt, Kuwait and beyond, with the export documents done for you. Track every vehicle by its VIN, from booking to release.",
    },
    footer: {
      tagline: "Vehicle shipping and export documents from European ports to the Middle East and North Africa.",
      services: "Services",
      company: "Company",
      contact: "Contact",
    },
    menu: "Menu",
    close: "Close",
  },
  pl: {
    nav: { services: "Usługi", tools: "Narzędzia", track: "Śledzenie", about: "O nas", contact: "Kontakt" },
    cta: { quote: "Wycena", track: "Śledź po VIN", talk: "Porozmawiajmy" },
    hero: {
      eyebrow: "Transport pojazdów · Dokumenty eksportowe",
      title: "Pojazdy w drodze. Z Europy na Bliski Wschód.",
      sub: "Wysyłamy samochody, ciężarówki i naczepy z portów europejskich do Egiptu, Kuwejtu i dalej, z kompletem dokumentów eksportowych. Śledź każdy pojazd po numerze VIN, od rezerwacji do odbioru.",
    },
    footer: {
      tagline: "Transport pojazdów i dokumenty eksportowe z portów europejskich na Bliski Wschód i do Afryki Północnej.",
      services: "Usługi",
      company: "Firma",
      contact: "Kontakt",
    },
    menu: "Menu",
    close: "Zamknij",
  },
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)["en"];
export const locales = Object.keys(dictionaries) as Locale[];
