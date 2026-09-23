import { AssetPanel, Process, ProjectCTA } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About HBG Construction | Full-Service Construction",
  description:
    "HBG Construction is a Western Pennsylvania exterior and building contractor for metal roofing, metal siding, pole buildings, barns, garages, and commercial exterior construction.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <section className="about-hero wrap">
        <div>
          <p className="eyebrow">FULL-SERVICE CONSTRUCTION</p>
          <h1>FROM THE FIRST PLAN TO A FINISHED BUILDING.</h1>
        </div>
        <p>
          HBG Construction builds pole buildings, garages, and barns, and installs metal roofing and siding for homeowners and commercial property teams across Greater Pittsburgh, Cranberry, Butler County, Mercer County, and Erie County.
          <br /><br />
          We combine quality materials, experienced crews, a clear scope, and one point of contact from planning through completion.
        </p>
      </section>
      <AssetPanel kind="teamwork" className="about-visual" />
      <Process />
      <section className="trust wrap">
        <p className="eyebrow">WHAT TO EXPECT • EVERY PROJECT</p>
        {[
          ["CLEAR PROPOSALS", "Know what is included before work begins."],
          ["QUALITY BUILD", "Experienced crews and a clear standard for the work."],
          ["PROFESSIONAL MANAGEMENT", "One point of contact from planning through completion."],
          ["BUILT AROUND THE PROJECT", "Work planned around the home, building, or property in front of us."],
        ].map(([t, c], i) => (
          <article key={t}>
            <span>0{i + 1}</span>
            <h2>{t}</h2>
            <p>{c}</p>
          </article>
        ))}
      </section>
      <ProjectCTA />
    </>
  );
}
