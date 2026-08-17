import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing Pittsburgh PA | Standing Seam Roofs",
  description: "Premium standing seam metal roofing for homes and commercial properties in Pittsburgh, Cranberry Township, Butler County, and Mercer County, PA.",
  path: "/metal-roofing",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="METAL ROOFING • WESTERN PENNSYLVANIA"
        title="METAL ROOFING BUILT TO LAST."
        copy="Standing seam and metal roofing for homes and commercial properties across Pittsburgh and Western Pennsylvania."
        kind="roof"
      />
      <section className="editorial wrap">
        <SectionHead kicker="BUILT FOR THE BUILDING" title="MORE THAN PANELS ON A ROOF." />
        <div className="editorial__grid">
          <p className="lead">A metal roof is more than panels. Flashings, edges, drainage, and details all have to work together.</p>
          <div>
            <h2 className="subhead">Standing seam metal roofing</h2>
            <p>Standing seam roofing gives a roof clean vertical lines and hides most of the fasteners. It fits homes and commercial buildings, and it holds up when the details are done right.</p>
            <h2 className="subhead">Details that keep water out</h2>
            <p>A roof lasts when the details are right—ridges, valleys, eaves, pipes, walls, and where the roof meets other materials. We plan the job around your actual roof, not a one-size-fits-all package.</p>
            <h2 className="subhead">Residential and commercial roofs</h2>
            <p>A home and a commercial building have different access, drainage, and scheduling needs. We plan the materials, the install, and the communication around the building in front of us.</p>
          </div>
        </div>
        <AssetPanel kind="installation" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">RESIDENTIAL METAL ROOFING</p>
          <h2>A roof that looks good and lasts.</h2>
          <p>On a home, metal roofing can shape how the whole house looks. Panel size, color, trim, gutters, and how the roof meets the walls all matter.</p>
        </article>
        <article>
          <p className="eyebrow">COMMERCIAL METAL ROOFING</p>
          <h2>Clear plans for working buildings.</h2>
          <p>Commercial metal roofing has to work around how the property is used, roof access, equipment, and the walls. When roofing and siding are both in play, planning them together keeps the job cleaner.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Metal roofing service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
