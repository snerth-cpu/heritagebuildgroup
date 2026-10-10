import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pole Buildings Pittsburgh PA | Post-Frame Construction",
  description:
    "HBG Construction builds pole buildings and post-frame structures—barns, garages, workshops, storage, and light-commercial—across Western Pennsylvania.",
  path: "/pole-buildings",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="POLE BUILDINGS • WESTERN PENNSYLVANIA"
        title="POLE BUILDINGS BUILT TO WORK."
        copy="Post-frame buildings for barns, shops, storage, and light-commercial use across Western Pennsylvania."
        kind="commercial"
      />
      <section className="editorial wrap">
        <SectionHead kicker="POST-FRAME" title="SIZED FOR HOW YOU USE THE PROPERTY." />
        <div className="editorial__grid">
          <p className="lead">Layout, doors, height, and finish should match the work the building has to do.</p>
          <div>
            <p>
              We build pole buildings for agricultural, storage, shop, and light-commercial needs. Scope covers structure, openings, roof, and exterior finish—including metal roofing and siding when that is part of the project.
            </p>
            <p>
              Related:{" "}
              <Link className="text-link" href="/garages">garages</Link>,{" "}
              <Link className="text-link" href="/metal-roofing">metal roofing</Link>, and{" "}
              <Link className="text-link" href="/metal-siding">metal siding</Link>.
            </p>
          </div>
        </div>
        <AssetPanel kind="commercial" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">BARNS &amp; STORAGE</p>
          <h2>Practical buildings for the property.</h2>
          <p>Access, clear height, and doors planned around equipment, livestock, or storage.</p>
        </article>
        <article>
          <p className="eyebrow">SHOPS &amp; COMMERCIAL</p>
          <h2>Space for work that lasts.</h2>
          <p>Workshops and light-commercial post-frame buildings scoped for daily use and a durable finish.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Pole building service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
