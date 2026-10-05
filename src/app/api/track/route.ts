import { NextResponse } from "next/server";
import { findShipment } from "@/lib/tracking";

export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref") ?? "";
  if (ref.trim().length < 4) {
    return NextResponse.json({ ok: false, reason: "invalid", message: "Enter a reference, AWB, B/L or container number." }, { status: 400 });
  }
  const result = await findShipment(ref);
  return NextResponse.json(result, { status: result.ok ? 200 : 404 });
}
