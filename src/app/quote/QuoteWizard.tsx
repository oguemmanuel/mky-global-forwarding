"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, ArrowLeft, ArrowRight, Car, CheckCircle2, FileText, Loader2, MessageCircle, Package, Truck } from "lucide-react";
import { documentTypes, fieldErrors, modes, quoteSchema, vehicleTypes } from "@/lib/schemas";
import { chargeable, fmt } from "@/lib/freight";
import { vinProblem } from "@/lib/vin";
import { docLabel, quoteMessage, vehicleLabel, whatsappLink } from "@/lib/quoteMessage";
import { company, destinationPorts, incoterms, originPorts, type QuoteMode } from "@/content/site";

type Doc = (typeof documentTypes)[number];
type VType = (typeof vehicleTypes)[number];

type Form = {
  mode: QuoteMode;
  documents: Doc[];
  incoterm: string;
  origin: string;
  destination: string;
  readyDate: string;
  collection: "yes" | "no";
  vehicleType: VType | "";
  vehicleCount: string;
  makeModel: string;
  vins: string;
  running: "yes" | "no";
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
  { title: "Service", fields: ["mode", "documents", "incoterm"] },
  { title: "Route", fields: ["origin", "destination", "readyDate", "collection"] },
  { title: "Details", fields: ["vehicleType", "vehicleCount", "makeModel", "vins", "running", "goods", "hsCode", "equipment", "pieces", "weightKg", "lengthCm", "widthCm", "heightCm", "dangerous"] },
  { title: "Contact", fields: ["name", "company", "email", "phone", "notes"] },
] as const;

const MODES: { id: QuoteMode; label: string; Icon: typeof Car; hint: string }[] = [
  { id: "vehicle", label: "Vehicle shipping", Icon: Car, hint: "Cars, vans, trucks or trailers by sea" },
  { id: "road", label: "Inland transport", Icon: Truck, hint: "Collection in Europe to the port" },
  { id: "documents", label: "Documents only", Icon: FileText, hint: "MRN, EUR.1 or ACID / CargoX" },
  { id: "cargo", label: "Container & cargo", Icon: Package, hint: "Containers or general cargo" },
];

const portName = (p: { city: string; country: string }) => `${p.city}, ${p.country}`;

