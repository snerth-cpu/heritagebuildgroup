import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing Pittsburgh PA | Standing Seam Roofs",
  description: "Standing seam metal roofing for homes and commercial properties in Pittsburgh, Cranberry Township, Butler County, Mercer County, and Erie County, PA.",
  path: "/metal-roofing",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="METAL ROOFING • WESTERN PENNSYLVANIA"
        title="METAL ROOFING BUILT TO LAST."
        copy="Standing seam and metal roofing for homes and commercial buildings across Pittsburgh and Western Pennsylvania."
        kind="roof"
      />
      <section className="editorial wrap">
        <SectionHead kicker="RESIDENTIAL &amp; COMMERCIAL" title="ROOFS PLANNED FOR THE BUILDING." />
        <div className="editorial__grid">
          <p className="lead">Standing seam metal roofing gives clean lines and long service when the edges and flashings are done right.</p>
          <div>
            <p>
              We install metal roofing for houses and commercial buildings. Scope covers the roof shape, drainage, penetrations, and where the roof meets walls or other materials—so the finished roof looks and performs as one system.
            </p>
            <p>
              On homes, panel size, color, and trim shape the look of the whole house. On commercial roofs, we plan around access, equipment, and how the property stays in use during the job.
            </p>
          </div>
        </div>
        <AssetPanel kind="installation" className="wide-visual" />
        <AssetPanel kind="roof" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">RESIDENTIAL</p>
          <h2>Metal roofs for homes.</h2>
          <p>Standing seam roofing that fits the house—trim, gutters, and transitions included in the plan.</p>
        </article>
        <article>
          <p className="eyebrow">COMMERCIAL</p>
          <h2>Metal roofs for working buildings.</h2>
          <p>Commercial metal roofing scoped around drainage, rooftop equipment, and daily operations.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Metal roofing service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
