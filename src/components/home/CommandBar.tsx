"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, Car, Search } from "lucide-react";
import { destinationPorts, originPorts } from "@/content/site";
import { vehicleTypes } from "@/lib/schemas";
import { vehicleLabel } from "@/lib/quoteMessage";
import { normaliseVin, vinProblem } from "@/lib/vin";

const portName = (p: { city: string; country: string }) => `${p.city}, ${p.country}`;

/** Hero command bar: track a vehicle by VIN, or start a vehicle quote */
export function CommandBar() {
  const router = useRouter();
  const [tab, setTab] = useState<"track" | "quote">("track");
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState<string | null>(null);
  const [from, setFrom] = useState(portName(originPorts[0]));
  const [to, setTo] = useState(portName(destinationPorts[0]));
  const [type, setType] = useState<string>("car");
  const [count, setCount] = useState(1);

  return (
    <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
      <div role="tablist" aria-label="Quick actions" className="flex border-b border-white/10">
        {[
          { id: "track" as const, label: "Track by VIN", Icon: Search },
          { id: "quote" as const, label: "Ship a vehicle", Icon: Car },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={clsx(
              "flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition",
              tab === id ? "border-signal-500 text-white" : "border-transparent text-ink-400 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
        <span className="ml-auto hidden items-center px-5 font-mono text-[11px] uppercase tracking-wider text-ink-400 md:flex">
          {tab === "track" ? "17-character VIN / chassis no." : "Europe → Middle East & North Africa"}
        </span>
      </div>

      {tab === "track" ? (
        <form
          className="space-y-2 p-4 sm:p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const v = vin.trim();
            if (!v) return;
            const looksLikeVin = !v.toUpperCase().startsWith("MKY");
            const problem = looksLikeVin ? vinProblem(v) : null;
            if (problem) {
              setVinError(problem);
              return;
            }
            router.push(`/track?ref=${encodeURIComponent(looksLikeVin ? normaliseVin(v) : v)}`);
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="cb-vin" className="sr-only">VIN or chassis number</label>
            <input
              id="cb-vin"
              value={vin}
              onChange={(e) => {
                setVin(e.target.value);
                setVinError(null);
              }}
              placeholder="e.g. VF7DEMXXX00000001"
              maxLength={24}
              className="field-input-dark h-12 flex-1 font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
              autoComplete="off"
            />
            <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-signal-500 px-6 font-medium text-white hover:bg-signal-600">
              Track <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className={clsx("text-sm", vinError ? "text-signal-400" : "text-ink-400")}>
            {vinError ?? "Find the VIN on the registration document or at the base of the windscreen."}
          </p>
        </form>
      ) : (
        <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-[1fr_1fr_1fr_100px_auto] lg:items-end">
          <datalist id="cb-origins">{originPorts.map((p) => <option key={p.code} value={portName(p)} />)}</datalist>
          <datalist id="cb-dests">{destinationPorts.map((p) => <option key={p.code} value={portName(p)} />)}</datalist>
          <F id="cb-from" label="From port">
            <input id="cb-from" list="cb-origins" className="field-input-dark" value={from} onChange={(e) => setFrom(e.target.value)} />
          </F>
          <F id="cb-to" label="To port">
            <input id="cb-to" list="cb-dests" className="field-input-dark" value={to} onChange={(e) => setTo(e.target.value)} />
          </F>
          <F id="cb-type" label="Vehicle">
            <select id="cb-type" className="field-input-dark" value={type} onChange={(e) => setType(e.target.value)}>
              {vehicleTypes.map((t) => <option key={t} value={t}>{vehicleLabel[t]}</option>)}
            </select>
          </F>
          <F id="cb-count" label="How many">
            <input id="cb-count" type="number" min={1} inputMode="numeric" className="field-input-dark num" value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))} />
          </F>
          <button
            type="button"
            onClick={() => router.push(`/quote?${new URLSearchParams({ mode: "vehicle", from, to, type, count: String(count) })}`)}
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-lg bg-signal-500 px-5 font-medium text-white hover:bg-signal-600"
          >
            Get a quote <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function F({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={id} className="font-mono text-[10.5px] uppercase tracking-wider text-ink-400">{label}</label>
      {children}
    </div>
  );
}
