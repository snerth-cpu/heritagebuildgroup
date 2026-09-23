import Link from "next/link";
import { AssetPanel, Button } from "@/components/ui";
import { BeforeAfter } from "@/components/before-after";
import { pageMetadata, ESTIMATE_HREF, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

const services = [
  ["METAL ROOFING", "Standing seam and metal roofing for homes and commercial buildings.", "/metal-roofing", "roof"],
  ["METAL SIDING", "Durable metal siding, including residential board-and-batten.", "/metal-siding", "siding"],
  ["POLE BUILDINGS", "Post-frame for barns, garages, workshops, storage, and commercial buildings.", "/pole-buildings", "commercial"],
  ["GARAGES", "Detached, attached, and shop-style garages built around how you use them.", "/garages", "installation"],
  ["COMMERCIAL", "Commercial exterior construction—roofing, siding, trim, and full projects.", "/commercial", "prep"],
] as const;

export default function Home() { return <>
  <section className="hero home-hero"><AssetPanel kind="hero" className="hero__image" /><div className="hero__shade" /><div className="wrap hero__content"><p className="eyebrow">WESTERN PENNSYLVANIA</p><h1>HBG CONSTRUCTION</h1><p className="hero__offer">Metal Roofing, Siding &amp; Post-Frame Construction</p><p className="hero__copy">Durable metal exterior systems and custom building solutions for homes, garages, barns and commercial properties throughout Western Pennsylvania.</p><div className="button-row"><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button><Link href="/projects" className="text-button">VIEW OUR WORK <span>↓</span></Link></div></div></section>

  <section className="home-services wrap"><div className="home-heading"><p className="eyebrow">WHAT WE DO</p><h2>EXTERIOR &amp; BUILDING SERVICES</h2></div><div className="home-services__grid">{services.map(([title, copy, href, kind]) => <Link href={href} className="home-service" key={href}><AssetPanel kind={kind} /><div><h3>{title}</h3><p>{copy}</p><span>LEARN MORE ↗</span></div></Link>)}</div></section>

  <section className="home-transformation"><div className="wrap"><div className="home-heading home-heading--split"><div><p className="eyebrow">FEATURED PROJECT</p><h2>BEFORE &amp; AFTER</h2></div><p>Metal roofing, vertical metal siding, trim, and details—finished as one project.</p></div><BeforeAfter /><Link className="simple-link" href="/projects/complete-metal-exterior-transformation">VIEW THE FULL PROJECT <span>↗</span></Link></div></section>

  <section className="why wrap"><div className="home-heading"><p className="eyebrow">WHY HBG</p><h2>STRAIGHTFORWARD FROM START TO FINISH.</h2></div><div className="why__grid"><article><span>01</span><h3>CLEAR PROPOSALS</h3><p>Know what is included before work begins.</p></article><article><span>02</span><h3>QUALITY INSTALLATION</h3><p>Experienced crews and a clear standard for the work.</p></article><article><span>03</span><h3>ONE POINT OF CONTACT</h3><p>Professional management from estimate through completion.</p></article></div></section>

  <section className="home-markets"><div className="wrap home-markets__grid"><article><p className="eyebrow">METAL EXTERIORS</p><h2>ROOFING &amp; SIDING.</h2><p>Metal roofing and siding for homes and commercial buildings—still a core specialty of HBG Construction.</p><Button href="/metal-roofing" light>METAL ROOFING</Button></article><article><p className="eyebrow">POST-FRAME &amp; BUILDINGS</p><h2>POLE BUILDINGS &amp; MORE.</h2><p>Barns, garages, workshops, storage buildings, and commercial post-frame—planned and built with the exterior in mind.</p><Button href="/buildings" light>VIEW BUILDINGS</Button></article></div></section>

  <section className="service-area wrap"><p className="eyebrow">SERVING WESTERN PENNSYLVANIA</p><div><Link href="/service-areas/pittsburgh-pa">GREATER PITTSBURGH</Link><Link href="/service-areas/cranberry-township-pa">CRANBERRY TOWNSHIP</Link><Link href="/service-areas/butler-county-pa">BUTLER COUNTY</Link><Link href="/service-areas/mercer-county-pa">MERCER COUNTY</Link><span>ERIE COUNTY</span></div><Link className="simple-link service-area__all" href="/service-areas">VIEW SERVICE AREAS ↗</Link></section>

  <section className="home-cta"><div className="wrap"><div><p className="eyebrow">START A CONVERSATION</p><h2>TELL US ABOUT YOUR PROJECT.</h2></div><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button></div></section>
  </> }
