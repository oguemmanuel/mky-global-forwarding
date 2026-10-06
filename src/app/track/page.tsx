import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { demoReferences } from "@/lib/tracking";
import { TrackClient } from "./TrackClient";

export const metadata: Metadata = {
  title: "Track your vehicle by VIN",
  description: "Track your vehicle shipment with MKY by VIN / chassis number: documents, loading, sailing and release.",
  alternates: { canonical: "/track" },
};

export default function TrackPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Track" }]}
        title="Track your vehicle"
        lead="Enter the 17-character VIN / chassis number, or your MKY reference."
      />
      <section className="py-14 lg:py-20">
        <div className="container-x max-w-4xl">
          <Suspense>
            <TrackClient demoRefs={demoReferences} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
