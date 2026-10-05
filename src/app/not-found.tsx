import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center gap-5 py-20">
      <p className="font-mono text-sm text-signal-700">404 · NOT FOUND</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">This page took a different route.</h1>
      <p className="max-w-lg text-lg text-slate">The link may be old or mistyped. Try one of these instead.</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/track" variant="ghost">Track a shipment</ButtonLink>
        <ButtonLink href="/quote" variant="ghost">Request a quote</ButtonLink>
      </div>
    </section>
  );
}
