/**
 * UI strings for the site chrome and homepage hero.
 * Phase 1 translates navigation, footer and primary calls to action.
 * Phase 2 (see docs/PROPOSAL.md) moves to locale routes (/pl/...) with full Polish content.
 * Polish strings should be reviewed by a native speaker at MKY before launch.
 */
export const dictionaries = {
  en: {
    nav: { services: "Services", tools: "Tools", track: "Track", about: "About", contact: "Contact" },
    cta: { quote: "Get a quote", track: "Track shipment", talk: "Talk to us" },
    hero: {
      eyebrow: "Air · Ocean · Road · Customs",
      title: "Freight, forwarded. From Kraków to the world.",
      sub: "Air, ocean and road freight with customs handled in-house. Price it in minutes, follow every milestone online, and talk to one coordinator the whole way.",
    },
    footer: {
      tagline: "Air, ocean and road freight with customs clearance, from Kraków to the world.",
      services: "Services",
      company: "Company",
      contact: "Contact",
    },
    menu: "Menu",
    close: "Close",
  },
  pl: {
    nav: { services: "Usługi", tools: "Narzędzia", track: "Śledzenie", about: "O nas", contact: "Kontakt" },
    cta: { quote: "Wycena", track: "Śledź przesyłkę", talk: "Porozmawiajmy" },
    hero: {
      eyebrow: "Lotniczy · Morski · Drogowy · Cło",
      title: "Spedycja bez granic. Z Krakowa na cały świat.",
      sub: "Transport lotniczy, morski i drogowy z odprawą celną na miejscu. Wycena w kilka minut, śledzenie każdego etapu online i jeden opiekun przez cały czas.",
    },
    footer: {
      tagline: "Transport lotniczy, morski i drogowy z odprawą celną, z Krakowa na cały świat.",
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
