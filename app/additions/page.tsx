import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Home Additions Pittsburgh PA | Room & Structure Expansions",
  description:
    "HBG Construction plans and builds home and property additions across Western Pennsylvania. Full-service construction from planning to completion.",
  path: "/additions",
});

export default function Page() {
  return (
    <>
      <PageHero
        kicker="ADDITIONS • WESTERN PENNSYLVANIA"
        title="ADDITIONS THAT FIT THE BUILDING YOU ALREADY HAVE."
        copy="Room and structure additions planned around the existing home or property—scoped, built, and finished as one project from start to completion."
        kind="teamwork"
      />
      <section className="editorial wrap">
        <SectionHead kicker="FROM PLAN TO COMPLETION" title="EXPAND WITH A CLEAR SCOPE." />
        <div className="editorial__grid">
          <p className="lead">An addition has to meet the existing structure at every edge—roof, walls, floors, and finish—so it reads as one building when it is done.</p>
          <div>
            <h2 className="subhead">Planned around what is already there</h2>
            <p>
              We start with the existing home or building: how you want to use the new space, how it connects, and what has to match outside and in. The scope covers structure, openings, and finish—not a vague square-footage number alone.
            </p>
            <h2 className="subhead">One team through completion</h2>
            <p>
              HBG Construction manages additions as full-service construction. You get a written plan, a crew on the job, and one point of contact from estimate through completion.
            </p>
            <h2 className="subhead">Exteriors that line up</h2>
            <p>
              When the addition needs new roofing or siding, we plan those with the structure so transitions and trim look finished. Learn more about{" "}
              <Link className="text-link" href="/metal-roofing">metal roofing</Link> and{" "}
              <Link className="text-link" href="/metal-siding">metal siding</Link>.
            </p>
          </div>
        </div>
        <AssetPanel kind="teamwork" className="wide-visual" />
      </section>
      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">LIVING SPACE</p>
          <h2>Room to grow at home.</h2>
          <p>Additions for living space are planned around how the house works day to day—access, light, and a finished look that belongs with the original structure. </p>
        </article>
        <article>
          <p className="eyebrow">UTILITY &amp; WORK SPACE</p>
          <h2>Practical square footage.</h2>
          <p>Mudrooms, workshops, and utility expansions are scoped for use first, then built and finished to the same standard as the rest of the project.</p>
        </article>
      </section>
      <section className="related-links wrap">
        <p className="eyebrow">RELATED SERVICES</p>
        <div>
          <h2>Buildings and construction</h2>
          <nav aria-label="Related construction services">
            <Link href="/pole-buildings">Pole Buildings<span>↗</span></Link>
            <Link href="/garages">Garages<span>↗</span></Link>
            <Link href="/buildings">All buildings<span>↗</span></Link>
            <Link href="/about">About HBG<span>↗</span></Link>
          </nav>
        </div>
      </section>
      <ServiceAreaLinks heading="Addition service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
