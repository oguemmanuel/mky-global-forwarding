import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Fill } from "@/components/ui";
import { TODO, company } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  robots: { index: false },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/", label: "Home" }, { label: "Privacy" }]} title="Privacy policy" />
      <section className="py-14">
        <div className="container-x max-w-3xl space-y-6 text-[15px] leading-relaxed text-ink-700">
          <p>
            <Fill value={TODO("Full GDPR privacy policy to be supplied or approved by MKY's legal adviser before launch")} />
          </p>
          <p>
            This website collects the details you enter in the quote and contact forms (name, company, email, phone and shipment details) so{" "}
            {company.name} can reply to your request. Data controller: <Fill value={company.legalName} />, {company.address.street},{" "}
            {company.address.postalCode} {company.address.city}, {company.address.country}. Contact: {company.email}.
          </p>
        </div>
      </section>
    </>
  );
}
