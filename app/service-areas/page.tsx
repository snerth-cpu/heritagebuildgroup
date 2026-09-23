import Link from "next/link";
import { AssetPanel, ProjectCTA, SectionHead } from "@/components/ui";
import { pageMetadata, serviceAreas, ESTIMATE_HREF } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Service Areas in Western PA",
  description: "HBG Construction serves Greater Pittsburgh, Cranberry Township, Butler County, Mercer County, and Erie County with metal roofing, siding, and building construction.",
  path: "/service-areas",
});

const descriptions = [
  "Our primary market for standing seam metal roofing, metal siding, pole buildings, and commercial exterior projects.",
  "Metal roofing and siding for homes, commercial properties, and growing areas north of Pittsburgh.",
  "Residential and commercial roofing, siding, and post-frame work for suburban, small-town, and rural properties.",
  "Durable metal roofing, siding, and buildings for homes, businesses, and working properties across Mercer County.",
];

export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero__grid">
          <div>
            <p className="eyebrow">WESTERN PENNSYLVANIA</p>
            <h1>METAL EXTERIORS &amp; BUILDINGS ACROSS THE REGION.</h1>
            <p>HBG Construction installs metal roofing and metal siding and builds pole buildings for homes and commercial properties across Greater Pittsburgh, Cranberry Township, Butler County, Mercer County, Erie County, and nearby Western Pennsylvania markets.</p>
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
          <div className="area-hub__listed">
            <span>05</span>
            <h2>Erie County</h2>
            <p>Metal exteriors and post-frame construction for homes, barns, garages, and commercial properties across Erie County.</p>
          </div>
        </div>
      </section>
      <section className="location-copy wrap">
        <div className="location-copy__intro">
          <p className="eyebrow">REGIONAL SCOPE</p>
          <p className="lead">From Pittsburgh to Erie County, the work stays the same: durable metal, clean details, solid buildings, and clear communication.</p>
        </div>
        <div className="location-copy__grid">
          <article>
            <h2>Residential metal exteriors</h2>
            <p>Metal roofing and siding—including residential board-and-batten—can last a long time and give a home a cleaner look. We plan the work around what is already there.</p>
          </article>
          <article>
            <h2>Pole buildings and barns</h2>
            <p>Post-frame buildings for barns, garages, workshops, storage, and light-commercial use are planned around how you use the property.</p>
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
