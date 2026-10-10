import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Garage Construction Pittsburgh PA | Detached & Attached",
  description:
    "HBG Construction builds detached, attached, and shop-style garages across Western Pennsylvania.",
  path: "/garages",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="GARAGES • WESTERN PENNSYLVANIA"
        title="GARAGES BUILT AROUND HOW YOU USE THEM."
        copy="Detached, attached, and shop-style garages for vehicles, storage, and work space."
        kind="installation"
      />
      <section className="editorial wrap">
        <SectionHead kicker="GARAGE CONSTRUCTION" title="RIGHT SIZE, RIGHT DOORS, RIGHT FINISH." />
        <div className="editorial__grid">
          <p className="lead">A useful garage starts with how you park, store, and work—not a stock footprint alone.</p>
          <div>
            <p>
              We build detached and attached garages, including taller shop-style buildings with wider doors or extra work space. Exterior finish can include metal roofing or siding when you want a durable, low-maintenance look.
            </p>
            <p>
              For larger post-frame structures, see{" "}
              <Link className="text-link" href="/pole-buildings">pole buildings</Link>.
            </p>
          </div>
        </div>
        <AssetPanel kind="installation" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">FOR THE HOME</p>
          <h2>Fit the house and driveway.</h2>
          <p>Size, doors, and finish planned around the home and how you approach the building.</p>
        </article>
        <article>
          <p className="eyebrow">FOR THE PROPERTY</p>
          <h2>Storage and shop space.</h2>
          <p>When the garage doubles as storage or a workshop, layout and durability come first.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Garage construction service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