export function QuoteWizard() {
  const sp = useSearchParams();
  const initialMode = ((modes as readonly string[]).includes(sp.get("mode") ?? "") ? sp.get("mode") : "vehicle") as QuoteMode;
  const initialType = (vehicleTypes as readonly string[]).includes(sp.get("type") ?? "") ? (sp.get("type") as VType) : "";

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState<{ reference: string; channel: "email" | "whatsapp" } | null>(null);
  const [f, setF] = useState<Form>({
    mode: initialMode,
    documents: initialMode === "documents" ? ["mrn"] : [],
    incoterm: "",
    origin: sp.get("from") ?? portName(originPorts[0]),
    destination: sp.get("to") ?? "",
    readyDate: "",
    collection: initialMode === "road" ? "yes" : "no",
    vehicleType: initialType,
    vehicleCount: sp.get("count") ?? "1",
    makeModel: "",
    vins: "",
    running: "yes",
    goods: "",
    hsCode: "",
    equipment: "",
    pieces: "",
    weightKg: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
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

  const toggleDoc = (d: Doc) => set("documents", f.documents.includes(d) ? f.documents.filter((x) => x !== d) : [...f.documents, d]);

  const num = (v: string) => (v === "" ? undefined : Number(v));
  const payload = useMemo(
    () => ({
      ...f,
      vehicleType: f.vehicleType || undefined,
      vehicleCount: num(f.vehicleCount),
      pieces: num(f.pieces),
      weightKg: num(f.weightKg),
      lengthCm: num(f.lengthCm),
      widthCm: num(f.widthCm),
      heightCm: num(f.heightCm),
    }),
    [f],
  );

  const vinWarnings = useMemo(
    () =>
      f.vins
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map((v) => ({ v, problem: vinProblem(v) }))
        .filter((x) => x.problem),
    [f.vins],
  );

  const estimate = useMemo(() => {
    if (f.mode !== "cargo") return null;
    const p = Number(f.pieces), w = Number(f.weightKg), l = Number(f.lengthCm), wi = Number(f.widthCm), h = Number(f.heightCm);
    if (!(p > 0 && w > 0 && l > 0 && wi > 0 && h > 0)) return null;
    return chargeable([{ length: l, width: wi, height: h, quantity: p, weight: w / p }], "sea");
  }, [f]);

  function validateStep(i: number) {
    const parsed = quoteSchema.safeParse(payload);
    if (parsed.success) return true;
    const errs = fieldErrors(parsed.error);
    const stepErrs = Object.fromEntries(Object.entries(errs).filter(([k]) => (STEPS[i].fields as readonly string[]).includes(k)));
    setErrors(stepErrs);
    return Object.keys(stepErrs).length === 0;
  }

  async function submit(channel: "email" | "whatsapp") {
    if (!validateStep(3)) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, channel }) });
      const json = await res.json();
      if (!json.ok) {
        setErrors(json.errors ?? {});
        const firstBad = STEPS.findIndex((s) => (s.fields as readonly string[]).some((fld) => json.errors?.[fld]));
        if (firstBad >= 0) setStep(firstBad);
        setStatus("idle");
        return;
      }
      setResult({ reference: json.reference, channel });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done" && result) {
    const wa = whatsappLink(company.whatsapp, quoteMessage(payload as Parameters<typeof quoteMessage>[0], result.reference));
    return (
      <div className="space-y-5 rounded-2xl bg-white p-8 ring-1 ring-line">
        <CheckCircle2 className="h-10 w-10 text-ok-500" />
        <h2 className="text-3xl font-semibold tracking-tight">{result.channel === "whatsapp" ? "Almost done: send it on WhatsApp" : "Request received"}</h2>
        <p className="text-lg text-slate">
          Your reference is <span className="font-mono font-medium text-ink-900">{result.reference}</span>.{" "}
          {result.channel === "whatsapp"
            ? "Tap the button to open WhatsApp with your request already written, then press send."
            : <>A coordinator will reply to <span className="font-medium text-ink-900">{f.email}</span> with the price and next sailing.</>}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {result.channel === "whatsapp" && (
            <a href={wa} target="_blank" rel="noopener" className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#1fa855] px-6 font-medium text-white hover:bg-[#1a9049]">
              <MessageCircle className="h-5 w-5" /> Open WhatsApp
            </a>
          )}
          <Link href="/" className="inline-flex h-12 items-center rounded-lg px-5 font-medium ring-1 ring-line hover:bg-mist">Back to home</Link>
        </div>
      </div>
    );
  }

  const isVehicle = f.mode === "vehicle" || f.mode === "road";

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
          } else submit("email");
        }}
        className="space-y-6 p-5 sm:p-8"
      >
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" value={f.website} onChange={(e) => set("website", e.target.value)} />

        {step === 0 && (
          <>
            <StepTitle>What do you need?</StepTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {MODES.map(({ id, label, Icon, hint }) => (
                <label key={id} className={clsx("cursor-pointer rounded-xl p-4 ring-1 transition", f.mode === id ? "bg-signal-500/5 ring-2 ring-signal-500" : "ring-line hover:ring-ink-300")}>
                  <input type="radio" name="mode" value={id} checked={f.mode === id} onChange={() => set("mode", id)} className="sr-only" />
                  <Icon className="h-5 w-5" />
                  <span className="mt-3 block font-semibold">{label}</span>
                  <span className="mt-1 block text-sm text-slate">{hint}</span>
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Documents you need from us {f.mode !== "documents" && <span className="font-normal text-slate">(optional)</span>}</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {documentTypes.map((d) => (
                  <label key={d} className={clsx("flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] ring-1", f.documents.includes(d) ? "bg-ink-900 text-white ring-ink-900" : "ring-line hover:ring-ink-300")}>
                    <input type="checkbox" className="h-4 w-4 accent-signal-500" checked={f.documents.includes(d)} onChange={() => toggleDoc(d)} />
                    {docLabel[d]}
                  </label>
                ))}
              </div>
              {errors.documents && <p className="text-sm text-danger-500">{errors.documents}</p>}
              <p className="text-sm text-slate">Shipping to Egypt? ACID is mandatory: you&apos;ll need the ACID number from your Egyptian importer.</p>
            </div>
            <Field id="incoterm" label="Incoterm (optional)" hint="Not sure? Leave it and we'll advise.">
              <select id="incoterm" className="field-input" value={f.incoterm} onChange={(e) => set("incoterm", e.target.value)}>
                <option value="">Not sure</option>
                {incoterms.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.code} · {t.name}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <StepTitle>Where is it going?</StepTitle>
            <datalist id="origin-ports">
              {originPorts.map((p) => <option key={p.code} value={portName(p)} />)}
            </datalist>
            <datalist id="destination-ports">
              {destinationPorts.map((p) => <option key={p.code} value={portName(p)} />)}
            </datalist>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="origin" label="Port of loading or collection city" error={errors.origin}>
                <input id="origin" list="origin-ports" className="field-input" value={f.origin} onChange={(e) => set("origin", e.target.value)} autoComplete="off" />
              </Field>
              <Field id="destination" label="Destination port" error={errors.destination}>
                <input id="destination" list="destination-ports" className="field-input" placeholder="e.g. Alexandria, Egypt" value={f.destination} onChange={(e) => set("destination", e.target.value)} autoComplete="off" />
              </Field>
              <Field id="readyDate" label="Ready from">
                <input id="readyDate" type="date" className="field-input" value={f.readyDate} onChange={(e) => set("readyDate", e.target.value)} />
              </Field>
              <Field id="collection" label="Need collection to the port?">
                <div className="grid grid-cols-2 gap-2">
                  {(["yes", "no"] as const).map((v) => (
                    <button key={v} type="button" aria-pressed={f.collection === v} onClick={() => set("collection", v)} className={clsx("h-[42px] rounded-lg text-sm ring-1 transition", f.collection === v ? "bg-ink-900 text-white ring-ink-900" : "ring-line hover:ring-ink-300")}>
                      {v === "yes" ? "Yes, collect it" : "No, I'll deliver"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <StepTitle>{isVehicle || f.mode === "documents" ? "Tell us about the vehicle" : "What are you shipping?"}</StepTitle>
            {(isVehicle || f.mode === "documents") && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="vehicleType" label="Vehicle type" error={errors.vehicleType}>
                  <select id="vehicleType" className="field-input" value={f.vehicleType} onChange={(e) => set("vehicleType", e.target.value as VType)}>
                    <option value="">Choose…</option>
                    {vehicleTypes.map((t) => <option key={t} value={t}>{vehicleLabel[t]}</option>)}
                  </select>
                </Field>
                <Field id="vehicleCount" label="How many?" error={errors.vehicleCount}>
                  <input id="vehicleCount" type="number" min={1} inputMode="numeric" className="field-input num" value={f.vehicleCount} onChange={(e) => set("vehicleCount", e.target.value)} />
                </Field>
                <Field id="makeModel" label="Make, model and year" error={errors.makeModel} className="sm:col-span-2">
                  <input id="makeModel" className="field-input" placeholder="e.g. Toyota Land Cruiser 2022" value={f.makeModel} onChange={(e) => set("makeModel", e.target.value)} />
                </Field>
                <Field id="vins" label="VIN / chassis number(s), optional" hint="One per line. Speeds up the export documents." className="sm:col-span-2">
                  <textarea id="vins" rows={2} className="field-input font-mono uppercase" value={f.vins} onChange={(e) => set("vins", e.target.value)} />
                </Field>
                {vinWarnings.length > 0 && (
                  <ul className="space-y-1 text-sm text-warn-500 sm:col-span-2">
                    {vinWarnings.map((w) => <li key={w.v}><span className="font-mono">{w.v}</span>: {w.problem}</li>)}
                  </ul>
                )}
                {isVehicle && (
                  <Field id="running" label="Does it drive?">
                    <div className="grid grid-cols-2 gap-2">
                      {(["yes", "no"] as const).map((v) => (
                        <button key={v} type="button" aria-pressed={f.running === v} onClick={() => set("running", v)} className={clsx("h-[42px] rounded-lg text-sm ring-1 transition", f.running === v ? "bg-ink-900 text-white ring-ink-900" : "ring-line hover:ring-ink-300")}>
                          {v === "yes" ? "Yes, runs" : "No, non-running"}
                        </button>
                      ))}
                    </div>
                  </Field>
                )}
              </div>
            )}

            {f.mode === "cargo" && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="goods" label="Description of goods" error={errors.goods} className="sm:col-span-2">
                  <input id="goods" className="field-input" placeholder="e.g. Spare parts on 4 pallets" value={f.goods} onChange={(e) => set("goods", e.target.value)} />
                </Field>
                <Field id="pieces" label="Pieces / pallets" error={errors.pieces}>
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
                <Field id="equipment" label="Equipment">
                  <select id="equipment" className="field-input" value={f.equipment} onChange={(e) => set("equipment", e.target.value)}>
                    <option value="">Advise me</option>
                    <option>20&apos; standard</option>
                    <option>40&apos; standard</option>
                    <option>40&apos; high cube</option>
                    <option>Shared container</option>
                  </select>
                </Field>
                <Field id="hsCode" label="HS code (optional)">
                  <input id="hsCode" className="field-input num" value={f.hsCode} onChange={(e) => set("hsCode", e.target.value)} />
                </Field>
                <label className="flex items-start gap-3 rounded-xl p-4 ring-1 ring-line sm:col-span-2">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-signal-500" checked={f.dangerous} onChange={(e) => set("dangerous", e.target.checked)} />
                  <span>
                    <span className="font-medium">Dangerous goods</span>
                    <span className="block text-sm text-slate">Batteries, chemicals or anything with a UN number.</span>
                  </span>
                </label>
                {estimate && (
                  <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-xl bg-ink-900 px-5 py-4 text-sm text-ink-300 sm:col-span-2">
                    <span>Volume <strong className="num ml-1 text-white">{fmt(estimate.volume, 2)} m³</strong></span>
                    <span>Revenue tonnes <strong className="num ml-1 text-signal-400">{fmt(estimate.revenueTonnes ?? 0, 2)}</strong></span>
                  </div>
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
                <textarea id="notes" rows={3} className="field-input" placeholder="Deadlines, consignee details, special instructions…" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
              </Field>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl bg-mist p-4 font-mono text-[13px] leading-relaxed text-ink-700">{quoteMessage(payload as Parameters<typeof quoteMessage>[0])}</pre>
          </>
        )}

        {status === "error" && (
          <p className="flex items-center gap-2 rounded-lg bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
            <AlertTriangle className="h-4 w-4" /> We couldn&apos;t send your request. Check your connection and try again, or message us on WhatsApp.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-11 items-center gap-2 rounded-lg px-4 font-medium ring-1 ring-line hover:bg-mist">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap gap-2">
            {step === 3 && (
              <button type="button" disabled={status === "sending"} onClick={() => submit("whatsapp")} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1fa855] px-5 font-medium text-white hover:bg-[#1a9049] disabled:opacity-70">
                <MessageCircle className="h-4 w-4" /> Send on WhatsApp
              </button>
            )}
            <button type="submit" disabled={status === "sending"} className="inline-flex h-11 items-center gap-2 rounded-lg bg-signal-500 px-5 font-medium text-white hover:bg-signal-600 disabled:opacity-70">
              {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              {step < 3 ? "Continue" : "Send by email"}
              {step < 3 && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
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
