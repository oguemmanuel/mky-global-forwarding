import { isAdmin } from "@/lib/adminAuth";
import { listEvents, listQuotes } from "@/lib/store";

const csvCell = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = Array.isArray(v) ? v.join("|") : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  return [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
}

/** CSV export for reporting in Excel, Google Sheets or Power BI */
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorised", { status: 401 });
  const type = new URL(request.url).searchParams.get("type") === "events" ? "events" : "quotes";
  const rows = type === "events" ? await listEvents(10000) : await listQuotes(10000);
  const date = new Date().toISOString().slice(0, 10);
  return new Response(toCsv(rows as unknown as Record<string, unknown>[]), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mky-${type}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
