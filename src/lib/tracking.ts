import { isContainerNumber } from "./container";
import { isVin, normaliseVin, vinProblem } from "./vin";

export type MilestoneStatus = "done" | "current" | "upcoming";

export type Milestone = {
  code: string;
  title: string;
  location: string;
  /** Days relative to today, so the demo always looks current */
  dayOffset: number;
  status: MilestoneStatus;
};

export type Shipment = {
  reference: string;
  mode: "roro" | "container" | "road";
  vehicle?: string;
  vin?: string;
  containerNo?: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  sailing?: string;
  etaOffset: number;
  progress: number; // 0..1 along the route
  status: "Booked" | "Documents" | "Loaded" | "In port" | "Sailing" | "Released";
  milestones: Milestone[];
};

/**
 * Milestones mirror the status columns in MKY's shipments sheet:
 * booking, export docs (MRN / EUR.1 / ACID), loading, bill of lading, shipping invoice, release.
 *
 * Demo data only. In production `findShipment` reads the shipments sheet (Google Sheets API)
 * or MKY's system and returns ONLY the matching vehicle's status, never client names or other rows.
 * See docs/TECHNICAL_SPEC.md, "Tracking integration".
 */
const DEMO: Shipment[] = [
  {
    reference: "MKY-DEMO-001",
    mode: "roro",
    vehicle: "Passenger car",
    vin: "VF7DEMXXX00000001",
    origin: { code: "ANR", city: "Antwerp, BE" },
    destination: { code: "ALY", city: "Alexandria, EG" },
    sailing: "Antwerp → Alexandria",
    etaOffset: 6,
    progress: 0.55,
    status: "Sailing",
    milestones: [
      { code: "BKD", title: "Sailing booked", location: "Antwerp", dayOffset: -14, status: "done" },
      { code: "MRN", title: "Export declaration issued (MRN)", location: "Belgium", dayOffset: -11, status: "done" },
      { code: "EUR", title: "EUR.1 origin certificate issued", location: "Belgium", dayOffset: -10, status: "done" },
      { code: "ACD", title: "ACID filed and documents sent via CargoX", location: "Egypt", dayOffset: -9, status: "done" },
      { code: "LOD", title: "Loaded on vessel", location: "Port of Antwerp", dayOffset: -6, status: "done" },
      { code: "BLC", title: "Bill of lading issued, invoice sent", location: "Antwerp", dayOffset: -5, status: "current" },
      { code: "ARR", title: "Arrival at destination port", location: "Alexandria", dayOffset: 6, status: "upcoming" },
      { code: "REL", title: "Released to consignee", location: "Alexandria", dayOffset: 9, status: "upcoming" },
    ],
  },
  {
    reference: "MKY-DEMO-002",
    mode: "roro",
    vehicle: "Truck with trailer",
    vin: "WDBDEMXXX00000002",
    origin: { code: "ANR", city: "Antwerp, BE" },
    destination: { code: "SWK", city: "Shuwaikh, KW" },
    sailing: "Antwerp → Shuwaikh",
    etaOffset: 0,
    progress: 0.95,
    status: "In port",
    milestones: [
      { code: "BKD", title: "Sailing booked", location: "Antwerp", dayOffset: -30, status: "done" },
      { code: "MRN", title: "Export declaration issued (MRN)", location: "Belgium", dayOffset: -27, status: "done" },
      { code: "LOD", title: "Loaded on vessel", location: "Port of Antwerp", dayOffset: -24, status: "done" },
      { code: "BLC", title: "Bill of lading issued, invoice sent", location: "Antwerp", dayOffset: -22, status: "done" },
      { code: "ARR", title: "Arrived in port", location: "Shuwaikh port", dayOffset: 0, status: "current" },
      { code: "REL", title: "Released to consignee", location: "Shuwaikh", dayOffset: 3, status: "upcoming" },
    ],
  },
];

export function normaliseReference(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

export type LookupResult =
  | { ok: true; shipment: Shipment }
  | { ok: false; reason: "not_found" | "invalid_container" | "invalid_vin"; message: string };

export async function findShipment(input: string): Promise<LookupResult> {
  const ref = normaliseReference(input);

  // Looks like a container number (4 letters + 7 digits) with a bad check digit
  if (/^[A-Z]{4}[0-9]{7}$/.test(ref) && !isContainerNumber(ref)) {
    return { ok: false, reason: "invalid_container", message: "That container number fails the ISO 6346 check digit. Check the last digit and try again." };
  }

  // 17 characters and not an MKY reference: treat as a VIN
  const vin = normaliseVin(input);
  if (vin.length === 17 && !ref.startsWith("MKY")) {
    const problem = vinProblem(vin);
    if (problem) return { ok: false, reason: "invalid_vin", message: problem };
  }

  const hit = DEMO.find(
    (s) =>
      s.reference.replace(/-/g, "") === ref.replace(/-/g, "") ||
      (s.vin && isVin(vin) && s.vin === vin) ||
      s.containerNo === ref,
  );
  if (!hit) {
    return {
      ok: false,
      reason: "not_found",
      message: "We couldn't find that VIN or reference. Check it against your booking confirmation, or message your coordinator on WhatsApp.",
    };
  }
  return { ok: true, shipment: hit };
}

export const demoReferences = DEMO.map((s) => s.vin ?? s.reference);
