/**
 * Single source of truth for company facts and marketing copy.
 * Anything wrapped in TODO() is a placeholder MKY must confirm or supply.
 * Search the codebase for "TODO(" to find every open item.
 */

export const TODO = (label: string) => ({ todo: true as const, label });
export type Todo = ReturnType<typeof TODO>;
export type MaybeTodo<T> = T | Todo;
export const isTodo = (v: unknown): v is Todo =>
  typeof v === "object" && v !== null && (v as Todo).todo === true;

export const company = {
  name: "MKY Global Forwarding",
  shortName: "MKY",
  legalName: TODO("Registered company name"),
  url: "https://mkyglobalforwarding.com",
  email: "ship@mkyglobalforwarding.com",
  phone: "+48 578 773 222",
  phoneHref: "+48578773222",
  whatsapp: "https://wa.me/48578773222",
  address: {
    street: "Krzywda 19A",
    postalCode: "30-720",
    city: "Kraków",
    country: "Poland",
    countryCode: "PL",
  },
  geo: { lat: 50.0647, lng: 19.945 },
  hours: TODO("Office hours, e.g. Mon to Fri 08:00 to 17:00 CET"),
  nip: TODO("NIP / KRS registration number"),
  founded: TODO("Year founded"),
  socials: {
    linkedin: TODO("LinkedIn company page URL"),
  },
} as const;

export type ServiceSlug = "vehicle-shipping" | "export-documents" | "inland-transport" | "container-cargo";

export type Service = {
  slug: ServiceSlug;
  media: "air" | "ocean" | "road" | "customs" | "cta" | "hero";
  code: string;
  name: string;
  short: string;
  headline: string;
  intro: string;
  idealFor: string[];
  includes: string[];
  documents: string[];
  confirm: string[];
  /** Default quote-form mode when a visitor clicks "Quote" on this service */
  quoteMode: QuoteMode;
};

/**
 * Service content is based on MKY's shipments sheet (vehicle exports from EU ports with
 * MRN, EUR.1 and ACID/CargoX documents). Items in `confirm` must be checked with MKY.
 */
