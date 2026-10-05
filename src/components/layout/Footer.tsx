"use client";

import Link from "next/link";
import { company, services } from "@/content/site";
import { useLocale } from "@/i18n/LocaleProvider";
import { Fill, Logo } from "@/components/ui";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo dark />
          <p className="max-w-xs text-sm leading-relaxed">{t.footer.tagline}</p>
        </div>
        <FooterCol title={t.footer.services}>
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="hover:text-white">
                {s.name}
              </Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title={t.footer.company}>
          <li><Link href="/about" className="hover:text-white">{t.nav.about}</Link></li>
          <li><Link href="/tools" className="hover:text-white">{t.nav.tools}</Link></li>
          <li><Link href="/track" className="hover:text-white">{t.cta.track}</Link></li>
          <li><Link href="/quote" className="hover:text-white">{t.cta.quote}</Link></li>
          <li><Link href="/contact" className="hover:text-white">{t.nav.contact}</Link></li>
        </FooterCol>
        <FooterCol title={t.footer.contact}>
          <li>
            {company.address.street}, {company.address.postalCode} {company.address.city}, {company.address.country}
          </li>
          <li><a href={`tel:${company.phoneHref}`} className="hover:text-white num">{company.phone}</a></li>
          <li><a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a></li>
          <li><Fill value={company.hours} /></li>
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-6 text-xs">
          <span>
            © {year} {company.name}. <Fill value={company.nip} />
          </span>
          <span className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <a href={company.whatsapp} target="_blank" rel="noopener" className="hover:text-white">WhatsApp</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-white">{title}</h3>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}
