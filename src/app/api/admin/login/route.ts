import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, passwordMatches, sessionValue } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const back = new URL("/admin", request.url);

  if (!adminConfigured() || !passwordMatches(password)) {
    back.searchParams.set("error", "1");
    return NextResponse.redirect(back, { status: 303 });
  }

  const res = NextResponse.redirect(back, { status: 303 });
  res.cookies.set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
