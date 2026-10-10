import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Home Additions Pittsburgh PA | Room & Structure Expansions",
  description:
    "HBG Construction plans and builds home and property additions across Western Pennsylvania.",
  path: "/additions",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="ADDITIONS • WESTERN PENNSYLVANIA"
        title="ADDITIONS THAT FIT WHAT YOU ALREADY HAVE."
        copy="Room and structure additions planned around the existing home or building—built and finished as one project."
        kind="teamwork"
      />
      <section className="editorial wrap">
        <SectionHead kicker="HOME &amp; PROPERTY ADDITIONS" title="EXPAND WITH A CLEAR SCOPE." />
        <div className="editorial__grid">
          <p className="lead">An addition has to meet the existing structure at the roof, walls, and finish so it reads as one building.</p>
          <div>
            <p>
              We start with how you want to use the new space and how it connects to the house or building you already have. When the addition needs new roofing or siding, those finishes are planned with the structure.
            </p>
            <p>
              Related:{" "}
              <Link className="text-link" href="/metal-roofing">metal roofing</Link>,{" "}
              <Link className="text-link" href="/metal-siding">metal siding</Link>, and{" "}
              <Link className="text-link" href="/garages">garages</Link>.
            </p>
          </div>
        </div>
        <AssetPanel kind="teamwork" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">LIVING SPACE</p>
          <h2>Room to grow at home.</h2>
          <p>Additions planned around access, light, and a finished look that belongs with the original house.</p>
        </article>
        <article>
          <p className="eyebrow">UTILITY &amp; WORK SPACE</p>
          <h2>Practical square footage.</h2>
          <p>Mudrooms, workshops, and utility expansions scoped for use, then built to match the rest of the project.</p>
        </article>
      </section>
      <ServiceAreaLinks heading="Addition service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
