"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const TOPICS = [
  ["shipment", "An existing shipment"],
  ["new-business", "New business enquiry"],
  ["customs", "Customs question"],
  ["partnership", "Partnership"],
  ["other", "Something else"],
] as const;

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!json.ok) {
        setErrors(json.errors ?? {});
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="space-y-3 rounded-2xl bg-white p-8 ring-1 ring-line">
        <CheckCircle2 className="h-8 w-8 text-ok-500" />
        <h2 className="text-2xl font-semibold">Message sent</h2>
        <p className="text-slate">Thanks. The team will reply by email.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-line sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Name" error={errors.name}>
          <input id="c-name" name="name" className="field-input" autoComplete="name" />
        </Field>
        <Field id="c-email" label="Email" error={errors.email}>
          <input id="c-email" name="email" type="email" className="field-input" autoComplete="email" />
        </Field>
      </div>
      <Field id="c-topic" label="What's it about?">
        <select id="c-topic" name="topic" className="field-input" defaultValue="new-business">
          {TOPICS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </Field>
      <Field id="c-message" label="Message" error={errors.message}>
        <textarea id="c-message" name="message" rows={5} className="field-input" />
      </Field>
      {status === "error" && <p className="text-sm text-danger-500">We couldn&apos;t send your message. Try again, or email us directly.</p>}
      <button type="submit" disabled={status === "sending"} className="inline-flex h-11 items-center gap-2 rounded-lg bg-signal-500 px-5 font-medium text-white hover:bg-signal-600 disabled:opacity-70">
        {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  );
}
