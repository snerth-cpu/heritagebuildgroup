import Image from "next/image";
import Link from "next/link";
import { AssetPanel, ProjectCTA, SectionHead } from "@/components/ui";
import { Mark } from "@/components/brand-logo";
import { barnProjectImages } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Projects",
  description: "Explore genuine HBG Construction metal roofing, metal siding, and complete exterior project photography and case studies.",
  path: "/projects",
});

export default function Page() {
  return (
    <>
      <section className="simple-hero wrap">
        <Mark size="section" className="brand--ink" />
        <p className="eyebrow">METAL EXTERIOR PROJECTS</p>
        <h1>REAL METAL<br />EXTERIOR PROJECTS.</h1>
        <p>Real photos of metal roofing, metal siding, finished exteriors, and the work in between.</p>
      </section>
      <section className="project-list wrap">
        <SectionHead kicker="FEATURED PROJECTS" title="DOCUMENTED EXTERIOR WORK" />
        <div className="project-list__stack">
          <Link href="/projects/complete-metal-exterior-transformation" className="project-card">
            <AssetPanel kind="after" />
            <div>
              <p className="eyebrow">METAL ROOFING • METAL SIDING • EXTERIOR RENOVATION</p>
              <h2>A COMPLETE EXTERIOR UPDATE.</h2>
              <p>See the prep, installation, and details behind this full exterior project.</p>
              <span>VIEW CASE STUDY ↗</span>
            </div>
          </Link>
          <Link href="/projects/black-board-and-batten-barn" className="project-card">
            <div className="asset-panel">
              <Image
                src={barnProjectImages.afterHero.src}
                alt={barnProjectImages.afterHero.alt}
                fill
                sizes="(max-width: 800px) 100vw, 60vw"
                style={{ objectFit: "cover", objectPosition: "center 40%" }}
              />
            </div>
            <div>
              <p className="eyebrow">METAL SIDING • EXTERIOR RENOVATION</p>
              <h2>FROM RED BARN TO BLACK BOARD-AND-BATTEN.</h2>
              <p>Before, during, and after photos from a complete barn siding transformation.</p>
              <span>VIEW CASE STUDY ↗</span>
            </div>
          </Link>
        </div>
        <p className="project-note">
          Future case studies will include verified location, services, materials, photographs, and links to the related{" "}
          <Link href="/metal-roofing">service</Link> and <Link href="/service-areas">service-area pages</Link>. Unverified details will not be added.
        </p>
      </section>
      <ProjectCTA />
    </>
  );
}
