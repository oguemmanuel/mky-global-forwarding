import { NextResponse } from "next/server";
import { fieldErrors, quoteSchema } from "@/lib/schemas";
import { makeReference, notifyTeam } from "@/lib/notify";
import { saveQuote } from "@/lib/store";
import { quoteMessage } from "@/lib/quoteMessage";
import { features } from "@/content/site";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }
  const q = parsed.data;

  // Honeypot filled: pretend success, store nothing
  if (q.website) return NextResponse.json({ ok: true, reference: makeReference("MKY-Q") });

  const reference = makeReference("MKY-Q");
  const isVehicle = q.mode === "vehicle" || q.mode === "road" || q.mode === "documents";

  try {
    await saveQuote({
      created_at: new Date().toISOString(),
      reference,
      channel: q.channel,
      status: "new",
      mode: q.mode,
      origin: q.origin,
      destination: q.destination,
      ready_date: q.readyDate || null,
      collection: q.collection === "yes",
      documents: q.documents,
      incoterm: q.incoterm || null,
      vehicle_type: isVehicle ? q.vehicleType ?? null : null,
      vehicle_count: isVehicle ? q.vehicleCount ?? null : null,
      make_model: isVehicle ? q.makeModel || null : null,
      vins: isVehicle ? q.vins || null : null,
      running: q.mode === "vehicle" || q.mode === "road" ? q.running === "yes" : null,
      goods: q.mode === "cargo" ? q.goods || null : null,
      pieces: q.mode === "cargo" ? q.pieces ?? null : null,
      weight_kg: q.mode === "cargo" ? q.weightKg ?? null : null,
      dims_cm: q.mode === "cargo" && q.lengthCm && q.widthCm && q.heightCm ? `${q.lengthCm}x${q.widthCm}x${q.heightCm}` : null,
      dangerous: q.mode === "cargo" ? q.dangerous : false,
      name: q.name,
      company: q.company || null,
      email: q.email,
      phone: q.phone || null,
      notes: q.notes || null,
    });
  } catch (err) {
    console.error("[quote] save failed", err);
    return NextResponse.json({ ok: false, errors: { form: "We couldn't save your request. Please try again or message us on WhatsApp." } }, { status: 500 });
  }

  // Phase 2: email notification (switch on in content/site.ts and set RESEND_API_KEY)
  if (features.emailNotifications) {
    await notifyTeam(`New quote request ${reference}`, { Request: quoteMessage(q, reference).replace(/\*/g, "") });
  }

  return NextResponse.json({ ok: true, reference });
}
