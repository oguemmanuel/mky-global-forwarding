import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Phase 1 admin access: one shared password (ADMIN_PASSWORD) and an HttpOnly cookie.
 * Phase 2: replace with per-user logins (e.g. Supabase Auth) and roles.
 */
export const ADMIN_COOKIE = "mky_admin";

const token = (password: string) => createHmac("sha256", password).update("mky-admin-v1").digest("hex");

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordMatches(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(token(input));
  const b = Buffer.from(token(pw));
  return a.length === b.length && timingSafeEqual(a, b);
}

export const sessionValue = () => token(process.env.ADMIN_PASSWORD ?? "");

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === sessionValue();
}
