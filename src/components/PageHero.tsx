import Link from "next/link";

export function PageHero({
  crumbs,
  title,
  lead,
  children,
}: {
  crumbs: { href?: string; label: string }[];
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div aria-hidden className="grid-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(25,48,79,0.9),transparent_70%)]" />
      <div className="container-x relative space-y-6 py-16 lg:py-24">
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.14em] text-ink-400">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span className="mx-2 text-ink-600">/</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink-300">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="display max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {lead && <p className="max-w-2xl text-lg leading-relaxed text-ink-300">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
