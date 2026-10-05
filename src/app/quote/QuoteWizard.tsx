"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, Plane, Ship, Truck } from "lucide-react";
import { fieldErrors, quoteSchema } from "@/lib/schemas";
import { chargeable, fmt, suggestContainer, type Mode } from "@/lib/freight";
import { incoterms } from "@/content/site";

type Form = {
  mode: Mode;
  incoterm: string;
  customs: "yes" | "no" | "unsure";
  origin: string;
  destination: string;
  readyDate: string;
  serviceLevel: "door-door" | "door-port" | "port-door" | "port-port";
  goods: string;
  hsCode: string;
  equipment: string;
  pieces: string;
  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  dangerous: boolean;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  website: string;
};

const STEPS = [
  { title: "Mode", fields: ["mode", "incoterm", "customs"] },
  { title: "Route", fields: ["origin", "destination", "readyDate", "serviceLevel"] },
  { title: "Cargo", fields: ["goods", "hsCode", "equipment", "pieces", "weightKg", "lengthCm", "widthCm", "heightCm", "dangerous"] },
  { title: "Contact", fields: ["name", "company", "email", "phone", "notes"] },
] as const;

const MODES = [
  { id: "air" as const, label: "Air", Icon: Plane, hint: "Fastest. For urgent or high-value goods." },
  { id: "sea" as const, label: "Ocean", Icon: Ship, hint: "Lowest cost per kilo for volume." },
  { id: "road" as const, label: "Road", Icon: Truck, hint: "Poland and EU, full truck or pallets." },
];

