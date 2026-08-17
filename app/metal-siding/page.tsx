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
        title="METAL SIDING THAT LOOKS CLEAN AND LASTS."
        copy="Metal siding for homes—including board-and-batten—and wall panels for commercial buildings across Pittsburgh and Western Pennsylvania."
        kind="siding"
      />
      <section className="editorial wrap">
        <SectionHead kicker="THE WALLS" title="THE DETAILS MAKE THE WHOLE WALL." />
        <div className="editorial__grid">
          <p className="lead">Metal siding can pull an exterior together and give a building a cleaner, more finished look.</p>
          <div>
            <h2 className="subhead">Vertical metal siding</h2>
            <p>Vertical panels create strong lines and a modern look. On homes, that often means a board-and-batten profile rather than a commercial rib. The layout should follow the windows, doors, corners, and rooflines—not just cover the wall.</p>
            <h2 className="subhead">Trim, corners, and openings</h2>
            <p>Windows, doors, the base of the wall, corners, and where siding meets other materials are planned as one job. That is what makes the finished wall look right and hold up.</p>
            <h2 className="subhead">Renovation and new work</h2>
            <p>Metal siding can be a full exterior update or one part of a larger project. We start with what is already there and figure out how roofing, siding, and trim should work together.</p>
          </div>
        </div>
        <AssetPanel kind="detail" className="wide-visual" />
      </section>
      <section className="transformation">
        <div className="wrap">
          <SectionHead kicker="RESIDENTIAL BOARD AND BATTEN" title="METAL BOARD & BATTEN FOR HOMES." />
          <div className="editorial__grid">
            <p className="lead">Metal board-and-batten siding gives homeowners a vertical metal look that still feels like a house: durable and low-maintenance, without looking like a shop building.</p>
            <div>
              <h2 className="subhead">A residential profile, not an industrial panel</h2>
              <p>Commercial metal walls often use tight ribs or utility panels that look like a working building. Metal board-and-batten is different: wider vertical boards with distinct battens, closer to traditional wood board-and-batten. The wider spacing and matching trim keep it looking like a home.</p>
              <h2 className="subhead">Modern, contemporary, and modern-farmhouse homes</h2>
              <p>It works on modern, contemporary, and modern-farmhouse houses—as a full exterior or an accent. Heritage Build Group installs metal board-and-batten siding in Pittsburgh and across Western Pennsylvania. We pick a manufacturer’s residential system for the house and install it carefully at openings, corners, the foundation, and the roof edge.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">RESIDENTIAL METAL SIDING</p>
          <h2>A clean look for the whole house.</h2>
          <p>Metal siding can cover a whole home or serve as an accent. Metal board-and-batten is often the right profile when the house should feel modern or modern-farmhouse, not commercial. Panel size, trim, and how the walls meet the roof and foundation make the difference.</p>
        </article>
        <article>
          <p className="eyebrow">COMMERCIAL METAL SIDING</p>
          <h2>Strong walls with a consistent look.</h2>
          <p>On commercial buildings, metal siding is a durable, low-maintenance wall with a consistent look. A clear plan for each wall, matching trim, and a plan for the order of work keep the job on track.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Metal siding service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
