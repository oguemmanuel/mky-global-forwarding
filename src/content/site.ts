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

export type ServiceSlug = "air-freight" | "ocean-freight" | "road-freight" | "customs-clearance";

export type Service = {
  slug: ServiceSlug;
  media: "air" | "ocean" | "road" | "customs";
  code: string;
  name: string;
  short: string;
  headline: string;
  intro: string;
  idealFor: string[];
  includes: string[];
  documents: string[];
  confirm: string[];
};

export const services: Service[] = [
  {
    slug: "air-freight",
    media: "air",
    code: "AIR",
    name: "Air freight",
    short: "Urgent and high-value cargo on scheduled flights, airport to airport or door to door.",
    headline: "Air freight when the deadline can't move",
    intro:
      "For time-sensitive, high-value or perishable cargo. We book space with airlines, arrange collection, issue the air waybill and handle export and import formalities at both ends.",
    idealFor: ["Spare parts and machinery components", "Electronics and high-value goods", "Samples and urgent replenishment"],
    includes: [
      "Consolidated and direct shipments",
      "Door-to-door or airport-to-airport",
      "Air waybill (AWB) issued and tracked",
      "Collection from your premises",
      "Chargeable weight calculated upfront",
      "Cargo insurance on request",
    ],
    documents: ["Commercial invoice", "Packing list", "Air waybill (AWB)", "Export declaration"],
    confirm: ["Dangerous goods (DG) handling", "Temperature-controlled cargo"],
  },
  {
    slug: "ocean-freight",
    media: "ocean",
    code: "SEA",
    name: "Ocean freight",
    short: "Full containers or shared space for smaller loads, port to port or door to door.",
    headline: "Ocean freight for volume at the lowest cost per kilo",
    intro:
      "The most economical way to move large volumes over long distances. Book a full container for your own goods, or pay only for the space you use in a shared one.",
    idealFor: ["Regular import and export programmes", "Heavy or bulky goods", "Cost-sensitive shipments with flexible timing"],
    includes: [
      "FCL: 20', 40' and 40' high-cube containers",
      "LCL: pay per cubic metre",
      "Bill of lading (B/L) handling",
      "Port-to-port or door-to-door",
      "Pre-carriage and on-carriage by truck",
      "Container tracking by ISO number",
    ],
    documents: ["Commercial invoice", "Packing list", "Bill of lading (B/L)", "Certificate of origin (if required)"],
    confirm: ["Main ports used (e.g. Gdańsk, Gdynia, Hamburg)", "Reefer containers"],
  },
  {
    slug: "road-freight",
    media: "road",
    code: "ROAD",
    name: "Road freight",
    short: "Full and part truckloads across Poland and the European Union.",
    headline: "Road freight across Poland and the EU",
    intro:
      "Flexible trucking for full loads or a few pallets. Ideal for regional distribution and for linking ports and airports to your warehouse.",
    idealFor: ["EU distribution", "Palletised goods", "Port and airport connections"],
    includes: [
      "FTL: a full truck for your cargo",
      "LTL: shared space for pallet loads",
      "CMR consignment notes provided",
      "Domestic and cross-border routes",
      "Tail-lift and curtain-sider options",
    ],
    documents: ["CMR consignment note", "Commercial invoice", "Packing list"],
    confirm: ["Own fleet or partner hauliers", "Countries covered by road"],
  },
  {
    slug: "customs-clearance",
    media: "customs",
    code: "CUSTOMS",
    name: "Customs clearance",
    short: "Import and export declarations and transit documents, prepared right the first time.",
    headline: "Customs clearance without delays at the border",
    intro:
      "Mistakes in customs paperwork lead to holds, storage fees and missed deadlines. We prepare and submit declarations for goods entering or leaving the EU and keep you informed at every step.",
    idealFor: ["First-time importers into the EU", "Exporters shipping outside the EU", "Goods moving under transit"],
    includes: [
      "Import and export declarations",
      "T1 / T2 transit documents",
      "Tariff (HS code) classification",
      "Duty and VAT calculation",
      "EORI number guidance",
      "Certificates of origin",
    ],
    documents: ["Commercial invoice", "Packing list", "EORI number", "Transport document (AWB, B/L or CMR)"],
    confirm: ["Licensed customs agent status", "AEO certification"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const processSteps = [
  { title: "Quote", body: "Tell us what you're shipping and where. You get a price and transit options from a real coordinator." },
  { title: "Book", body: "We book space with the airline, shipping line or haulier and schedule collection." },
  { title: "Clear", body: "We prepare the customs paperwork so cargo clears without holds or storage fees." },
  { title: "Deliver", body: "Follow every milestone online until the goods arrive, with one contact throughout." },
];

export const stats = [
  { value: TODO("XX"), label: "countries shipped to" },
  { value: TODO("X,XXX"), label: "shipments handled" },
  { value: TODO("XX yrs"), label: "combined team experience" },
  { value: TODO("< X h"), label: "average quote reply" },
];

export const accreditations = [
  TODO("IATA cargo agent"),
  TODO("FIATA member"),
  TODO("AEO certificate"),
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
  { name: TODO("Name"), role: TODO("Customs") },
  { name: TODO("Name"), role: TODO("Sales") },
];

/** Example lanes for the coverage map. Replace with MKY's real core lanes. */
export const lanes: { code: string; city: string; lat: number; lng: number; mode: "air" | "sea" | "road"; label?: "left" | "below" }[] = [
  { code: "GDN", city: "Gdańsk", lat: 54.35, lng: 18.65, mode: "sea" },
  { code: "HAM", city: "Hamburg", lat: 53.55, lng: 9.99, mode: "sea" },
  { code: "RTM", city: "Rotterdam", lat: 51.92, lng: 4.48, mode: "road", label: "left" },
  { code: "MXP", city: "Milan", lat: 45.63, lng: 8.72, mode: "road", label: "left" },
  { code: "IST", city: "Istanbul", lat: 41.01, lng: 28.98, mode: "road" },
  { code: "DXB", city: "Dubai", lat: 25.2, lng: 55.27, mode: "air" },
  { code: "JED", city: "Jeddah", lat: 21.49, lng: 39.17, mode: "sea" },
  { code: "BOM", city: "Mumbai", lat: 19.08, lng: 72.88, mode: "air" },
  { code: "TEM", city: "Tema", lat: 5.64, lng: 0.01, mode: "sea", label: "left" },
  { code: "LOS", city: "Lagos", lat: 6.52, lng: 3.38, mode: "air" },
  { code: "SHA", city: "Shanghai", lat: 31.23, lng: 121.47, mode: "sea" },
];

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

export const nav = [
  { href: "/services", key: "services" },
  { href: "/tools", key: "tools" },
  { href: "/track", key: "track" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;
