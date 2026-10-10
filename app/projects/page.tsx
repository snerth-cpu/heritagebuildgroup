import Image from "next/image";
import Link from "next/link";
import { AssetPanel, ProjectCTA, SectionHead } from "@/components/ui";
import { Mark } from "@/components/brand-logo";
import { barnProjectImagesFlat } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Projects",
  description: "Project photos from HBG Construction metal roofing, metal siding, and exterior builds across Western Pennsylvania.",
  path: "/projects",
});

export default function Page() {
  return (
    <>
      <section className="simple-hero wrap">
        <Mark size="section" className="brand--ink" />
        <p className="eyebrow">PROJECTS</p>
        <h1>COMPLETED WORK.</h1>
        <p>Photos from real metal roofing, siding, and building projects.</p>
      </section>
      <section className="project-list wrap">
        <SectionHead kicker="GALLERY" title="RECENT PROJECTS" />
        <div className="project-list__stack">
          <Link href="/projects/complete-metal-exterior-transformation" className="project-card">
            <AssetPanel kind="after" />
            <div>
              <p className="eyebrow">METAL ROOFING • METAL SIDING</p>
              <h2>COMMERCIAL EXTERIOR UPDATE</h2>
              <p>Before, during, and finished photos of a full metal exterior.</p>
              <span>VIEW PHOTOS ↗</span>
            </div>
          </Link>
          <Link href="/projects/black-board-and-batten-barn" className="project-card">
            <div className="asset-panel">
              <Image
                src={barnProjectImagesFlat.afterHero.src}
                alt={barnProjectImagesFlat.afterHero.alt}
                fill
                sizes="(max-width: 800px) 100vw, 60vw"
                style={{ objectFit: "cover", objectPosition: "center 40%" }}
              />
            </div>
            <div>
              <p className="eyebrow">METAL SIDING</p>
              <h2>BLACK BOARD-AND-BATTEN BARN</h2>
              <p>Before, during, and after photos from a barn siding project.</p>
              <span>VIEW PHOTOS ↗</span>
            </div>
          </Link>
        </div>
      </section>
      <ProjectCTA />
    </>
  );
}
