/**
 * Freight maths using common industry conversion factors.
 * These are indicative only; MKY confirms the final chargeable weight on every quote.
 */

export type Mode = "air" | "sea" | "road";

/** kg per cubic metre used to convert volume into "volumetric" weight */
export const VOLUMETRIC_FACTOR: Record<Mode, number> = {
  air: 167, // IATA standard: 6,000 cm3 per kg
  road: 333, // common European road freight factor
  sea: 1000, // LCL "weight or measure": 1 CBM = 1,000 kg
};

export type Piece = { length: number; width: number; height: number; quantity: number; weight: number };

/** Cubic metres from centimetre dimensions */
export const cbm = (p: Pick<Piece, "length" | "width" | "height" | "quantity">) =>
  (p.length * p.width * p.height * p.quantity) / 1_000_000;

export function chargeable(pieces: Piece[], mode: Mode) {
  const volume = pieces.reduce((s, p) => s + cbm(p), 0);
  const actual = pieces.reduce((s, p) => s + p.weight * p.quantity, 0);
  const volumetric = volume * VOLUMETRIC_FACTOR[mode];
  const chargeableKg = Math.max(actual, volumetric);
  // LCL is billed per revenue tonne (W/M): the greater of tonnes or cubic metres
  const revenueTonnes = mode === "sea" ? Math.max(actual / 1000, volume) : null;
  return {
    volume,
    actual,
    volumetric,
    chargeableKg,
    revenueTonnes,
    basis: volumetric > actual ? ("volume" as const) : ("weight" as const),
  };
}

/** Internal dimensions and limits of standard dry containers (typical values) */
export const containers = [
  { code: "20DV", name: "20' standard", cbm: 33.2, payloadKg: 28_200 },
  { code: "40DV", name: "40' standard", cbm: 67.7, payloadKg: 26_700 },
  { code: "40HC", name: "40' high cube", cbm: 76.4, payloadKg: 26_500 },
] as const;

/** Suggest the smallest container that fits, or LCL when under ~15 CBM */
export function suggestContainer(volume: number, weightKg: number) {
  if (volume < 15 && weightKg < 10_000) return { code: "LCL", name: "LCL (shared container)" };
  const fit = containers.find((c) => volume <= c.cbm * 0.85 && weightKg <= c.payloadKg);
  return fit ?? { code: "MULTI", name: "More than one container" };
}

export const fmt = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
