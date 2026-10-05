import { isContainerNumber, withCheckDigit } from "./container";

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
  mode: "air" | "sea" | "road";
  equipment: string;
  containerNo?: string;
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  etaOffset: number;
  progress: number; // 0..1 along the route
  status: "Booked" | "In transit" | "At destination" | "Delivered";
  milestones: Milestone[];
};

/**
 * Demo data. In production, replace `findShipment` with a call to MKY's
 * TMS or a carrier visibility API (see docs/TECHNICAL_SPEC.md, "Tracking integration").
 */
const DEMO: Shipment[] = [
  {
    reference: "MKY-DEMO-001",
    mode: "sea",
    equipment: "1 × 40' high cube",
    containerNo: withCheckDigit("MKYU482150"),
    origin: { code: "KRK", city: "Kraków, PL" },
    destination: { code: "TEM", city: "Tema, GH" },
    etaOffset: 9,
    progress: 0.58,
    status: "In transit",
    milestones: [
      { code: "BKD", title: "Booking confirmed", location: "Kraków", dayOffset: -18, status: "done" },
      { code: "PUP", title: "Collected and sealed", location: "Kraków", dayOffset: -16, status: "done" },
      { code: "EXC", title: "Export customs cleared", location: "Gdańsk", dayOffset: -14, status: "done" },
      { code: "DEP", title: "Vessel departed", location: "Gdańsk (PLGDN)", dayOffset: -12, status: "done" },
      { code: "TSH", title: "Transhipment", location: "Algeciras (ESALG)", dayOffset: -3, status: "current" },
      { code: "ARR", title: "Vessel arrival", location: "Tema (GHTEM)", dayOffset: 9, status: "upcoming" },
      { code: "DLV", title: "Cleared and delivered", location: "Accra", dayOffset: 12, status: "upcoming" },
    ],
  },
  {
    reference: "MKY-DEMO-002",
    mode: "air",
    equipment: "4 pieces · 312 kg chargeable",
    origin: { code: "KRK", city: "Kraków, PL" },
    destination: { code: "DXB", city: "Dubai, AE" },
    etaOffset: 1,
    progress: 0.8,
    status: "In transit",
    milestones: [
      { code: "BKD", title: "Booking confirmed", location: "Kraków", dayOffset: -3, status: "done" },
      { code: "RCS", title: "Received at airline", location: "Kraków Airport (KRK)", dayOffset: -2, status: "done" },
      { code: "DEP", title: "Flight departed", location: "Kraków Airport (KRK)", dayOffset: -1, status: "done" },
      { code: "ARR", title: "Arrived at destination", location: "Dubai (DXB)", dayOffset: 0, status: "current" },
      { code: "DLV", title: "Delivered to consignee", location: "Dubai", dayOffset: 1, status: "upcoming" },
    ],
  },
];

export function normaliseReference(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}

export type LookupResult =
  | { ok: true; shipment: Shipment }
  | { ok: false; reason: "not_found" | "invalid_container"; message: string };

export async function findShipment(input: string): Promise<LookupResult> {
  const ref = normaliseReference(input);
  if (/^[A-Z]{4}[0-9]{7}$/.test(ref) && !isContainerNumber(ref)) {
    return {
      ok: false,
      reason: "invalid_container",
      message: "That container number fails the ISO 6346 check digit. Check the last digit and try again.",
    };
  }
  const hit = DEMO.find((s) => s.reference.replace(/-/g, "") === ref.replace(/-/g, "") || s.containerNo === ref);
  if (!hit) {
    return {
      ok: false,
      reason: "not_found",
      message: "We couldn't find that reference. Check your booking confirmation, or contact your coordinator.",
    };
  }
  return { ok: true, shipment: hit };
}

export const demoReferences = DEMO.map((s) => s.reference);
