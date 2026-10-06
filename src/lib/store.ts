import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Data store for Phase 1: quote requests and tracking searches.
 *
 * - Production: Supabase (Postgres) via its REST API when SUPABASE_URL and
 *   SUPABASE_SERVICE_ROLE_KEY are set. Tables are defined in supabase/schema.sql.
 * - Local development: a JSON file in .data/ (git-ignored), so the admin page works
 *   with no setup. On hosts with a read-only disk it falls back to memory.
 */

export type QuoteRecord = {
  id?: number;
  created_at: string;
  reference: string;
  channel: "email" | "whatsapp";
  status: "new" | "in_progress" | "quoted" | "won" | "lost";
  mode: string;
  origin: string;
  destination: string;
  ready_date: string | null;
  collection: boolean;
  documents: string[];
  incoterm: string | null;
  vehicle_type: string | null;
  vehicle_count: number | null;
  make_model: string | null;
  vins: string | null;
  running: boolean | null;
  goods: string | null;
  pieces: number | null;
  weight_kg: number | null;
  dims_cm: string | null;
  dangerous: boolean;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  notes: string | null;
};

export type EventRecord = {
  id?: number;
  created_at: string;
  type: "track_search";
  query: string;
  found: boolean;
  reason: string | null;
};

type LocalData = { quotes: QuoteRecord[]; events: EventRecord[] };

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const useSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const storeBackend = useSupabase ? "supabase" : "local";

/* ---------------- Supabase (REST) ---------------- */

async function sb<T>(table: string, init: RequestInit & { query?: string } = {}): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${init.query ?? ""}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

/* ---------------- Local JSON file ---------------- */

const FILE = path.join(process.cwd(), ".data", "store.json");
const g = globalThis as unknown as { __mkyStore?: LocalData };

async function readLocal(): Promise<LocalData> {
  if (g.__mkyStore) return g.__mkyStore;
  try {
    g.__mkyStore = JSON.parse(await fs.readFile(FILE, "utf8")) as LocalData;
  } catch {
    g.__mkyStore = { quotes: [], events: [] };
  }
  return g.__mkyStore;
}

async function writeLocal(data: LocalData) {
  g.__mkyStore = data;
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(data, null, 2));
  } catch {
    // Read-only filesystem (e.g. serverless): keep in memory only
  }
}

/* ---------------- Public API ---------------- */

export async function saveQuote(q: Omit<QuoteRecord, "id">) {
  if (useSupabase) {
    await sb("quotes", { method: "POST", body: JSON.stringify(q) });
    return;
  }
  const data = await readLocal();
  data.quotes.unshift({ ...q, id: (data.quotes[0]?.id ?? 0) + 1 });
  await writeLocal(data);
}

export async function logEvent(e: Omit<EventRecord, "id">) {
  try {
    if (useSupabase) {
      await sb("events", { method: "POST", body: JSON.stringify(e), headers: { Prefer: "return=minimal" } }).catch(() => null);
      return;
    }
    const data = await readLocal();
    data.events.unshift({ ...e, id: (data.events[0]?.id ?? 0) + 1 });
    data.events = data.events.slice(0, 5000);
    await writeLocal(data);
  } catch {
    // Analytics must never break the user-facing request
  }
}

export async function listQuotes(limit = 500): Promise<QuoteRecord[]> {
  if (useSupabase) return sb<QuoteRecord[]>("quotes", { query: `?select=*&order=created_at.desc&limit=${limit}` });
  return (await readLocal()).quotes.slice(0, limit);
}

export async function listEvents(limit = 2000): Promise<EventRecord[]> {
  if (useSupabase) return sb<EventRecord[]>("events", { query: `?select=*&order=created_at.desc&limit=${limit}` });
  return (await readLocal()).events.slice(0, limit);
}

/** Number of records created in the last `days` days */
export function countSince(rows: { created_at: string }[], days: number) {
  const cutoff = Date.now() - days * 864e5;
  return rows.filter((r) => new Date(r.created_at).getTime() >= cutoff).length;
}
