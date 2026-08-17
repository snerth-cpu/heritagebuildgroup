import Link from "next/link";
import { AssetPanel, ProjectCTA, SectionHead } from "@/components/ui";
import { pageMetadata, serviceAreas, ESTIMATE_HREF } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Service Areas in Western PA",
  description: "Heritage Build Group serves Greater Pittsburgh, Cranberry Township, Butler County, and Mercer County with residential and commercial metal exterior services.",
  path: "/service-areas",
});

const descriptions = [
  "Our primary market for standing seam metal roofing, metal siding, and commercial exterior projects.",
  "Metal roofing and siding for homes, commercial properties, and growing areas north of Pittsburgh.",
  "Residential and commercial roofing and siding for suburban, small-town, and rural properties.",
  "Durable metal roofing and siding for homes, businesses, and working buildings across Mercer County.",
];

export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero__grid">
          <div>
            <p className="eyebrow">WESTERN PENNSYLVANIA</p>
            <h1>METAL EXTERIORS ACROSS THE REGION.</h1>
            <p>Heritage Build Group installs metal roofing and metal siding for homes and commercial buildings across Greater Pittsburgh and nearby Western Pennsylvania markets.</p>
            <Link className="button" href={ESTIMATE_HREF}>REQUEST AN ESTIMATE <span>↗</span></Link>
          </div>
          <AssetPanel kind="roof" />
        </div>
      </section>
      <section className="area-hub wrap">
        <SectionHead
          kicker="SERVICE AREAS"
          title="LOCAL KNOWLEDGE. CONSISTENT STANDARDS."
          copy="Every property is different: the building, the access, the weather, and what you want done. We plan the job around the actual building—not a one-size-fits-all package."
        />
        <div className="area-hub__grid">
          {serviceAreas.map((area, index) => (
            <Link href={area.href} key={area.href}>
              <span>0{index + 1}</span>
              <h2>{area.label}</h2>
              <p>{descriptions[index]}</p>
              <strong>EXPLORE AREA ↗</strong>
            </Link>
          ))}
        </div>
      </section>
      <section className="location-copy wrap">
        <div className="location-copy__intro">
          <p className="eyebrow">REGIONAL SCOPE</p>
          <p className="lead">From Pittsburgh to homes and commercial buildings farther north, the work stays the same: durable metal, clean details, and clear communication.</p>
        </div>
        <div className="location-copy__grid">
          <article>
            <h2>Residential metal exteriors</h2>
            <p>Metal roofing and siding can last a long time and give a home a cleaner look. We plan the work around what is already there, the trim, and how the whole exterior should finish.</p>
          </article>
          <article>
            <h2>Commercial exterior projects</h2>
            <p>Metal is a strong, low-maintenance option for commercial buildings. A clear proposal and one point of contact keep the work aligned with how the property is used.</p>
          </article>
        </div>
      </section>
      <ProjectCTA />
    </>
  );
}
