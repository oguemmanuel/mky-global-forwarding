import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink, Fill } from "@/components/ui";
import { company, features } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact MKY Global Forwarding in Kraków by phone, email or WhatsApp.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address.street}, ${company.address.postalCode} ${company.address.city}`)}`;
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        title="Talk to the MKY team"
        lead="For a price, the quote form is fastest. For anything else, message us on WhatsApp, call or email."
      >
        <div className="pt-2">
          <ButtonLink href="/quote">Request a quote</ButtonLink>
        </div>
      </PageHero>
      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_380px]">
          {features.contactForm ? (
            <ContactForm />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={company.whatsapp} target="_blank" rel="noopener" className="rounded-2xl bg-[#1fa855] p-6 text-white hover:bg-[#1a9049]">
                <MessageCircle className="h-6 w-6" />
                <p className="mt-6 text-xl font-semibold">WhatsApp</p>
                <p className="mt-1 text-white/85">Fastest reply. Send your VIN or question.</p>
              </a>
              <a href={`tel:${company.phoneHref}`} className="rounded-2xl bg-white p-6 ring-1 ring-line hover:ring-ink-300">
                <Phone className="h-6 w-6 text-signal-500" />
                <p className="mt-6 text-xl font-semibold num">{company.phone}</p>
                <p className="mt-1 text-slate">Call the office</p>
              </a>
              <a href={`mailto:${company.email}`} className="rounded-2xl bg-white p-6 ring-1 ring-line hover:ring-ink-300 sm:col-span-2">
                <Mail className="h-6 w-6 text-signal-500" />
                <p className="mt-6 break-all text-xl font-semibold">{company.email}</p>
                <p className="mt-1 text-slate">For documents and booking details</p>
              </a>
            </div>
          )}
          <aside className="space-y-4">
            <div className="space-y-5 rounded-2xl bg-ink-900 p-6 text-white">
              <Item Icon={MapPin} k="Office">
                {company.address.street}
                <br />
                {company.address.postalCode} {company.address.city}, {company.address.country}
                <br />
                <a href={mapsUrl} target="_blank" rel="noopener" className="text-sm text-signal-400 hover:underline">Open in Google Maps</a>
              </Item>
              <Item Icon={Phone} k="Phone"><a href={`tel:${company.phoneHref}`} className="num hover:underline">{company.phone}</a></Item>
              <Item Icon={Mail} k="Email"><a href={`mailto:${company.email}`} className="break-all hover:underline">{company.email}</a></Item>
              <Item Icon={MessageCircle} k="WhatsApp"><a href={company.whatsapp} target="_blank" rel="noopener" className="hover:underline">Chat with a coordinator</a></Item>
            </div>
            <div className="rounded-2xl bg-white p-6 text-sm ring-1 ring-line">
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">Hours</p>
              <p className="mt-1"><Fill value={company.hours} /></p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Item({ Icon, k, children }: { Icon: typeof Phone; k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-1 h-4 w-4 shrink-0 text-sky-400" />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">{k}</p>
        <div className="mt-1 text-[15px] text-ink-100">{children}</div>
      </div>
    </div>
  );
}