export function QuoteWizard() {
  const sp = useSearchParams();
  const initialMode = (["air", "sea", "road"].includes(sp.get("mode") ?? "") ? sp.get("mode") : "air") as Mode;

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const [f, setF] = useState<Form>({
    mode: initialMode,
    incoterm: "",
    customs: "yes",
    origin: sp.get("from") ?? "Kraków, Poland",
    destination: sp.get("to") ?? "",
    readyDate: "",
    serviceLevel: "door-door",
    goods: "",
    hsCode: "",
    equipment: "",
    pieces: sp.get("pieces") ?? "",
    weightKg: sp.get("weight") ?? "",
    lengthCm: sp.get("l") ?? "",
    widthCm: sp.get("w") ?? "",
    heightCm: sp.get("h") ?? "",
    dangerous: false,
    name: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
    website: "",
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setErrors((e) => {
      const rest = { ...e };
      delete rest[k as string];
      return rest;
    });
  };

  const payload = useMemo(
    () => ({
      ...f,
      pieces: f.pieces === "" ? undefined : Number(f.pieces),
      weightKg: f.weightKg === "" ? undefined : Number(f.weightKg),
      lengthCm: f.lengthCm === "" ? undefined : Number(f.lengthCm),
      widthCm: f.widthCm === "" ? undefined : Number(f.widthCm),
      heightCm: f.heightCm === "" ? undefined : Number(f.heightCm),
    }),
    [f],
  );

  const estimate = useMemo(() => {
    const p = Number(f.pieces), w = Number(f.weightKg), l = Number(f.lengthCm), wi = Number(f.widthCm), h = Number(f.heightCm);
    if (!(p > 0 && w > 0 && l > 0 && wi > 0 && h > 0)) return null;
    return chargeable([{ length: l, width: wi, height: h, quantity: p, weight: w / p }], f.mode);
  }, [f]);

  function validateStep(i: number) {
    const result = quoteSchema.safeParse(payload);
    if (result.success) return true;
    const errs = fieldErrors(result.error);
    const stepErrs = Object.fromEntries(Object.entries(errs).filter(([k]) => (STEPS[i].fields as readonly string[]).includes(k)));
    setErrors(stepErrs);
    return Object.keys(stepErrs).length === 0;
  }

  async function submit() {
    if (!validateStep(3)) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!json.ok) {
        setErrors(json.errors ?? {});
        const firstBad = STEPS.findIndex((s) => (s.fields as readonly string[]).some((fld) => json.errors?.[fld]));
        if (firstBad >= 0) setStep(firstBad);
        setStatus("idle");
        return;
      }
      setReference(json.reference);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="space-y-5 rounded-2xl bg-white p-8 ring-1 ring-line">
        <CheckCircle2 className="h-10 w-10 text-ok-500" />
        <h2 className="text-3xl font-semibold tracking-tight">Request received</h2>
        <p className="text-lg text-slate">
          Your reference is <span className="font-mono font-medium text-ink-900">{reference}</span>. A coordinator will email your quote to{" "}
          <span className="font-medium text-ink-900">{f.email}</span>.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/" className="inline-flex h-11 items-center rounded-lg px-5 font-medium ring-1 ring-line hover:bg-mist">Back to home</Link>
          <Link href="/tools" className="inline-flex h-11 items-center rounded-lg px-5 font-medium text-signal-700 hover:bg-mist">Freight tools</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
      <ol className="grid grid-cols-4 border-b border-line">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            aria-current={i === step ? "step" : undefined}
            className={clsx(
              "border-b-2 px-3 py-3.5 font-mono text-[11px] uppercase tracking-wider sm:px-5",
              i === step ? "border-signal-500 text-ink-900" : i < step ? "border-ink-900 text-ink-700" : "border-transparent text-ink-400",
            )}
          >
            <span className="num mr-1.5">0{i + 1}</span>
            <span className="hidden sm:inline">{s.title}</span>
          </li>
        ))}
      </ol>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) {
            if (validateStep(step)) setStep(step + 1);
          } else submit();
        }}
        className="space-y-6 p-5 sm:p-8"
      >
        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" value={f.website} onChange={(e) => set("website", e.target.value)} />

        {step === 0 && (
          <>
            <StepTitle>How should it travel?</StepTitle>
            <div className="grid gap-3 sm:grid-cols-3">
              {MODES.map(({ id, label, Icon, hint }) => (
                <label key={id} className={clsx("cursor-pointer rounded-xl p-4 ring-1 transition", f.mode === id ? "bg-signal-500/5 ring-2 ring-signal-500" : "ring-line hover:ring-ink-300")}>
                  <input type="radio" name="mode" value={id} checked={f.mode === id} onChange={() => set("mode", id)} className="sr-only" />
                  <Icon className="h-5 w-5" />
                  <span className="mt-3 block font-semibold">{label}</span>
                  <span className="mt-1 block text-sm text-slate">{hint}</span>
                </label>
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="incoterm" label="Incoterm" hint="Not sure? Leave it and we'll advise.">
                <select id="incoterm" className="field-input" value={f.incoterm} onChange={(e) => set("incoterm", e.target.value)}>
                  <option value="">Not sure</option>
                  {incoterms.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.code} · {t.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="customs" label="Customs clearance needed?">
                <div className="grid grid-cols-3 gap-2">
                  {(["yes", "no", "unsure"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={f.customs === v}
                      onClick={() => set("customs", v)}
                      className={clsx("h-[42px] rounded-lg text-sm capitalize ring-1 transition", f.customs === v ? "bg-ink-900 text-white ring-ink-900" : "ring-line hover:ring-ink-300")}
                    >
                      {v === "unsure" ? "Not sure" : v}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <StepTitle>Where is it going?</StepTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="origin" label="Pickup city and country" error={errors.origin}>
                <input id="origin" className="field-input" value={f.origin} onChange={(e) => set("origin", e.target.value)} autoComplete="off" />
              </Field>
              <Field id="destination" label="Delivery city and country" error={errors.destination}>
                <input id="destination" className="field-input" placeholder="e.g. Tema, Ghana" value={f.destination} onChange={(e) => set("destination", e.target.value)} autoComplete="off" />
              </Field>
              <Field id="readyDate" label="Cargo ready date">
                <input id="readyDate" type="date" className="field-input" value={f.readyDate} onChange={(e) => set("readyDate", e.target.value)} />
              </Field>
              <Field id="serviceLevel" label="Service level">
                <select id="serviceLevel" className="field-input" value={f.serviceLevel} onChange={(e) => set("serviceLevel", e.target.value as Form["serviceLevel"])}>
                  <option value="door-door">Door to door</option>
                  <option value="door-port">Door to port / airport</option>
                  <option value="port-door">Port / airport to door</option>
                  <option value="port-port">Port / airport to port / airport</option>
                </select>
              </Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <StepTitle>What are you shipping?</StepTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="goods" label="Description of goods" error={errors.goods} className="sm:col-span-2">
                <input id="goods" className="field-input" placeholder="e.g. Machine parts on 4 pallets" value={f.goods} onChange={(e) => set("goods", e.target.value)} />
              </Field>
              <Field id="pieces" label="Number of pieces / pallets" error={errors.pieces}>
                <input id="pieces" type="number" min={1} inputMode="numeric" className="field-input num" value={f.pieces} onChange={(e) => set("pieces", e.target.value)} />
              </Field>
              <Field id="weightKg" label="Total weight (kg)" error={errors.weightKg}>
                <input id="weightKg" type="number" min={0} inputMode="decimal" className="field-input num" value={f.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
              </Field>
              <div className="space-y-1.5 sm:col-span-2">
                <span className="text-sm font-medium">Dimensions per piece (cm)</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["lengthCm", "widthCm", "heightCm"] as const).map((k, i) => (
                    <input key={k} aria-label={["Length", "Width", "Height"][i] + " in cm"} placeholder={["L", "W", "H"][i]} type="number" min={0} inputMode="decimal" className="field-input num" value={f[k]} onChange={(e) => set(k, e.target.value)} />
                  ))}
                </div>
              </div>
              {f.mode === "sea" && (
                <Field id="equipment" label="Equipment">
                  <select id="equipment" className="field-input" value={f.equipment} onChange={(e) => set("equipment", e.target.value)}>
                    <option value="">Advise me</option>
                    <option>LCL (shared container)</option>
                    <option>20&apos; standard</option>
                    <option>40&apos; standard</option>
                    <option>40&apos; high cube</option>
                    <option>Several containers</option>
                  </select>
                </Field>
              )}
              <Field id="hsCode" label="HS code (optional)">
                <input id="hsCode" className="field-input num" placeholder="e.g. 8483 40" value={f.hsCode} onChange={(e) => set("hsCode", e.target.value)} />
              </Field>
              <label className="flex items-start gap-3 rounded-xl p-4 ring-1 ring-line sm:col-span-2">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-signal-500" checked={f.dangerous} onChange={(e) => set("dangerous", e.target.checked)} />
                <span>
                  <span className="font-medium">Dangerous goods</span>
                  <span className="block text-sm text-slate">Batteries, chemicals, aerosols or anything with a UN number. We&apos;ll ask for the safety data sheet.</span>
                </span>
              </label>
            </div>
            {estimate && (
              <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-xl bg-ink-900 px-5 py-4 text-sm text-ink-300">
                <span>Volume <strong className="num ml-1 text-white">{fmt(estimate.volume, 2)} m³</strong></span>
                {f.mode === "sea" ? (
                  <>
                    <span>Revenue tonnes <strong className="num ml-1 text-signal-400">{fmt(estimate.revenueTonnes ?? 0, 2)}</strong></span>
                    <span>Suggested <strong className="ml-1 text-white">{suggestContainer(estimate.volume, estimate.actual).name}</strong></span>
                  </>
                ) : (
                  <span>Chargeable <strong className="num ml-1 text-signal-400">{fmt(estimate.chargeableKg)} kg</strong></span>
                )}
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <StepTitle>Where should we send the quote?</StepTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Your name" error={errors.name}>
                <input id="name" className="field-input" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field id="company" label="Company">
                <input id="company" className="field-input" autoComplete="organization" value={f.company} onChange={(e) => set("company", e.target.value)} />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <input id="email" type="email" className="field-input" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field id="phone" label="Phone / WhatsApp">
                <input id="phone" type="tel" className="field-input" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field id="notes" label="Anything else?" className="sm:col-span-2">
                <textarea id="notes" rows={3} className="field-input" placeholder="Deadlines, special handling, insurance…" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
              </Field>
            </div>
            <Summary f={f} />
          </>
        )}

        {status === "error" && (
          <p className="flex items-center gap-2 rounded-lg bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
            <AlertTriangle className="h-4 w-4" /> We couldn&apos;t send your request. Check your connection and try again, or email us directly.
          </p>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-11 items-center gap-2 rounded-lg px-4 font-medium ring-1 ring-line hover:bg-mist">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={status === "sending"} className="inline-flex h-11 items-center gap-2 rounded-lg bg-signal-500 px-5 font-medium text-white hover:bg-signal-600 disabled:opacity-70">
            {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {step < 3 ? "Continue" : "Send quote request"}
            {step < 3 && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>;
}

function Field({ id, label, hint, error, className, children }: { id: string; label: string; hint?: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("min-w-0 space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-danger-500">{error}</p> : hint ? <p className="text-sm text-slate">{hint}</p> : null}
    </div>
  );
}

function Summary({ f }: { f: Form }) {
  const rows: [string, string][] = [
    ["Mode", f.mode.toUpperCase() + (f.equipment ? ` · ${f.equipment}` : "")],
    ["Route", `${f.origin || "?"} → ${f.destination || "?"}`],
    ["Incoterm", f.incoterm || "Not sure"],
    ["Customs", f.customs === "unsure" ? "Not sure" : f.customs],
    ["Cargo", `${f.goods || "?"} · ${f.pieces || "?"} pcs · ${f.weightKg || "?"} kg${f.dangerous ? " · DG" : ""}`],
  ];
  return (
    <dl className="divide-y divide-line rounded-xl ring-1 ring-line">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-2.5 text-sm">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-400">{k}</dt>
          <dd className="min-w-0 break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
