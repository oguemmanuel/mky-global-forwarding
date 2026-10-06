import { NextResponse } from "next/server";
import { findShipment } from "@/lib/tracking";
import { logEvent } from "@/lib/store";

export async function GET(request: Request) {
  const ref = (new URL(request.url).searchParams.get("ref") ?? "").trim();
  if (ref.length < 4) {
    return NextResponse.json({ ok: false, reason: "invalid", message: "Enter a VIN / chassis number or your MKY reference." }, { status: 400 });
  }
  const result = await findShipment(ref);
  await logEvent({
    created_at: new Date().toISOString(),
    type: "track_search",
    query: ref.toUpperCase().slice(0, 40),
    found: result.ok,
    reason: result.ok ? null : result.reason,
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
