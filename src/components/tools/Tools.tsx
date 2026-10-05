"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { CheckCircle2, Plus, Trash2, XCircle } from "lucide-react";
import { VOLUMETRIC_FACTOR, chargeable, containers, fmt, suggestContainer, type Mode, type Piece } from "@/lib/freight";
import { checkDigit, formatContainer, isContainerNumber } from "@/lib/container";
import { incoterms } from "@/content/site";

/* ---------------- Chargeable weight ---------------- */

const blank: Piece = { length: 120, width: 80, height: 100, quantity: 1, weight: 150 };

export function ChargeableWeightCalculator() {
  const [mode, setMode] = useState<Mode>("air");
  const [rows, setRows] = useState<Piece[]>([{ ...blank, quantity: 4 }]);
  const r = useMemo(() => chargeable(rows, mode), [rows, mode]);
  const update = (i: number, k: keyof Piece, v: number) =>
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, [k]: Math.max(0, v) } : row)));

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
        <div>
          <h3 className="text-lg font-semibold">Chargeable weight</h3>
          <p className="text-sm text-slate">Carriers bill the greater of actual and volumetric weight.</p>
        </div>
        <div role="tablist" aria-label="Mode" className="flex rounded-lg bg-mist p-1 text-sm">
          {(["air", "road", "sea"] as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={clsx("rounded-md px-3 py-1.5 capitalize transition", mode === m ? "bg-white font-medium shadow-sm" : "text-slate")}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-wider text-ink-400">
              {["Qty", "L cm", "W cm", "H cm", "Kg / pc", "m³", ""].map((h) => (
                <th key={h} className="px-3 py-2.5 font-normal first:pl-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-line">
                {(["quantity", "length", "width", "height", "weight"] as (keyof Piece)[]).map((k) => (
                  <td key={k} className="px-2 py-2 first:pl-4">
                    <input
                      aria-label={`${k} row ${i + 1}`}
                      type="number"
                      min={0}
                      inputMode="decimal"
                      className="field-input num px-2 py-1.5"
                      value={row[k]}
                      onChange={(e) => update(i, k, Number(e.target.value) || 0)}
                    />
                  </td>
                ))}
                <td className="num px-3 font-mono text-ink-700">{fmt((row.length * row.width * row.height * row.quantity) / 1e6, 3)}</td>
                <td className="pr-4">
                  <button
                    type="button"
                    aria-label={`Remove row ${i + 1}`}
                    disabled={rows.length === 1}
                    onClick={() => setRows((p) => p.filter((_, idx) => idx !== i))}
                    className="rounded p-1.5 text-ink-400 hover:bg-mist hover:text-danger-500 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line px-5 py-3">
        <button type="button" onClick={() => setRows((p) => [...p, { ...blank }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-signal-700 hover:text-signal-600">
          <Plus className="h-4 w-4" /> Add another size
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        <Stat k="Total volume" v={`${fmt(r.volume, 3)} m³`} />
        <Stat k="Actual weight" v={`${fmt(r.actual)} kg`} />
        <Stat k={`Volumetric (1 m³ = ${VOLUMETRIC_FACTOR[mode]} kg)`} v={`${fmt(r.volumetric)} kg`} />
        <Stat k={mode === "sea" ? "Revenue tonnes (W/M)" : "Chargeable weight"} v={mode === "sea" ? fmt(r.revenueTonnes ?? 0, 2) : `${fmt(r.chargeableKg)} kg`} strong />
      </dl>
      <p className="border-t border-line px-5 py-3 text-xs text-slate">
        {mode === "air" && "Air: IATA standard of 6,000 cm³ per kg. "}
        {mode === "road" && "Road: common European factor of 333 kg per m³; some routes use loading metres. "}
        {mode === "sea" && `LCL is charged per revenue tonne, the greater of tonnes and cubic metres. Suggested equipment: ${suggestContainer(r.volume, r.actual).name}. `}
        Indicative only. Your coordinator confirms the final figure on the quote.
      </p>
    </div>
  );
}

function Stat({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={clsx("min-w-0 p-4", strong ? "bg-ink-900 text-white" : "bg-white")}>
      <dt className={clsx("font-mono text-[10.5px] uppercase tracking-wider", strong ? "text-ink-300" : "text-ink-400")}>{k}</dt>
      <dd className={clsx("num mt-1 text-xl font-semibold", strong && "text-signal-400")}>{v}</dd>
    </div>
  );
}

/* ---------------- Container check ---------------- */

export function ContainerChecker() {
  const [value, setValue] = useState("MSKU1234565");
  const clean = value.replace(/\s+/g, "").toUpperCase();
  const shapeOk = /^[A-Z]{3}[UJZ][0-9]{7}$/.test(clean);
  const valid = isContainerNumber(clean);
  const expected = /^[A-Z]{4}[0-9]{6}/.test(clean) ? checkDigit(clean.slice(0, 10)) : null;

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-line">
      <h3 className="text-lg font-semibold">Container number check</h3>
      <p className="text-sm text-slate">Validates the ISO 6346 check digit to catch typos before you share or track a number.</p>
      <label htmlFor="ctr-input" className="mt-5 font-mono text-[11px] uppercase tracking-wider text-ink-400">
        Container number
      </label>
      <input id="ctr-input" className="field-input mt-1.5 font-mono uppercase tracking-wider" value={value} onChange={(e) => setValue(e.target.value)} maxLength={14} />
      <div className="mt-4 flex-1">
        {clean.length === 0 ? null : valid ? (
          <p className="flex items-center gap-2 text-sm font-medium text-ok-500">
            <CheckCircle2 className="h-4 w-4" /> {formatContainer(clean)} is a valid container number.
          </p>
        ) : (
          <p className="flex items-start gap-2 text-sm text-danger-500">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {!shapeOk
              ? "Use 4 letters (ending in U, J or Z) followed by 7 digits."
              : `Check digit should be ${expected}, not ${clean[10]}.`}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Container fit ---------------- */

export function ContainerGuide() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-line">
      <h3 className="text-lg font-semibold">Standard containers</h3>
      <p className="text-sm text-slate">Typical internal capacity of dry containers. Plan to fill about 85% of the volume.</p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-wider text-ink-400">
              <th className="py-2 font-normal">Type</th>
              <th className="py-2 font-normal">Code</th>
              <th className="py-2 text-right font-normal">m³</th>
              <th className="py-2 text-right font-normal">Max payload</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.code} className="border-t border-line">
                <td className="py-2.5">{c.name}</td>
                <td className="py-2.5 font-mono text-ink-700">{c.code}</td>
                <td className="num py-2.5 text-right">{fmt(c.cbm, 1)}</td>
                <td className="num py-2.5 text-right">{fmt(c.payloadKg)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-auto pt-4 text-xs text-slate">Figures vary by carrier and container age.</p>
    </div>
  );
}

/* ---------------- Incoterms explorer ---------------- */

const STAGES = ["Export clearance", "Main carriage", "Insurance", "Import clearance"];

export function IncotermsExplorer() {
  const [code, setCode] = useState("FCA");
  const term = incoterms.find((t) => t.code === code)!;
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <div className="border-b border-line p-5">
        <h3 className="text-lg font-semibold">Incoterms® 2020: who arranges what?</h3>
        <p className="text-sm text-slate">Pick the term on your sales contract.</p>
        <div role="tablist" aria-label="Incoterm" className="mt-4 flex flex-wrap gap-1.5">
          {incoterms.map((t) => (
            <button
              key={t.code}
              role="tab"
              type="button"
              aria-selected={t.code === code}
              onClick={() => setCode(t.code)}
              className={clsx(
                "rounded-md px-3 py-1.5 font-mono text-sm transition",
                t.code === code ? "bg-ink-900 text-white" : "bg-mist text-ink-700 hover:bg-line",
              )}
            >
              {t.code}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3">
          <p className="text-2xl font-semibold">
            {term.code} <span className="text-slate">· {term.name}</span>
          </p>
          <p className="text-[15px] text-slate">
            {term.modes === "sea" ? "Sea and inland waterway only." : "Any mode of transport."} Main carriage paid by the{" "}
            <strong className="text-ink-900">{term.carriagePaidBy.toLowerCase()}</strong>.
          </p>
          <p className="text-[15px]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-400">Risk passes</span>
            <br />
            {term.riskTransfers}.
          </p>
        </div>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STAGES.map((s, i) => {
            const who = term.stages[i];
            return (
              <li
                key={s}
                className={clsx(
                  "rounded-xl p-3 ring-1",
                  who === "Seller" && "bg-signal-500/10 ring-signal-500/30",
                  who === "Buyer" && "bg-sky-400/10 ring-sky-400/30",
                  who === "Either" && "bg-mist ring-line",
                )}
              >
                <span className="num font-mono text-[10.5px] text-ink-400">0{i + 1}</span>
                <p className="mt-1 text-sm font-medium">{s}</p>
                <p className={clsx("mt-3 text-xs font-semibold uppercase tracking-wider", who === "Seller" ? "text-signal-700" : who === "Buyer" ? "text-sky-500" : "text-slate")}>
                  {who === "Either" ? "Not required" : who}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="border-t border-line px-5 py-3 text-xs text-slate">
        Insurance is only an obligation under CIF and CIP; for other terms it is optional for either party. Incoterms® is a trademark of the International Chamber of Commerce.
      </p>
    </div>
  );
}
