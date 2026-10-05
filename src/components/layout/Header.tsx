"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/site";
import { useLocale } from "@/i18n/LocaleProvider";
import { locales } from "@/i18n/dictionaries";
import { ButtonLink, Logo } from "@/components/ui";

export function Header() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  // The menu is tied to the page it was opened on, so navigating closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled || open ? "border-white/10 bg-ink-950/85 backdrop-blur-xl" : "border-transparent bg-ink-950",
      )}
    >
      <div className="container-x flex h-16 items-center gap-6">
        <Link href="/" aria-label="MKY Global Forwarding home" className="shrink-0">
          <Logo dark />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx(
                "rounded-md px-3 py-2 text-[15px] transition-colors",
                isActive(item.href) ? "bg-white/10 font-medium text-white" : "text-ink-300 hover:text-white",
              )}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <LocaleSwitch locale={locale} onChange={setLocale} />
          <ButtonLink href="/track" variant="ghost-dark" size="sm">
            {t.cta.track}
          </ButtonLink>
          <ButtonLink href="/quote" size="sm">
            {t.cta.quote}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white ring-1 ring-white/20 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          {open ? t.close : t.menu}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-white/10 bg-ink-950 text-white lg:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-center justify-between border-b border-white/10 py-3.5 text-base"
              >
                {t.nav[item.key]}
                <span className="font-mono text-xs text-ink-400">{item.href}</span>
              </Link>
            ))}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <ButtonLink href="/quote">{t.cta.quote}</ButtonLink>
              <ButtonLink href="/track" variant="ghost-dark">
                {t.cta.track}
              </ButtonLink>
              <LocaleSwitch locale={locale} onChange={setLocale} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function LocaleSwitch({ locale, onChange }: { locale: string; onChange: (l: "en" | "pl") => void }) {
  return (
    <div role="group" aria-label="Language" className="flex rounded-lg bg-white/5 p-0.5 font-mono text-xs ring-1 ring-white/10">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          onClick={() => onChange(l)}
          className={clsx(
            "rounded-md px-2 py-1 uppercase transition",
            locale === l ? "bg-white text-ink-900" : "text-ink-300 hover:text-white",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
