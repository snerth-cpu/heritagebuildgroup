import Link from "next/link";
import { AssetPanel, ProjectCTA, SectionHead } from "@/components/ui";
import { Mark } from "@/components/brand-logo";
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
        <SectionHead kicker="FEATURED PROJECT" title="BLACK BOARD-AND-BATTEN BARN EXTERIOR" />
        <Link href="/projects/complete-metal-exterior-transformation" className="project-card">
          <AssetPanel kind="after" />
          <div>
            <p className="eyebrow">METAL SIDING • EXTERIOR RENOVATION</p>
            <h2>FROM RED METAL TO BLACK BOARD-AND-BATTEN.</h2>
            <p>True before photos, installation progress, and the finished barn exterior.</p>
            <span>VIEW CASE STUDY ↗</span>
          </div>
        </Link>
        <p className="project-note">
          Future case studies will include verified location, services, materials, photographs, and links to the related{" "}
          <Link href="/metal-roofing">service</Link> and <Link href="/service-areas">service-area pages</Link>. Unverified details will not be added.
        </p>
      </section>
      <ProjectCTA />
    </>
  );
}
