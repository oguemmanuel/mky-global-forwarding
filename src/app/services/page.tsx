import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui";
import { services } from "@/content/site";

export const metadata: Metadata = {
  title: "Services: vehicle shipping, export documents, inland transport",
  description: "Vehicle shipping from European ports to the Middle East, export documents (MRN, EUR.1, ACID / CargoX) and collection across Europe.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
        title="Vehicles, documents and transport under one roof"
        lead="Choose one service or let us manage the whole job. Every vehicle comes with one coordinator and tracking by VIN."
      />
      <section className="py-16 lg:py-24">
        <div className="container-x divide-y divide-line">
          {services.map((s) => (
            <article key={s.slug} className="grid gap-6 py-10 first:pt-0 lg:grid-cols-[220px_1fr_auto] lg:items-start">
              <span className="w-fit rounded-md bg-mist px-2 py-1 font-mono text-xs tracking-wider text-ink-700">{s.code}</span>
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight">
                  <Link href={`/services/${s.slug}`} className="hover:text-signal-700">
                    {s.name}
                  </Link>
                </h2>
                <p className="text-lg leading-relaxed text-slate">{s.intro}</p>
                <ul className="grid gap-x-6 gap-y-1.5 pt-2 text-[15px] sm:grid-cols-2">
                  {s.includes.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2.5 h-1 w-2 shrink-0 bg-signal-500" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <ButtonLink href={`/services/${s.slug}`} variant="ghost">
                Details <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
