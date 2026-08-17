import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Siding Pittsburgh PA | Board & Batten for Homes",
  description: "Residential metal board and batten and commercial metal wall systems in Pittsburgh, Cranberry Township, Butler County, and Mercer County, PA.",
  path: "/metal-siding",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="METAL SIDING • WESTERN PENNSYLVANIA"
        title="METAL SIDING WITH ARCHITECTURAL DISCIPLINE."
        copy="Modern metal siding for homes—including residential board-and-batten—and commercial wall systems across Pittsburgh and Western Pennsylvania."
        kind="siding"
      />
      <section className="editorial wrap">
        <SectionHead kicker="WALL SYSTEMS" title="DETAIL THAT CHANGES THE WHOLE EXTERIOR." />
        <div className="editorial__grid">
          <p className="lead">Metal siding can unify an exterior, sharpen its geometry, and create a distinct architectural identity.</p>
          <div>
            <h2 className="subhead">Vertical metal siding</h2>
            <p>Strong shadow lines and measured panel layouts create a confident, modern expression. On homes, that vertical character is often achieved with a board-and-batten profile rather than a commercial rib. The layout should relate to the building’s openings, rooflines, corners, and proportions—not simply fill the wall.</p>
            <h2 className="subhead">Coordinated wall assemblies</h2>
            <p>Openings, base conditions, trim, corners, penetrations, and transitions into other materials are planned as parts of one system. That coordination is central to both the appearance and performance of the finished exterior.</p>
            <h2 className="subhead">Renovation and new work</h2>
            <p>Metal wall systems can support a complete exterior transformation or a focused part of a larger scope. We begin with existing conditions and determine how roofing, siding, cladding, and trim should work together.</p>
          </div>
        </div>
        <AssetPanel kind="detail" className="wide-visual" />
      </section>
      <section className="transformation">
        <div className="wrap">
          <SectionHead kicker="RESIDENTIAL BOARD AND BATTEN" title="METAL BOARD & BATTEN FOR HOMES." />
          <div className="editorial__grid">
            <p className="lead">Metal board and batten siding gives homeowners a vertical metal siding profile with residential character: metal durability and low maintenance, without an industrial appearance.</p>
            <div>
              <h2 className="subhead">A residential profile, not an industrial panel</h2>
              <p>Commercial and industrial metal wall systems often use tight ribs, corrugation, or utility panels that read as a working building. Residential metal board and batten is a different profile: wider vertical boards with distinct battens, closer to traditional wood board-and-batten than to a shop-building wall. The broader rhythm, quieter shadow lines, and coordinated trim are what keep modern metal siding looking like architecture on a home.</p>
              <h2 className="subhead">Modern, contemporary, and modern-farmhouse homes</h2>
              <p>The profile belongs on modern, contemporary, and modern-farmhouse houses—as a full exterior or a precise accent. Heritage Build Group installs metal board and batten siding in Pittsburgh and across Western Pennsylvania as the contractor on the project. We specify a manufacturer’s residential system for the house and install it with the same discipline at openings, corners, the foundation, and the roof edge as the rest of the envelope.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">RESIDENTIAL METAL SIDING</p>
          <h2>A refined material for the complete home.</h2>
          <p>Residential metal siding can create a contemporary exterior or introduce a precise accent within a broader material palette. Metal board and batten is often the profile we recommend when the house should feel modern or modern-farmhouse rather than commercial. A successful result depends on proportion, transitions, window and door trim, and how the walls meet the roof and foundation.</p>
        </article>
        <article>
          <p className="eyebrow">COMMERCIAL METAL SIDING</p>
          <h2>Durable wall systems with a clear rhythm.</h2>
          <p>For commercial and working properties, metal siding supports durable protection and a consistent visual identity. Defined elevations, coordinated trim, and thoughtful sequencing help translate the intended scope into disciplined field work.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Metal siding service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
