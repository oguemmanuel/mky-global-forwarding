import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Fill } from "@/components/ui";
import { TODO, company } from "@/content/site";
import { QuoteWizard } from "./QuoteWizard";

export const metadata: Metadata = {
  title: "Request a freight quote",
  description: "Get a quote for air, ocean or road freight and customs clearance. Takes about two minutes.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Quote" }]}
        title="Request a freight quote"
        lead="Four short steps. A coordinator replies with a price and transit options."
      />
      <section className="py-12 lg:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <Suspense>
              <QuoteWizard />
            </Suspense>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <h2 className="font-semibold">Prefer to talk?</h2>
              <ul className="mt-4 space-y-3 text-[15px]">
                <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-ink-400" /><a href={`tel:${company.phoneHref}`} className="num hover:text-signal-700">{company.phone}</a></li>
                <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-ink-400" /><a href={`mailto:${company.email}`} className="break-all hover:text-signal-700">{company.email}</a></li>
                <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-ink-400" /><a href={company.whatsapp} target="_blank" rel="noopener" className="hover:text-signal-700">WhatsApp a coordinator</a></li>
              </ul>
            </div>
            <div className="flex gap-3 rounded-2xl bg-ink-900 p-6 text-sm text-ink-300">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              <p>
                Typical reply time: <Fill value={TODO("within X working hours")} className="text-signal-400" />
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
