import { NextResponse } from "next/server";
import { contactSchema, fieldErrors } from "@/lib/schemas";
import { makeReference, notifyTeam } from "@/lib/notify";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }
  const c = parsed.data;
  if (c.website) return NextResponse.json({ ok: true });

  const reference = makeReference("MKY-C");
  await notifyTeam(`Website enquiry ${reference}: ${c.topic}`, {
    Reference: reference,
    Topic: c.topic,
    Name: c.name,
    Email: c.email,
    Message: c.message,
  });
  return NextResponse.json({ ok: true, reference });
}
