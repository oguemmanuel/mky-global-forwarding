import Link from "next/link";
import clsx from "clsx";
import { isTodo, type MaybeTodo } from "@/content/site";

type BtnProps = {
  href: string;
  variant?: "primary" | "secondary" | "ghost-dark" | "ghost";
  size?: "md" | "sm" | "lg";
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({ href, variant = "primary", size = "md", className, children }: BtnProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors whitespace-nowrap",
        size === "sm" && "h-9 px-3.5 text-sm",
        size === "md" && "h-11 px-5 text-[15px]",
        size === "lg" && "h-12 px-6 text-base",
        variant === "primary" && "bg-signal-500 text-white hover:bg-signal-600 shadow-[0_1px_0_rgb(255_255_255/0.25)_inset]",
        variant === "secondary" && "bg-ink-900 text-white hover:bg-ink-700",
        variant === "ghost" && "text-ink-900 ring-1 ring-inset ring-line hover:bg-white",
        variant === "ghost-dark" && "text-white ring-1 ring-inset ring-white/20 hover:bg-white/10",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Renders real content, or a clearly marked slot when MKY still needs to supply it */
export function Fill({ value, className }: { value: MaybeTodo<string>; className?: string }) {
  if (isTodo(value)) {
    return (
      <span
        title="Content to be supplied by MKY"
        className={clsx(
          "rounded border border-dashed border-signal-500/60 bg-signal-500/10 px-1.5 font-mono text-[0.8em] text-signal-700 [box-decoration-break:clone]",
          className,
        )}
      >
        [{value.label}]
      </span>
    );
  }
  return <span className={className}>{value}</span>;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  dark,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-2xl space-y-4", className)}>
      <p className={dark ? "eyebrow-dark" : "eyebrow"}>{eyebrow}</p>
      <h2 className={clsx("display-md text-3xl sm:text-[2.5rem]", dark ? "text-white" : "text-ink-900")}>{title}</h2>
      {lead && <p className={clsx("text-lg leading-relaxed", dark ? "text-ink-300" : "text-slate")}>{lead}</p>}
    </div>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="7" className={dark ? "fill-white" : "fill-ink-900"} />
        <path d="M7 22V10l5 6 4-6 4 6 5-6v12" fill="none" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" className="stroke-signal-500" />
      </svg>
      <span className="leading-none">
        <span className={clsx("block text-[17px] font-semibold tracking-tight", dark ? "text-white" : "text-ink-900")}>MKY</span>
        <span className={clsx("block font-mono text-[9.5px] uppercase tracking-[0.18em]", dark ? "text-ink-300" : "text-slate")}>
          Global Forwarding
        </span>
      </span>
    </span>
  );
}

export function StatusDot({ tone = "ok" }: { tone?: "ok" | "warn" | "sky" }) {
  const c = tone === "ok" ? "bg-ok-500" : tone === "warn" ? "bg-warn-500" : "bg-sky-400";
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={clsx("absolute inset-0 rounded-full animate-pulse-ring", c)} />
      <span className={clsx("relative inline-flex h-2 w-2 rounded-full", c)} />
    </span>
  );
}
