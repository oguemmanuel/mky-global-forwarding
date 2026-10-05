import "server-only";

/**
 * Sends form submissions to the MKY team.
 * Uses Resend's HTTP API when RESEND_API_KEY is set; otherwise logs to the server console
 * so the site works in development and preview without any secrets.
 */
export async function notifyTeam(subject: string, lines: Record<string, unknown>) {
  const body = Object.entries(lines)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");

  const key = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_INBOX ?? "ship@mkyglobalforwarding.com";
  const from = process.env.MAIL_FROM ?? "MKY Website <website@mkyglobalforwarding.com>";

  if (!key) {
    console.info(`[notify] ${subject}\n${body}`);
    return { delivered: false as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text: body }),
  });
  if (!res.ok) {
    console.error("[notify] Resend error", res.status, await res.text());
    return { delivered: false as const };
  }
  return { delivered: true as const };
}

export function makeReference(prefix: string) {
  const d = new Date();
  const ymd = `${d.getUTCFullYear().toString().slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ymd}-${rand}`;
}
