import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink, Fill, SectionHeader } from "@/components/ui";
import { TODO, company, team } from "@/content/site";

export const metadata: Metadata = {
  title: "About MKY Global Forwarding",
  description: "MKY Global Forwarding is a freight forwarder based in Kraków, Poland, handling air, ocean and road freight and customs clearance.",
  alternates: { canonical: "/about" },
};

const values = [
  { t: "Straight answers", d: "Clear prices, realistic transit times and no surprises on the final invoice." },
  { t: "Documents done right", d: "We check paperwork before cargo moves, because fixing it at the border costs time and money." },
  { t: "Always reachable", d: "Phone, email or WhatsApp, with the same coordinator for the whole shipment." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
        title="A Kraków forwarder for businesses that trade worldwide"
        lead={<Fill value={TODO("Two or three sentences in MKY's own words: when and why the company started, who it serves")} />}
      />

      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr]">
          <SectionHeader eyebrow="How we work" title="Small enough to know your shipment, connected enough to move it anywhere" />
          <ul className="divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
            {values.map((v) => (
              <li key={v.t} className="p-6">
                <h3 className="text-lg font-semibold">{v.t}</h3>
                <p className="mt-1 text-slate">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 lg:py-24">
        <div className="container-x space-y-10">
          <SectionHeader eyebrow="Team" title="The people handling your cargo" lead="Real names and photos build trust. These slots are waiting for the MKY team." />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <li key={i} className="space-y-3">
                <div className="grid aspect-[4/5] place-items-center rounded-2xl border border-dashed border-line bg-mist text-ink-400">
                  <UserRound className="h-10 w-10" />
                </div>
                <p className="font-semibold"><Fill value={m.name} /></p>
                <p className="text-sm text-slate"><Fill value={m.role} /></p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-ink-900 p-8 text-white sm:p-10">
          <div>
            <p className="eyebrow-dark">Head office</p>
            <p className="mt-2 text-2xl font-semibold">
              {company.address.street}, {company.address.postalCode} {company.address.city}
            </p>
          </div>
          <ButtonLink href="/contact" variant="ghost-dark">Get in touch</ButtonLink>
        </div>
      </section>
    </>
  );
}
