import Link from "next/link";
import { AssetPanel, Button, Process, ProjectCTA } from "@/components/ui";
import { BreadcrumbJsonLd, ServiceLinks } from "@/components/seo";
import { ESTIMATE_HREF, absoluteUrl } from "@/lib/seo";

export type LocationContent = {
  name: string; path: string; kicker: string; title: string; intro: string; lead: string;
  sections: { title: string; copy: string }[]; projectNote: string; imageKind: string;
};

export function LocationPage({ location }: { location: LocationContent }) {
  return <>
    <BreadcrumbJsonLd items={[{ name: "Home", url: absoluteUrl("/") }, { name: "Service Areas", url: absoluteUrl("/service-areas") }, { name: location.name, url: absoluteUrl(location.path) }]} />
    <section className="page-hero"><div className="wrap page-hero__grid"><div><p className="eyebrow">{location.kicker}</p><h1>{location.title}</h1><p>{location.intro}</p><Button href={ESTIMATE_HREF}>REQUEST AN ESTIMATE</Button></div><AssetPanel kind={location.imageKind} /></div></section>
    <section className="location-copy wrap"><div className="location-copy__intro"><p className="eyebrow">LOCAL METAL ROOFING AND SIDING</p><p className="lead">{location.lead}</p></div>
      <div className="location-copy__grid">{location.sections.map((section) => <article key={section.title}><h2>{section.title}</h2><p>{section.copy}</p></article>)}</div>
      <div className="location-project-note"><h2>Planning a project in {location.name}?</h2><p>{location.projectNote}</p><ServiceLinks /></div>
    </section>
    <Process />
    <section className="nearby wrap"><p className="eyebrow">EXPLORE THE REGION</p><div><Link href="/service-areas">All Service Areas</Link><Link href="/service-areas/pittsburgh-pa">Pittsburgh</Link><Link href="/service-areas/cranberry-township-pa">Cranberry Township</Link><Link href="/service-areas/butler-county-pa">Butler County</Link><Link href="/service-areas/mercer-county-pa">Mercer County</Link></div></section>
    <ProjectCTA />
  </>;
}
