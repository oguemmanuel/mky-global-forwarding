"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { ButtonLink, StatusDot } from "@/components/ui";
import { media } from "@/content/media";
import { CommandBar } from "./CommandBar";

export function Hero() {
  const { t } = useLocale();
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* Cinematic backdrop: photo + graded overlays. Falls back to the gradient if the image is missing. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#19304f_0%,#03050a_65%)]" />
        <Image src={media.hero.src} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 to-transparent" />
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="container-x relative grid gap-12 pb-10 pt-16 lg:grid-cols-[1.35fr_0.65fr] lg:pb-14 lg:pt-28">
        <div className="min-w-0 space-y-8">
          <p className="eyebrow-dark flex items-center gap-3">
            <span className="h-px w-8 bg-signal-400" />
            {t.hero.eyebrow}
          </p>
          <h1 className="display text-[2.7rem] sm:text-6xl lg:text-[5.4rem]">
            {t.hero.title.split(". ").map((line, i, arr) => (
              <span key={i} className={i === arr.length - 1 ? "block text-signal-400" : "block"}>
                {line}
                {i < arr.length - 1 ? "." : ""}
              </span>
            ))}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink-300">{t.hero.sub}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/quote" size="lg">
              {t.cta.quote} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/services" variant="ghost-dark" size="lg">
              {t.nav.services}
            </ButtonLink>
          </div>
        </div>

        {/* Floating data panels */}
        <div className="hidden min-w-0 flex-col justify-end gap-4 lg:flex">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink-400">
              <span>MKY-DEMO-001</span>
              <span className="flex items-center gap-2 text-sky-400">
                <StatusDot tone="sky" /> Sailing
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="display-md text-3xl">ANR</div>
                <div className="text-xs text-ink-400">Antwerp</div>
              </div>
              <div className="text-right">
                <div className="display-md text-3xl">ALY</div>
                <div className="text-xs text-ink-400">Alexandria</div>
              </div>
            </div>
            <div className="relative mt-4 h-1 rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 w-[55%] rounded-full bg-gradient-to-r from-signal-500 to-signal-400" />
              <div className="absolute top-1/2 left-[55%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_#df9b67]" />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[11px] text-ink-400">
              <span>VIN VF7…0001 · Ro-Ro</span>
              <span>ACID · MRN · EUR.1 done</span>
            </div>
          </div>
          <div className="glass grid grid-cols-3 divide-x divide-white/10 rounded-2xl">
            {[
              ["VIN", "Tracking"],
              ["MRN", "EUR.1 · ACID"],
              ["1", "Coordinator"],
            ].map(([v, k]) => (
              <div key={k} className="px-4 py-4">
                <div className="display-md num text-2xl">{v}</div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-400">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x relative pb-14 lg:pb-20">
        <CommandBar />
      </div>
    </section>
  );
}
