import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { demoReferences } from "@/lib/tracking";
import { TrackClient } from "./TrackClient";

export const metadata: Metadata = {
  title: "Track a shipment",
  description: "Track your MKY shipment by reference, air waybill, bill of lading or container number.",
  alternates: { canonical: "/track" },
};

export default function TrackPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Track" }]}
        title="Track a shipment"
        lead="Enter your MKY reference, air waybill, bill of lading or container number."
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
