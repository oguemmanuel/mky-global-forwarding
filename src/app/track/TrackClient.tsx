"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import type { LookupResult } from "@/lib/tracking";
import { ShipmentView } from "@/components/shipment/ShipmentView";

export function TrackClient({ demoRefs }: { demoRefs: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("ref") ?? "";
  const [ref, setRef] = useState(initial);
  const [state, setState] = useState<{ loading: boolean; result: LookupResult | null; error?: string }>({ loading: Boolean(initial), result: null });

  const fetchResult = async (v: string) => {
    const res = await fetch(`/api/track?ref=${encodeURIComponent(v)}`);
    return (await res.json()) as LookupResult;
  };
  const failed = { loading: false, result: null, error: "We couldn't reach the tracking service. Check your connection and try again." };

  async function lookup(value: string) {
    const v = value.trim();
    if (!v) return;
    setState({ loading: true, result: null });
    router.replace(`/track?ref=${encodeURIComponent(v)}`, { scroll: false });
    try {
      setState({ loading: false, result: await fetchResult(v) });
    } catch {
      setState(failed);
    }
  }

  // Shared links (/track?ref=...) look up once on load
  useEffect(() => {
    if (!initial) return;
    fetchResult(initial)
      .then((result) => setState({ loading: false, result }))
      .catch(() => setState(failed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(ref);
        }}
        className="flex flex-col gap-3 rounded-2xl bg-white p-3 ring-1 ring-line sm:flex-row"
      >
        <label htmlFor="track-ref" className="sr-only">
          VIN / chassis number or MKY reference
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            id="track-ref"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="VIN / chassis number, e.g. VF7DEMXXX00000001"
            className="h-12 w-full rounded-lg bg-transparent pl-10 pr-3 font-mono text-[15px] uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-400 focus:outline-none"
            autoComplete="off"
          />
        </div>
        <button type="submit" disabled={state.loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-signal-500 px-6 font-medium text-white hover:bg-signal-600 disabled:opacity-70">
          {state.loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Track
        </button>
      </form>

      <p className="text-sm text-slate">
        Demo VINs:{" "}
        {demoRefs.map((d, i) => (
          <span key={d}>
            {i > 0 && ", "}
            <button type="button" onClick={() => { setRef(d); lookup(d); }} className="font-mono text-signal-700 underline-offset-2 hover:underline">
              {d}
            </button>
          </span>
        ))}
      </p>

      <div aria-live="polite">
        {state.error && <p className="rounded-xl bg-danger-500/10 p-4 text-sm text-danger-500">{state.error}</p>}
        {state.result && !state.result.ok && <p className="rounded-xl bg-white p-4 text-[15px] text-slate ring-1 ring-line">{state.result.message}</p>}
        {state.result && state.result.ok && <ShipmentView shipment={state.result.shipment} />}
      </div>
    </div>
  );
}
