import type { QuoteInput } from "./schemas";

export const modeLabel: Record<QuoteInput["mode"], string> = {
  vehicle: "Vehicle shipping",
  cargo: "Container & cargo",
  road: "Inland transport",
  documents: "Export documents only",
};

export const docLabel: Record<string, string> = {
  mrn: "Export declaration (MRN)",
  eur1: "EUR.1 origin certificate",
  acid: "ACID / CargoX (Egypt)",
  other: "Other documents",
};

export const vehicleLabel: Record<string, string> = {
  car: "Car",
  van: "Van",
  suv: "SUV / 4x4",
  truck: "Truck",
  trailer: "Trailer",
  motorbike: "Motorbike",
  other: "Other vehicle",
};

type Q = Partial<QuoteInput> & { mode: QuoteInput["mode"] };

/** Plain-text summary used for WhatsApp and email. No em dashes, WhatsApp-friendly bold with *asterisks*. */
export function quoteMessage(q: Q, reference?: string) {
  const lines: string[] = [];
  lines.push(`*Quote request${reference ? ` ${reference}` : ""}*`);
  lines.push(`${modeLabel[q.mode]}: ${q.origin || "?"} → ${q.destination || "?"}`);
  if (q.mode === "vehicle" || q.mode === "road") {
    lines.push(
      `${q.vehicleCount || "?"} × ${q.vehicleType ? vehicleLabel[q.vehicleType] : "vehicle"}${q.makeModel ? `, ${q.makeModel}` : ""}${q.running === "no" ? " (non-running)" : ""}`,
    );
    if (q.vins) lines.push(`VIN: ${q.vins.split(/\s+/).filter(Boolean).join(", ")}`);
  }
  if (q.mode === "cargo") {
    lines.push(`${q.goods || "Goods"}: ${q.pieces || "?"} pcs, ${q.weightKg || "?"} kg`);
    if (q.lengthCm && q.widthCm && q.heightCm) lines.push(`Dims per piece: ${q.lengthCm} × ${q.widthCm} × ${q.heightCm} cm`);
    if (q.dangerous) lines.push("Dangerous goods: YES");
  }
  if (q.documents && q.documents.length) lines.push(`Documents: ${q.documents.map((d) => docLabel[d]).join(", ")}`);
  if (q.collection === "yes") lines.push("Collection to port needed");
  if (q.readyDate) lines.push(`Ready: ${q.readyDate}`);
  if (q.incoterm) lines.push(`Incoterm: ${q.incoterm}`);
  lines.push(`From: ${q.name || "?"}${q.company ? `, ${q.company}` : ""}${q.email ? ` · ${q.email}` : ""}${q.phone ? ` · ${q.phone}` : ""}`);
  if (q.notes) lines.push(`Notes: ${q.notes}`);
  return lines.join("\n");
}

export const whatsappLink = (base: string, text: string) => `${base}?text=${encodeURIComponent(text)}`;
