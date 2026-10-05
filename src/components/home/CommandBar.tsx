"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, Calculator, Plane, Search, Ship, Truck } from "lucide-react";
import { chargeable, fmt, suggestContainer, type Mode } from "@/lib/freight";

const MODES: { id: Mode; label: string; Icon: typeof Plane }[] = [
  { id: "air", label: "Air", Icon: Plane },
  { id: "sea", label: "Sea", Icon: Ship },
  { id: "road", label: "Road", Icon: Truck },
];

/** Hero command bar: track a shipment or price one, without leaving the homepage */
export function CommandBar() {
  const router = useRouter();
  const [tab, setTab] = useState<"quote" | "track">("quote");
  const [ref, setRef] = useState("");
  const [mode, setMode] = useState<Mode>("air");
  const [from, setFrom] = useState("Kraków, PL");
  const [to, setTo] = useState("");
  const [pieces, setPieces] = useState(4);
  const [kg, setKg] = useState(120);
  const [dims, setDims] = useState({ l: 120, w: 80, h: 100 });

  const calc = useMemo(
    () => chargeable([{ length: dims.l, width: dims.w, height: dims.h, quantity: pieces, weight: kg }], mode),
    [dims, pieces, kg, mode],
  );

  function goQuote() {
    const p = new URLSearchParams({ mode, from, to, pieces: String(pieces), weight: String(kg * pieces), l: String(dims.l), w: String(dims.w), h: String(dims.h) });
    router.push(`/quote?${p.toString()}`);
  }

  return (
    <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
      <div role="tablist" aria-label="Quick actions" className="flex border-b border-white/10">
        {[
          { id: "quote" as const, label: "Quick estimate", Icon: Calculator },
          { id: "track" as const, label: "Track shipment", Icon: Search },
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
          {tab === "quote" ? "dims per piece · cm / kg" : "ref · AWB · B/L · container"}
        </span>
      </div>

      {tab === "track" ? (
        <form
          className="flex flex-col gap-3 p-4 sm:flex-row sm:p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (ref.trim()) router.push(`/track?ref=${encodeURIComponent(ref.trim())}`);
          }}
        >
          <label htmlFor="cb-ref" className="sr-only">Tracking reference</label>
          <input id="cb-ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. MKY-DEMO-001" className="field-input-dark h-12 flex-1 font-mono uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal" autoComplete="off" />
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-signal-500 px-6 font-medium text-white hover:bg-signal-600">
            Track <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[auto_1fr_1fr_auto] xl:items-end">
          <div role="radiogroup" aria-label="Transport mode" className="grid grid-cols-3 gap-1 rounded-lg bg-ink-950/70 p-1 xl:w-[228px]">
            {MODES.map(({ id, label, Icon }) => (
              <button
                key={id}
                role="radio"
                aria-checked={mode === id}
                type="button"
                onClick={() => setMode(id)}
                className={clsx("flex h-10 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition", mode === id ? "bg-signal-500 text-white" : "text-ink-300 hover:text-white")}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-3">
            <F id="cb-from" label="From"><input id="cb-from" className="field-input-dark" value={from} onChange={(e) => setFrom(e.target.value)} /></F>
            <F id="cb-to" label="To"><input id="cb-to" className="field-input-dark" placeholder="City or port" value={to} onChange={(e) => setTo(e.target.value)} /></F>
          </div>
          <div className="grid min-w-0 grid-cols-5 gap-2">
            <N id="cb-pcs" label="Pcs" v={pieces} set={setPieces} />
            <N id="cb-kg" label="Kg/pc" v={kg} set={setKg} />
            <N id="cb-l" label="L" v={dims.l} set={(v) => setDims((d) => ({ ...d, l: v }))} />
            <N id="cb-w" label="W" v={dims.w} set={(v) => setDims((d) => ({ ...d, w: v }))} />
            <N id="cb-h" label="H" v={dims.h} set={(v) => setDims((d) => ({ ...d, h: v }))} />
          </div>
          <button type="button" onClick={goQuote} className="inline-flex h-[46px] items-center justify-center gap-2 rounded-lg bg-signal-500 px-5 font-medium text-white hover:bg-signal-600">
            Get exact rate <ArrowRight className="h-4 w-4" />
          </button>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-white/10 pt-3 text-sm text-ink-300 xl:col-span-4">
            <span>Volume <b className="num ml-1 font-semibold text-white">{fmt(calc.volume, 2)} m³</b></span>
            <span>Actual <b className="num ml-1 font-semibold text-white">{fmt(calc.actual)} kg</b></span>
            {mode === "sea" ? (
              <>
                <span>Revenue tonnes <b className="num ml-1 font-semibold text-signal-400">{fmt(calc.revenueTonnes ?? 0, 2)}</b></span>
                <span>Suggested <b className="ml-1 font-semibold text-white">{suggestContainer(calc.volume, calc.actual).name}</b></span>
              </>
            ) : (
              <span>Chargeable <b className="num ml-1 font-semibold text-signal-400">{fmt(calc.chargeableKg)} kg</b> <span className="text-ink-400">({calc.basis === "volume" ? "volume" : "weight"} based)</span></span>
            )}
            <span className="ml-auto text-xs text-ink-400">Indicative, standard industry factors</span>
          </div>
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

function N({ id, label, v, set }: { id: string; label: string; v: number; set: (n: number) => void }) {
  return (
    <F id={id} label={label}>
      <input id={id} type="number" min={0} inputMode="decimal" className="field-input-dark num px-2" value={v} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))} />
    </F>
  );
}
