import Image from "next/image";
import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import { barnProjectImagesFlat } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Siding Pittsburgh PA | Board & Batten for Homes",
  description: "Residential metal board-and-batten and commercial metal wall systems in Pittsburgh, Cranberry Township, Butler County, Mercer County, and Erie County, PA.",
  path: "/metal-siding",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="METAL SIDING • WESTERN PENNSYLVANIA"
        title="METAL SIDING THAT LOOKS CLEAN AND LASTS."
        copy="Metal siding for homes—including board-and-batten—and wall panels for commercial buildings across Western Pennsylvania."
        kind="siding"
        contain
      />
      <section className="editorial wrap">
        <SectionHead kicker="RESIDENTIAL &amp; COMMERCIAL" title="WALLS WITH A FINISHED LOOK." />
        <div className="editorial__grid">
          <p className="lead">Metal siding updates an exterior with a durable finish and clean vertical lines.</p>
          <div>
            <p>
              For homes, we often install metal board-and-batten—a residential profile with wider boards and distinct battens, not an industrial panel. It works as a full exterior or an accent on modern and modern-farmhouse houses.
            </p>
            <p>
              For commercial buildings, metal wall panels give large surfaces a consistent look. Corners, openings, the base of the wall, and roof edges are planned as one job so the finished wall holds up and looks complete.
            </p>
          </div>
        </div>
        <div className="asset-panel wide-visual">
          <Image
            src={barnProjectImagesFlat.afterHero.src}
            alt={barnProjectImagesFlat.afterHero.alt}
            fill
            sizes="(max-width: 800px) 100vw, 80vw"
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
        </div>
        <AssetPanel kind="commercial" className="wide-visual" contain />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">RESIDENTIAL</p>
          <h2>Board-and-batten for homes.</h2>
          <p>A vertical metal look that still feels like a house—durable, low-maintenance, and finished at every opening.</p>
        </article>
        <article>
          <p className="eyebrow">COMMERCIAL</p>
          <h2>Metal walls for businesses.</h2>
          <p>Strong, consistent wall panels for offices, shops, warehouses, and other commercial buildings.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Metal siding service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
