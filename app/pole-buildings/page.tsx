import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pole Buildings Pittsburgh PA | Post-Frame Construction",
  description:
    "HBG Construction builds pole buildings and post-frame structures—barns, garages, workshops, storage, agricultural, and light-commercial—across Western Pennsylvania.",
  path: "/pole-buildings",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="POLE BUILDINGS • WESTERN PENNSYLVANIA"
        title="POLE BUILDINGS BUILT TO WORK."
        copy="Post-frame pole buildings for barns, garages, workshops, storage, ag, and light-commercial use—planned and built from the first layout through completion."
        kind="commercial"
      />
      <section className="editorial wrap">
        <SectionHead kicker="POST-FRAME CONSTRUCTION" title="A CLEAR BUILDING, NOT A GENERIC PACKAGE." />
        <div className="editorial__grid">
          <p className="lead">A pole building should fit how you use the land, the doors, the roof, and the finish—not a one-size layout dropped on the site.</p>
          <div>
            <h2 className="subhead">Barns, shops, and storage</h2>
            <p>
              We start with how the building will be used: equipment, livestock or storage, shop space, and access. Layout, openings, roof, and exterior finish are written into one scope so the structure works when it is done.
            </p>
            <h2 className="subhead">Built as a full project</h2>
            <p>
              HBG Construction manages pole buildings as full projects—planning, materials, installation, and communication on one team from start to finish.
            </p>
            <h2 className="subhead">Ready for metal exteriors</h2>
            <p>
              Many pole buildings finish with metal roofing and siding. When that is part of the job, we plan the structure and the exterior together so edges, trim, and the look line up. See also{" "}
              <Link className="text-link" href="/metal-roofing">metal roofing</Link> and{" "}
              <Link className="text-link" href="/metal-siding">metal siding</Link>.
            </p>
          </div>
        </div>
        <AssetPanel kind="commercial" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">BARNS &amp; AG</p>
          <h2>Buildings that match the property.</h2>
          <p>Agricultural and barn-style post-frame buildings are planned around access, clear height, doors, and how the land is used day to day.</p>
        </article>
        <article>
          <p className="eyebrow">SHOPS &amp; COMMERCIAL</p>
          <h2>Practical space for work and storage.</h2>
          <p>Workshops, storage buildings, and light-commercial post-frame structures are scoped around equipment, operations, and a durable metal finish when needed.</p>
        </article>
      </section>
      <section className="related-links wrap">
        <p className="eyebrow">RELATED SERVICES</p>
        <div>
          <h2>Buildings and additions</h2>
          <nav aria-label="Related construction services">
            <Link href="/garages">Garages<span>↗</span></Link>
            <Link href="/additions">Additions<span>↗</span></Link>
            <Link href="/buildings">All buildings<span>↗</span></Link>
            <Link href="/commercial">Commercial<span>↗</span></Link>
          </nav>
        </div>
      </section>
      <ServiceAreaLinks heading="Pole building service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
