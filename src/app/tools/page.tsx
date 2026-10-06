import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { features } from "@/content/site";
import { ChargeableWeightCalculator, ContainerChecker, ContainerGuide, IncotermsExplorer } from "@/components/tools/Tools";

export const metadata: Metadata = {
  title: "Free freight tools: chargeable weight, CBM, Incoterms",
  description: "Calculate air and road chargeable weight, LCL revenue tonnes and CBM, check container numbers and see who pays what under each Incoterm.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  if (!features.tools) notFound();
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Tools" }]}
        title="Freight tools for shippers"
        lead="Work out what you'll be charged for, check a container number and understand your Incoterm before you book."
      />
      <section className="py-16 lg:py-20">
        <div className="container-x space-y-6">
          <ChargeableWeightCalculator />
          <div className="grid gap-6 lg:grid-cols-2">
            <ContainerChecker />
            <ContainerGuide />
          </div>
          <IncotermsExplorer />
        </div>
      </section>
    </>
  );
}
