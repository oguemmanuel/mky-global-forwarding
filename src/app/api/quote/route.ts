import { NextResponse } from "next/server";
import { fieldErrors, quoteSchema } from "@/lib/schemas";
import { makeReference, notifyTeam } from "@/lib/notify";
import { chargeable } from "@/lib/freight";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Invalid request" } }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }
  const q = parsed.data;

  // Honeypot filled: pretend success, do nothing
  if (q.website) return NextResponse.json({ ok: true, reference: makeReference("MKY-Q") });

  const reference = makeReference("MKY-Q");
  const hasDims = q.lengthCm && q.widthCm && q.heightCm;
  const calc = hasDims
    ? chargeable([{ length: q.lengthCm!, width: q.widthCm!, height: q.heightCm!, quantity: q.pieces, weight: q.weightKg / q.pieces }], q.mode)
    : null;

  await notifyTeam(`New quote request ${reference}: ${q.mode.toUpperCase()} ${q.origin} → ${q.destination}`, {
    Reference: reference,
    Mode: q.mode,
    Route: `${q.origin} → ${q.destination}`,
    "Service level": q.serviceLevel,
    Incoterm: q.incoterm || "Not sure",
    "Customs needed": q.customs,
    "Ready date": q.readyDate,
    Goods: q.goods,
    "HS code": q.hsCode,
    Equipment: q.equipment,
    Pieces: q.pieces,
    "Total weight (kg)": q.weightKg,
    "Dims per piece (cm)": hasDims ? `${q.lengthCm} × ${q.widthCm} × ${q.heightCm}` : undefined,
    "Est. chargeable (kg)": calc ? Math.round(calc.chargeableKg) : undefined,
    "Dangerous goods": q.dangerous ? "YES" : "No",
    Name: q.name,
    Company: q.company,
    Email: q.email,
    Phone: q.phone,
    Notes: q.notes,
  });

  return NextResponse.json({ ok: true, reference });
}
