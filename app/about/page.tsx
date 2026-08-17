import { AssetPanel, Process, ProjectCTA } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Our Metal Exterior Company",
  description: "Learn how Heritage Build Group professionally manages residential and commercial metal roofing, siding, and exterior projects across Western Pennsylvania.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <section className="about-hero wrap">
        <div>
          <p className="eyebrow">RESIDENTIAL + COMMERCIAL</p>
          <h1>A BETTER EXTERIOR STARTS WITH A CLEAR PLAN.</h1>
        </div>
        <p>
          Heritage Build Group installs metal roofing and siding for homeowners and commercial property teams across Greater Pittsburgh, Cranberry, Butler County, and Mercer County.
          <br /><br />
          We combine quality materials, experienced crews, a clear scope, and one point of contact from estimate through completion.
        </p>
      </section>
      <AssetPanel kind="teamwork" className="about-visual" />
      <Process />
      <section className="trust wrap">
        <p className="eyebrow">WHAT TO EXPECT • EVERY PROPERTY TYPE</p>
        {[
          ["CLEAR PROPOSALS", "Know what is included before work begins."],
          ["QUALITY INSTALLATION", "Experienced crews and a clear standard for the work."],
          ["PROFESSIONAL MANAGEMENT", "One point of contact from estimate through completion."],
          ["BUILT AROUND THE PROJECT", "Work planned around the home or commercial building in front of us."],
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
