import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, FileText } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink, Fill } from "@/components/ui";
import { TODO, getService, services } from "@/content/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: `${s.name} from Kraków`,
    description: s.intro,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

const quoteMode = { "air-freight": "air", "ocean-freight": "sea", "road-freight": "road", "customs-clearance": "air" } as const;

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }, { label: s.name }]}
        title={s.headline}
        lead={s.intro}
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href={`/quote?mode=${quoteMode[s.slug]}`} size="lg">
            Quote {s.name.toLowerCase()} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost-dark" size="lg">
            Ask a question
          </ButtonLink>
        </div>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold">What&apos;s included</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.includes.map((i) => (
                  <li key={i} className="flex gap-3 rounded-xl bg-white p-4 ring-1 ring-line">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok-500" />
                    <span className="text-[15px]">{i}</span>
                  </li>
                ))}
                {s.confirm.map((c) => (
                  <li key={c} className="flex gap-3 rounded-xl border border-dashed border-line p-4">
                    <span className="text-[15px]">
                      <Fill value={TODO(`Confirm: ${c}`)} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">A good fit for</h2>
              <ul className="mt-4 space-y-2 text-lg text-slate">
                {s.idealFor.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-400">Documents you&apos;ll need</h2>
              <ul className="mt-4 space-y-3">
                {s.documents.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-[15px]">
                    <FileText className="h-4 w-4 text-sky-500" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-sm text-slate">
                Not sure what applies to you? Your coordinator checks every document before the cargo moves.
              </p>
            </div>
            <div className="rounded-2xl bg-ink-900 p-6 text-white">
              <p className="font-medium">Work out your chargeable weight</p>
              <p className="mt-1 text-sm text-ink-300">Use our free calculators before you request a quote.</p>
              <Link href="/tools" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-signal-400 hover:text-signal-500">
                Open freight tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-white py-14">
        <div className="container-x">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-400">Other services</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className="group flex items-center justify-between rounded-xl p-4 ring-1 ring-line hover:ring-ink-300">
                <span className="font-medium">{o.name}</span>
                <ArrowRight className="h-4 w-4 text-ink-400 group-hover:text-signal-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
