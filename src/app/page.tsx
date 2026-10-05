import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileCheck2, Gauge, MapPinned, UserRound } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CoverageMap } from "@/components/home/CoverageMap";
import { ShipmentView } from "@/components/shipment/ShipmentView";
import { ButtonLink, Fill, StatusDot } from "@/components/ui";
import { accreditations, lanes, processSteps, services, stats, testimonial } from "@/content/site";
import { media } from "@/content/media";
import { findShipment } from "@/lib/tracking";

function Heading({ eyebrow, title, lead, light }: { eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; light?: boolean }) {
  return (
    <div className="max-w-3xl space-y-5">
      <p className={`${light ? "eyebrow" : "eyebrow-dark"} flex items-center gap-3`}>
        <span className={`h-px w-8 ${light ? "bg-signal-700" : "bg-signal-400"}`} />
        {eyebrow}
      </p>
      <h2 className={`display text-4xl sm:text-5xl lg:text-[3.6rem] ${light ? "text-ink-900" : "text-white"}`}>{title}</h2>
      {lead && <p className={`max-w-2xl text-lg leading-relaxed ${light ? "text-slate" : "text-ink-300"}`}>{lead}</p>}
    </div>
  );
}

const modeLabel = { air: "Air", sea: "Ocean", road: "Road" } as const;

