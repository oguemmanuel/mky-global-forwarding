import type { Metadata } from "next";
import { Download, Lock, LogOut, MessageCircle, Search } from "lucide-react";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { countSince, listEvents, listQuotes, storeBackend, type QuoteRecord } from "@/lib/store";
import { docLabel, modeLabel, vehicleLabel } from "@/lib/quoteMessage";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!(await isAdmin())) return <Login configured={adminConfigured()} error={Boolean(error)} />;

  const [quotes, events] = await Promise.all([listQuotes(), listEvents()]);
  const week = countSince(quotes, 7);
  const viaWa = quotes.filter((q) => q.channel === "whatsapp").length;
  const searches = events.filter((e) => e.type === "track_search");
  const found = searches.filter((e) => e.found).length;

  const countBy = (key: (q: QuoteRecord) => string | null) => {
    const m = new Map<string, number>();
    for (const q of quotes) {
      const k = key(q);
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  };

  return (
    <section className="bg-paper py-10">
      <div className="container-x space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Admin · Phase 1</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Website data</h1>
            <p className="mt-1 text-sm text-slate">
              Quote requests and tracking searches from the website. Storage: <span className="font-mono">{storeBackend}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/api/admin/export?type=quotes" className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium ring-1 ring-line hover:ring-ink-300">
              <Download className="h-4 w-4" /> Quotes CSV
            </a>
            <a href="/api/admin/export?type=events" className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium ring-1 ring-line hover:ring-ink-300">
              <Download className="h-4 w-4" /> Searches CSV
            </a>
            <form action="/api/admin/logout" method="post">
              <button className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium text-slate hover:text-ink-900">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </form>
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line lg:grid-cols-5">
          <Kpi k="Quote requests" v={quotes.length} />
          <Kpi k="Last 7 days" v={week} />
          <Kpi k="Sent via WhatsApp" v={quotes.length ? `${Math.round((viaWa / quotes.length) * 100)}%` : "–"} />
          <Kpi k="Tracking searches" v={searches.length} />
          <Kpi k="Searches found" v={searches.length ? `${Math.round((found / searches.length) * 100)}%` : "–"} />
        </dl>

        <div className="grid gap-4 lg:grid-cols-3">
          <Breakdown title="By service" rows={countBy((q) => modeLabel[q.mode as keyof typeof modeLabel] ?? q.mode)} total={quotes.length} />
          <Breakdown title="Top destinations" rows={countBy((q) => q.destination)} total={quotes.length} />
          <Breakdown title="Vehicle types" rows={countBy((q) => (q.vehicle_type ? vehicleLabel[q.vehicle_type] ?? q.vehicle_type : null))} total={quotes.length} />
        </div>

        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">Quote requests</h2>
            <span className="text-sm text-slate num">{quotes.length} total</span>
          </div>
          {quotes.length === 0 ? (
            <Empty text="No quote requests yet. Submit one from the Quote page to see it here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-sm">
                <thead className="bg-mist/60 text-left font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  <tr>
                    {["Date", "Reference", "Service", "Route", "Details", "Documents", "Contact", "Via"].map((h) => (
                      <th key={h} className="px-4 py-2.5 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quotes.slice(0, 100).map((q) => (
                    <tr key={q.reference} className="border-t border-line align-top">
                      <td className="num whitespace-nowrap px-4 py-3 text-slate">{new Date(q.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px]">{q.reference}</td>
                      <td className="px-4 py-3">{modeLabel[q.mode as keyof typeof modeLabel] ?? q.mode}</td>
                      <td className="px-4 py-3">{q.origin} → {q.destination}{q.collection && <span className="block text-xs text-slate">Collection needed</span>}</td>
                      <td className="px-4 py-3">
                        {q.vehicle_type
                          ? `${q.vehicle_count ?? "?"} × ${vehicleLabel[q.vehicle_type] ?? q.vehicle_type}${q.make_model ? `, ${q.make_model}` : ""}${q.running === false ? " (non-running)" : ""}`
                          : q.goods
                            ? `${q.goods}: ${q.pieces ?? "?"} pcs, ${q.weight_kg ?? "?"} kg`
                            : "–"}
                        {q.vins && <span className="block break-all font-mono text-xs text-slate">{q.vins}</span>}
                      </td>
                      <td className="px-4 py-3 text-slate">{q.documents?.length ? q.documents.map((d) => docLabel[d] ?? d).join(", ") : "–"}</td>
                      <td className="px-4 py-3">
                        {q.name}{q.company && <span className="text-slate">, {q.company}</span>}
                        <span className="block text-xs text-slate">{q.email}{q.phone && ` · ${q.phone}`}</span>
                      </td>
                      <td className="px-4 py-3">
                        {q.channel === "whatsapp" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#1fa855]/10 px-2 py-0.5 text-xs font-medium text-[#137a3d]"><MessageCircle className="h-3 w-3" /> WhatsApp</span>
                        ) : (
                          <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-medium text-ink-700">Form</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">Tracking searches</h2>
            <span className="text-sm text-slate num">{searches.length} total</span>
          </div>
          {searches.length === 0 ? (
            <Empty text="No searches yet. Try a VIN on the Track page." />
          ) : (
            <ul className="divide-y divide-line">
              {searches.slice(0, 25).map((e, i) => (
                <li key={e.id ?? i} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2.5 text-sm">
                  <Search className="h-3.5 w-3.5 text-ink-400" />
                  <span className="font-mono">{e.query}</span>
                  <span className={e.found ? "text-ok-500" : "text-warn-500"}>{e.found ? "Found" : e.reason === "invalid_vin" ? "Invalid VIN" : "Not found"}</span>
                  <span className="num ml-auto text-slate">{new Date(e.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Kpi({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="bg-white p-5">
      <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-400">{k}</dt>
      <dd className="num mt-2 text-3xl font-semibold tracking-tight">{v}</dd>
    </div>
  );
}

function Breakdown({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-line">
      <h2 className="font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map(([label, n]) => (
            <li key={label}>
              <div className="flex justify-between text-sm">
                <span className="truncate pr-2">{label}</span>
                <span className="num text-slate">{n}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-mist">
                <div className="h-1.5 rounded-full bg-sky-500" style={{ width: `${total ? (n / total) * 100 : 0}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="px-5 py-10 text-center text-sm text-slate">{text}</p>;
}

function Login({ configured, error }: { configured: boolean; error: boolean }) {
  return (
    <section className="flex min-h-[70vh] items-center bg-paper py-16">
      <div className="container-x max-w-md">
        <form action="/api/admin/login" method="post" className="space-y-5 rounded-2xl bg-white p-8 ring-1 ring-line">
          <Lock className="h-6 w-6 text-signal-500" />
          <div>
            <h1 className="text-2xl font-semibold">MKY admin</h1>
            <p className="mt-1 text-sm text-slate">Quote requests and website data. Staff only.</p>
          </div>
          {!configured ? (
            <p className="rounded-lg bg-warn-500/10 p-3 text-sm text-ink-900">
              Admin is switched off. Set <span className="font-mono">ADMIN_PASSWORD</span> in the environment (see .env.example) and restart.
            </p>
          ) : (
            <>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input id="password" name="password" type="password" required autoComplete="current-password" className="field-input" />
                {error && <p className="text-sm text-danger-500">That password isn&apos;t right. Try again.</p>}
              </div>
              <button className="h-11 w-full rounded-lg bg-ink-900 font-medium text-white hover:bg-ink-700">Log in</button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
