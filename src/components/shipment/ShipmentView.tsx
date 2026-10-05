"use client";

import clsx from "clsx";
import { Plane, Ship, Truck } from "lucide-react";
import type { Shipment } from "@/lib/tracking";
import { formatContainer } from "@/lib/container";
import { StatusDot } from "@/components/ui";

const ModeIcon = { air: Plane, sea: Ship, road: Truck } as const;

const dateFrom = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export function ShipmentView({ shipment, variant = "full" }: { shipment: Shipment; variant?: "full" | "compact" }) {
  const Icon = ModeIcon[shipment.mode];
  const compact = variant === "compact";
  const milestones = compact
    ? shipment.milestones.filter((m) => m.status !== "upcoming").slice(-2).concat(shipment.milestones.filter((m) => m.status === "upcoming").slice(0, 1))
    : shipment.milestones;

  return (
    <div className={clsx("overflow-hidden rounded-2xl bg-white ring-1 ring-line", !compact && "shadow-sm")}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-5 py-4">
        <span className="font-mono text-sm font-medium text-ink-900">{shipment.reference}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/10 px-2.5 py-1 text-xs font-medium text-sky-500">
          <StatusDot tone="sky" /> {shipment.status}
        </span>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-ink-400">Example shipment</span>
      </div>

      {/* Route */}
      <div className="px-5 pb-5 pt-6">
        <div className="flex items-end justify-between gap-4">
          <Port code={shipment.origin.code} city={shipment.origin.city} />
          <Port code={shipment.destination.code} city={shipment.destination.city} align="right" />
        </div>
        <div className="relative mt-4 h-8" aria-label={`${Math.round(shipment.progress * 100)}% of route completed`}>
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-ink-300" />
          <div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-signal-500" style={{ width: `${shipment.progress * 100}%` }} />
          <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-ink-900" />
          <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-ink-300 bg-white" />
          <span
            className="absolute top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink-900 text-white ring-4 ring-white"
            style={{ left: `${shipment.progress * 100}%` }}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line ring-1 ring-line sm:grid-cols-3">
          <Meta k="ETA" v={`${dateFrom(shipment.etaOffset)} · ${shipment.etaOffset}d`} />
          <Meta k="Equipment" v={shipment.equipment} />
          {shipment.containerNo ? (
            <Meta k="Container (ISO 6346)" v={formatContainer(shipment.containerNo)} mono className="col-span-2 sm:col-span-1" />
          ) : (
            <Meta k="Mode" v={shipment.mode.toUpperCase()} mono className="col-span-2 sm:col-span-1" />
          )}
        </dl>
      </div>

      {/* Milestones */}
      <ol className="border-t border-line px-5 py-5">
        {milestones.map((m, i) => (
          <li key={m.code} className="relative grid grid-cols-[20px_1fr_auto] gap-3 pb-4 last:pb-0">
            {i < milestones.length - 1 && <span className="absolute left-[9px] top-5 bottom-0 w-px bg-line" />}
            <span
              className={clsx(
                "relative z-10 mt-0.5 h-[18px] w-[18px] rounded-full border-2",
                m.status === "done" && "border-ink-900 bg-ink-900",
                m.status === "current" && "border-signal-500 bg-signal-500 ring-4 ring-signal-500/20",
                m.status === "upcoming" && "border-ink-300 bg-white",
              )}
            />
            <div className="min-w-0">
              <p className={clsx("text-[15px] font-medium", m.status === "upcoming" ? "text-slate" : "text-ink-900")}>{m.title}</p>
              <p className="text-sm text-slate">{m.location}</p>
            </div>
            <time className="num pt-0.5 font-mono text-xs text-ink-400">
              {m.status === "upcoming" ? "Est. " : ""}
              {dateFrom(m.dayOffset)}
            </time>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Port({ code, city, align }: { code: string; city: string; align?: "right" }) {
  return (
    <div className={clsx("min-w-0", align === "right" && "text-right")}>
      <div className="text-3xl font-semibold tracking-tight text-ink-900">{code}</div>
      <div className="truncate text-sm text-slate">{city}</div>
    </div>
  );
}

function Meta({ k, v, mono, className }: { k: string; v: string; mono?: boolean; className?: string }) {
  return (
    <div className={clsx("min-w-0 bg-white px-3 py-2.5", className)}>
      <dt className="font-mono text-[10.5px] uppercase tracking-wider text-ink-400">{k}</dt>
      <dd className={clsx("mt-0.5 truncate text-sm font-medium text-ink-900", mono && "font-mono")}>{v}</dd>
    </div>
  );
}