export const services: Service[] = [
  {
    slug: "vehicle-shipping",
    media: "ocean",
    code: "VEHICLES",
    name: "Vehicle shipping",
    short: "Cars, vans, trucks and trailers shipped from European ports to the Middle East and North Africa.",
    headline: "Vehicle shipping from Europe to the Middle East",
    intro:
      "We book your vehicles on the right sailing, handle the export paperwork and keep you updated by VIN from booking to release at the destination port.",
    idealFor: ["Car and commercial vehicle exporters", "Dealers and fleet buyers in Egypt, Kuwait and the region", "Trucks and trailers moving to new markets"],
    includes: [
      "Booking on scheduled sailings",
      "Cars, vans, trucks and trailers",
      "Status updates by VIN / chassis number",
      "Loading and port coordination",
      "Shipping invoice and bill of lading handling",
      "Release follow-up at destination",
    ],
    documents: ["Vehicle registration or title", "Commercial invoice", "Export declaration (MRN)", "Importer details for destination country"],
    confirm: ["Ro-Ro, containers or both", "Origin ports used (e.g. Antwerp, Alicante, Trieste)", "Non-running vehicles accepted"],
    quoteMode: "vehicle",
  },
  {
    slug: "export-documents",
    media: "customs",
    code: "DOCUMENTS",
    name: "Export documents",
    short: "MRN export declarations, EUR.1 certificates and ACID filing via CargoX for Egypt.",
    headline: "Export documents done right, before the ship sails",
    intro:
      "Missing or wrong paperwork is the most common reason a vehicle is held at port. We prepare the export declaration, origin certificates and destination filings, and check every detail before loading.",
    idealFor: ["Exporters shipping vehicles outside the EU", "Shipments to Egypt that need ACID", "Goods that qualify for preferential origin"],
    includes: [
      "EU export declaration and MRN",
      "EUR.1 movement certificates where a trade agreement applies",
      "ACID filing support and document upload via CargoX for Egypt",
      "Document checks before loading",
      "Document-only service for shipments booked elsewhere",
    ],
    documents: ["Commercial invoice", "Vehicle registration or title", "Exporter and importer details", "ACID number from the Egyptian importer (for Egypt)"],
    confirm: ["Documents MKY issues in-house vs via a partner agent", "Document-only service offered"],
    quoteMode: "documents",
  },
  {
    slug: "inland-transport",
    media: "road",
    code: "TRANSPORT",
    name: "Inland transport",
    short: "Collection and delivery of vehicles and cargo across Europe to the port of loading.",
    headline: "From your yard to the port of loading",
    intro:
      "We arrange collection by car transporter or truck from anywhere in Europe and deliver to the port in time for the cut-off, so the vehicle makes its sailing.",
    idealFor: ["Vehicles bought from dealers or auctions across Europe", "Trucks and trailers driven or carried to port", "Combined road and sea routes, e.g. via Trieste"],
    includes: [
      "Collection from dealers, auctions or private sellers",
      "Car transporter and truck options",
      "Delivery to port before cut-off",
      "Coordination with the sailing booking",
    ],
    documents: ["Collection address and contact", "Vehicle details (make, model, VIN)", "Release note from the seller"],
    confirm: ["Countries covered for collection", "Own fleet or partner hauliers"],
    quoteMode: "road",
  },
  {
    slug: "container-cargo",
    media: "cta",
    code: "CARGO",
    name: "Container & cargo",
    short: "Containers and general cargo on the same lanes, with the same document support.",
    headline: "Container and general cargo on our lanes",
    intro:
      "Alongside vehicles, we can move containers and general cargo on the same routes, with export declarations and origin documents handled in-house.",
    idealFor: ["Spare parts and accessories shipped with vehicles", "Machinery and equipment", "Regular container exports"],
    includes: [
      "Full containers (20', 40', 40' high cube)",
      "Bill of lading handling",
      "Export declaration and origin documents",
      "Port-to-port or door-to-port",
    ],
    documents: ["Commercial invoice", "Packing list", "Export declaration (MRN)"],
    confirm: ["Whether MKY offers container and general cargo shipping"],
    quoteMode: "cargo",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const processSteps = [
  { title: "Quote", body: "Send the vehicle details and route. A coordinator replies with the price and the next sailing." },
  { title: "Documents", body: "We prepare the export declaration (MRN), EUR.1 and, for Egypt, the ACID filing via CargoX." },
  { title: "Load & sail", body: "We book the sailing, coordinate delivery to port and confirm loading." },
  { title: "Release", body: "Follow each vehicle by VIN until it's released at the destination port." },
];

export const stats = [
  { value: TODO("X,XXX"), label: "vehicles shipped" },
  { value: TODO("XX"), label: "sailings per year" },
  { value: TODO("XX"), label: "destination ports" },
  { value: TODO("< X h"), label: "average quote reply" },
];

export const accreditations = [
  TODO("Customs agent licence"),
  TODO("AEO certificate"),
  TODO("FIATA member"),
  TODO("PISiL member"),
];

export const testimonial = {
  quote: TODO("A short, genuine quote from an MKY client, used with permission"),
  name: TODO("Client name"),
  role: TODO("Role, Company"),
};

export const team = [
  { name: TODO("Name"), role: TODO("Managing Director") },
  { name: TODO("Name"), role: TODO("Operations") },
  { name: TODO("Name"), role: TODO("Documents & customs") },
  { name: TODO("Name"), role: TODO("Data control") },
];

export type QuoteMode = "vehicle" | "cargo" | "road" | "documents";

export type Port = { code: string; city: string; country: string; lat: number; lng: number; label?: "left" | "below" };

/** Ports of loading (Europe). Confirm the full list with MKY. */
export const originPorts: Port[] = [
  { code: "ANR", city: "Antwerp", country: "Belgium", lat: 51.26, lng: 4.4, label: "left" },
  { code: "ALC", city: "Alicante", country: "Spain", lat: 38.34, lng: -0.48, label: "left" },
  { code: "TRS", city: "Trieste", country: "Italy", lat: 45.65, lng: 13.77 },
];

/** Destination ports. Confirm the full list with MKY. */
export const destinationPorts: Port[] = [
  { code: "ALY", city: "Alexandria", country: "Egypt", lat: 31.2, lng: 29.92, label: "below" },
  { code: "SWK", city: "Shuwaikh", country: "Kuwait", lat: 29.35, lng: 47.93 },
  { code: "LAT", city: "Latakia", country: "Syria", lat: 35.52, lng: 35.78 },
];

/** Lanes seen in MKY's shipments sheet. Add or remove as MKY confirms. */
export const lanes: { from: string; to: string }[] = [
  { from: "ALC", to: "ALY" },
  { from: "ANR", to: "SWK" },
  { from: "ANR", to: "LAT" },
  { from: "ANR", to: "ALY" },
];

export const allPorts = [...originPorts, ...destinationPorts];
export const portByCode = (code: string) => allPorts.find((p) => p.code === code);

/** Head office, shown on the map */
export const origin = { code: "KRK", city: "Kraków", lat: 50.06, lng: 19.94 };

export type Incoterm = {
  code: string;
  name: string;
  modes: "any" | "sea";
  carriagePaidBy: "Buyer" | "Seller";
  riskTransfers: string;
  /** Which party arranges each stage, in order: export clearance, main carriage, insurance, import clearance */
  stages: ("Seller" | "Buyer" | "Either")[];
};

export const incoterms: Incoterm[] = [
  { code: "EXW", name: "Ex Works", modes: "any", carriagePaidBy: "Buyer", riskTransfers: "When goods are made available at the seller's premises", stages: ["Buyer", "Buyer", "Either", "Buyer"] },
  { code: "FCA", name: "Free Carrier", modes: "any", carriagePaidBy: "Buyer", riskTransfers: "When goods are handed to the buyer's carrier", stages: ["Seller", "Buyer", "Either", "Buyer"] },
  { code: "FOB", name: "Free On Board", modes: "sea", carriagePaidBy: "Buyer", riskTransfers: "When goods are on board the vessel at the port of loading", stages: ["Seller", "Buyer", "Either", "Buyer"] },
  { code: "CFR", name: "Cost and Freight", modes: "sea", carriagePaidBy: "Seller", riskTransfers: "When goods are on board the vessel at the port of loading", stages: ["Seller", "Seller", "Either", "Buyer"] },
  { code: "CIF", name: "Cost, Insurance and Freight", modes: "sea", carriagePaidBy: "Seller", riskTransfers: "When goods are on board the vessel at the port of loading", stages: ["Seller", "Seller", "Seller", "Buyer"] },
  { code: "CPT", name: "Carriage Paid To", modes: "any", carriagePaidBy: "Seller", riskTransfers: "When goods are handed to the first carrier", stages: ["Seller", "Seller", "Either", "Buyer"] },
  { code: "DAP", name: "Delivered At Place", modes: "any", carriagePaidBy: "Seller", riskTransfers: "On arrival at the named place, ready for unloading", stages: ["Seller", "Seller", "Either", "Buyer"] },
  { code: "DDP", name: "Delivered Duty Paid", modes: "any", carriagePaidBy: "Seller", riskTransfers: "On arrival at the named place, with import duties paid", stages: ["Seller", "Seller", "Either", "Seller"] },
];

/**
 * Phase switches. Phase 1 ships a small, solid core (tracking by VIN, quote requests saved,
 * admin view of the data). Turn features on one at a time in Phase 2 and note it in docs/PHASES.md.
 */
export const features = {
  tools: false, // /tools calculators and Incoterms explorer
  polish: false, // EN/PL switch in the header
  contactForm: false, // form on /contact (contact details still show)
  emailNotifications: false, // also needs RESEND_API_KEY
} as const;

const allNav = [
  { href: "/services", key: "services" },
  { href: "/tools", key: "tools", feature: "tools" },
  { href: "/track", key: "track" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export const nav = allNav.filter((item) => !("feature" in item) || features[item.feature]);
