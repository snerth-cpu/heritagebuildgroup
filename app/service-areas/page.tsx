import Link from "next/link";
import { AssetPanel, ProjectCTA, SectionHead } from "@/components/ui";
import { pageMetadata, serviceAreas, ESTIMATE_HREF } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Metal Roofing & Siding Service Areas in Western PA", description: "Heritage Build Group serves Greater Pittsburgh, Cranberry Township, Butler County, and Mercer County with residential and commercial metal exterior services.", path: "/service-areas" });

const descriptions = [
  "Our primary market for standing seam metal roofing, metal siding, and professionally managed commercial exterior projects.",
  "Metal exterior solutions for homes, commercial properties, and the growing built environment north of Pittsburgh.",
  "Residential and commercial roofing and siding scopes planned around suburban, small-town, and rural properties.",
  "Durable metal exterior systems for homes, businesses, and working buildings across Mercer County.",
];

export default function Page() { return <>
  <section className="page-hero"><div className="wrap page-hero__grid"><div><p className="eyebrow">WESTERN PENNSYLVANIA</p><h1>METAL EXTERIORS ACROSS THE REGION.</h1><p>Heritage Build Group provides metal roofing, metal siding, and commercial exterior construction across Greater Pittsburgh and selected Western Pennsylvania markets.</p><Link className="button" href={ESTIMATE_HREF}>REQUEST AN ESTIMATE <span>↗</span></Link></div><AssetPanel kind="roof" /></div></section>
  <section className="area-hub wrap"><SectionHead kicker="SERVICE AREAS" title="LOCAL KNOWLEDGE. CONSISTENT STANDARDS." copy="Every property presents a different combination of architecture, exposure, access, and project priorities. We develop the scope around the actual building—not a one-size-fits-all package." />
    <div className="area-hub__grid">{serviceAreas.map((area, index) => <Link href={area.href} key={area.href}><span>0{index + 1}</span><h2>{area.label}</h2><p>{descriptions[index]}</p><strong>EXPLORE AREA ↗</strong></Link>)}</div>
  </section>
  <section className="location-copy wrap"><div className="location-copy__intro"><p className="eyebrow">REGIONAL SCOPE</p><p className="lead">From Pittsburgh properties to homes and commercial buildings farther north, our work stays centered on durable assemblies, clean detailing, and clear management.</p></div><div className="location-copy__grid"><article><h2>Residential metal exteriors</h2><p>Metal roofing and siding can bring long-term performance and a sharper architectural identity to a home. We plan the work around existing conditions, transitions, trim, and the complete exterior composition.</p></article><article><h2>Commercial exterior projects</h2><p>Commercial properties benefit from coordinated roofing, wall systems, cladding, trim, and renovation scopes. Defined proposals and project communication keep field work aligned with property needs.</p></article></div></section>
  <ProjectCTA />
  </>; }
