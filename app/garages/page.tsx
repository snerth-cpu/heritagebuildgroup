import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Garage Construction Pittsburgh PA | Detached & Attached",
  description:
    "HBG Construction builds garages for homes and properties across Western Pennsylvania—detached, attached, and shop-style. Full-service construction from planning to completion.",
  path: "/garages",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="GARAGES • WESTERN PENNSYLVANIA"
        title="GARAGES BUILT AROUND HOW YOU USE THEM."
        copy="Detached, attached, and shop-style garages planned for vehicles, storage, and daily access—built from the first layout through completion."
        kind="installation"
      />
      <section className="editorial wrap">
        <SectionHead kicker="FROM PLAN TO COMPLETION" title="MORE THAN A BOX FOR CARS." />
        <div className="editorial__grid">
          <p className="lead">A useful garage starts with doors, height, storage, and how it sits with the house—not a stock footprint alone.</p>
          <div>
            <h2 className="subhead">Detached and attached garages</h2>
            <p>
              Whether the garage stands alone or ties into the home, we plan openings, roof lines, and finishes so the building looks and works like part of the property.
            </p>
            <h2 className="subhead">Shop-style and oversized needs</h2>
            <p>
              Extra height, wider doors, and work space change the structure. We write those requirements into the scope up front so the build matches how you will use it.
            </p>
            <h2 className="subhead">Full-service from plan to finish</h2>
            <p>
              HBG Construction handles garage projects as full-service construction—clear proposals, materials, installation, and one point of contact through completion. For larger post-frame structures, see{" "}
              <Link className="text-link" href="/pole-buildings">pole buildings</Link>.
            </p>
          </div>
        </div>
        <AssetPanel kind="installation" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">FOR THE HOME</p>
          <h2>Fit the house and the driveway.</h2>
          <p>Garage size, doors, and exterior finish are planned around the home, the approach, and how you want it to look when the job is done.</p>
        </article>
        <article>
          <p className="eyebrow">FOR THE PROPERTY</p>
          <h2>Storage and shop space that lasts.</h2>
          <p>When the garage doubles as storage or a workshop, layout and durability come first—with a finish that holds up to daily use.</p>
        </article>
      </section>
      <section className="related-links wrap">
        <p className="eyebrow">RELATED SERVICES</p>
        <div>
          <h2>Buildings and additions</h2>
          <nav aria-label="Related construction services">
            <Link href="/pole-buildings">Pole Buildings<span>↗</span></Link>
            <Link href="/additions">Additions<span>↗</span></Link>
            <Link href="/buildings">All buildings<span>↗</span></Link>
            <Link href="/metal-siding">Metal Siding<span>↗</span></Link>
          </nav>
        </div>
      </section>
      <ServiceAreaLinks heading="Garage construction service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