export default async function HomePage() {
  const demo = await findShipment("MKY-DEMO-001");
  const destinations = lanes.filter((l) => ["TEM", "DXB", "HAM", "SHA"].includes(l.code));

  return (
    <div className="bg-ink-950 text-white">
      <Hero />

      {/* Stats band, Swiss grid */}
      <section aria-label="Key figures" className="border-y border-white/10">
        <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-8 pr-4 ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""} ${i % 2 === 1 ? "border-l border-white/10 pl-6 lg:pl-8" : ""}`}>
              <dd className="display-md num text-4xl text-white sm:text-5xl">
                <Fill value={s.value} className="text-[0.55em]" />
              </dd>
              <dt className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Services with imagery */}
      <section className="py-24 lg:py-32">
        <div className="container-x space-y-14">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <Heading eyebrow="Services" title={<>Every mode.<br />One team.</>} lead="Book a single leg or hand us the whole chain, from factory floor to final delivery." />
            <ButtonLink href="/services" variant="ghost-dark">
              All services <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/10"
              >
                <Image src={media[s.media].src} alt={media[s.media].alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/10" />
                <div className="relative space-y-3 p-6">
                  <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-ink-300">
                    <span>0{i + 1} / {s.code}</span>
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-400" />
                  </div>
                  <h3 className="display-md text-2xl">{s.name}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-300">{s.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Global network */}
      <section className="relative overflow-hidden border-y border-white/10 bg-[radial-gradient(ellipse_at_50%_0%,#0d1626_0%,#03050a_70%)] py-24 lg:py-32">
        <div className="container-x space-y-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <Heading
              eyebrow="Network"
              title={<>Kraków at the centre.<br />The world at the edges.</>}
              lead="On the A4 corridor, within reach of the Baltic ports and Europe's main air hubs. Here are a few lanes we cover."
            />
            <div className="glass flex gap-6 rounded-2xl px-5 py-4">
              {(["air", "sea", "road"] as const).map((m) => (
                <div key={m}>
                  <div className="display-md num text-2xl">{lanes.filter((l) => l.mode === m).length}</div>
                  <div className="font-mono text-[10.5px] uppercase tracking-wider text-ink-400">{modeLabel[m]} lanes</div>
                </div>
              ))}
            </div>
          </div>
          <CoverageMap />
        </div>
      </section>

      {/* Tracking showcase */}
      <section className="overflow-hidden py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-10">
            <Heading
              eyebrow="Visibility"
              title={<>See it move.<br />Every milestone.</>}
              lead="Every shipment gets a reference you can track online, with each step logged as it happens. No chasing emails."
            />
            <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {[
                { Icon: Gauge, t: "Priced in minutes", d: "Chargeable weight and equipment worked out before you ask." },
                { Icon: MapPinned, t: "Live milestones", d: "Booking, departure, transhipment, arrival, delivery." },
                { Icon: UserRound, t: "One coordinator", d: "A named person owns your shipment end to end." },
                { Icon: FileCheck2, t: "Documents checked", d: "Paperwork reviewed before cargo moves." },
              ].map(({ Icon, t, d }) => (
                <li key={t} className="space-y-2 border-t border-white/10 pt-4">
                  <Icon className="h-5 w-5 text-sky-400" />
                  <p className="font-medium">{t}</p>
                  <p className="text-sm leading-relaxed text-ink-400">{d}</p>
                </li>
              ))}
            </ul>
            <ButtonLink href="/track" variant="ghost-dark">
              Open the tracker <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="relative min-w-0">
            <div aria-hidden className="absolute -inset-8 rounded-[40px] bg-[radial-gradient(circle_at_60%_40%,rgba(63,169,180,0.18),transparent_65%)]" />
            <div className="relative">{demo.ok && <ShipmentView shipment={demo.shipment} variant="compact" />}</div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="border-t border-white/10 py-24 lg:py-32">
        <div className="container-x space-y-12">
          <Heading eyebrow="Destinations" title="Where our clients ship" lead="Example lanes from Kraków. Ask about any route that isn't listed." />
          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d) => (
              <Link key={d.code} href={`/quote?mode=${d.mode}&to=${encodeURIComponent(d.city)}`} className="group bg-ink-950 p-6 transition hover:bg-ink-900">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  <span>KRK → {d.code}</span>
                  <span className="flex items-center gap-2"><StatusDot tone="sky" /> {modeLabel[d.mode]}</span>
                </div>
                <div className="display mt-10 text-6xl text-white/90 transition group-hover:text-signal-400">{d.code}</div>
                <div className="mt-2 flex items-center justify-between text-ink-300">
                  <span>{d.city}</span>
                  <span className="text-sm text-signal-400 opacity-0 transition group-hover:opacity-100">Get rate →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-paper py-24 text-ink-900 lg:py-32">
        <div className="container-x space-y-14">
          <Heading light eyebrow="How it works" title="Quote to delivery in four steps" />
          <ol className="grid gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <li key={s.title} className="bg-white p-7">
                <span className="display num text-5xl text-signal-500">0{i + 1}</span>
                <h3 className="display-md mt-8 text-xl">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <figure className="flex flex-col justify-between rounded-2xl bg-white p-8 ring-1 ring-line sm:p-10">
              <p className="eyebrow">Client feedback</p>
              <blockquote className="mt-8 text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                &ldquo;<Fill value={testimonial.quote} />&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-sm text-slate">
                <Fill value={testimonial.name} />, <Fill value={testimonial.role} />
              </figcaption>
            </figure>
            <div className="rounded-2xl bg-ink-900 p-8 text-white sm:p-10">
              <p className="eyebrow-dark">Accredited &amp; insured</p>
              <ul className="mt-8 space-y-4">
                {accreditations.map((a, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0">
                    <Fill value={a} />
                    <span className="font-mono text-[11px] text-ink-400">verify</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative isolate overflow-hidden">
        <Image src={media.cta.src} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
        <div className="container-x flex flex-wrap items-end justify-between gap-10 py-24 lg:py-32">
          <h2 className="display max-w-3xl text-5xl sm:text-6xl lg:text-7xl">
            Got cargo<br />to move<span className="text-signal-400">?</span>
          </h2>
          <div className="space-y-5">
            <p className="max-w-sm text-lg text-ink-300">Send the details. A coordinator replies with a price and transit options.</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/quote" size="lg">
                Request a quote <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost-dark" size="lg">
                Talk to us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
