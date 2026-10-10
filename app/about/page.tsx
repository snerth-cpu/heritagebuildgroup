import { AssetPanel, ProjectCTA } from "@/components/ui";
import { Mark } from "@/components/brand-logo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About HBG Construction | Western Pennsylvania Builder",
  description:
    "HBG Construction is a Western Pennsylvania contractor for metal roofing, metal siding, pole buildings, garages, and commercial exteriors.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <section className="about-hero wrap">
        <div>
          <Mark size="section" className="brand--ink" />
          <p className="eyebrow">ABOUT HBG CONSTRUCTION</p>
          <h1>LOCAL BUILDERS FOR EXTERIORS AND CUSTOM BUILDINGS.</h1>
        </div>
        <p>
          HBG Construction serves homeowners and commercial property teams across Greater Pittsburgh, Cranberry Township, Butler County, Mercer County, and Erie County.
          <br /><br />
          We focus on metal roofing, metal siding, pole buildings, garages, additions, and commercial exterior work—with clear estimates and one point of contact through the job.
        </p>
      </section>
      <AssetPanel kind="teamwork" className="about-visual" />
      <section className="trust wrap">
        <p className="eyebrow">WHAT TO EXPECT</p>
        {[
          ["CLEAR ESTIMATES", "Know what is included before work begins."],
          ["QUALITY WORKMANSHIP", "Experienced crews and a consistent finish standard."],
          ["ONE POINT OF CONTACT", "The same person from estimate through completion."],
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
