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
  ["METAL ROOFING", "Long-lasting metal roofing for homes and commercial buildings.", "/metal-roofing", "roof"],
  ["METAL SIDING", "Clean, durable metal siding and coordinated exterior details.", "/metal-siding", "siding"],
  ["COMMERCIAL", "Roofing, siding, cladding, trim, and complete exterior projects.", "/commercial", "commercial"],
] as const;

export default function Home() { return <>
  <section className="hero home-hero"><AssetPanel kind="hero" className="hero__image" /><div className="hero__shade" /><div className="wrap hero__content"><p className="eyebrow">RESIDENTIAL + COMMERCIAL • WESTERN PENNSYLVANIA</p><h1>METAL EXTERIORS<br />BUILT TO LAST.</h1><p className="hero__copy">Metal roofing and siding for homes and commercial properties across Western Pennsylvania.</p><div className="button-row"><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button><Link href="/projects" className="text-button">VIEW OUR WORK <span>↓</span></Link></div></div></section>

  <section className="home-services wrap"><div className="home-heading"><p className="eyebrow">WHAT WE DO</p><h2>METAL EXTERIOR SERVICES</h2></div><div className="home-services__grid">{services.map(([title, copy, href, kind]) => <Link href={href} className="home-service" key={href}><AssetPanel kind={kind} /><div><h3>{title}</h3><p>{copy}</p><span>LEARN MORE ↗</span></div></Link>)}</div></section>

  <section className="home-transformation"><div className="wrap"><div className="home-heading home-heading--split"><div><p className="eyebrow">FEATURED PROJECT</p><h2>BEFORE &amp; AFTER</h2></div><p>Metal roofing, vertical metal siding, trim, and exterior details brought together as one complete project.</p></div><BeforeAfter /><Link className="simple-link" href="/projects/complete-metal-exterior-transformation">VIEW THE FULL PROJECT <span>↗</span></Link></div></section>

  <section className="why wrap"><div className="home-heading"><p className="eyebrow">WHY HERITAGE</p><h2>STRAIGHTFORWARD FROM START TO FINISH.</h2></div><div className="why__grid"><article><span>01</span><h3>CLEAR PROPOSALS</h3><p>Know what is included before work begins.</p></article><article><span>02</span><h3>QUALITY INSTALLATION</h3><p>Experienced crews and defined project standards.</p></article><article><span>03</span><h3>PROFESSIONAL MANAGEMENT</h3><p>One point of contact from estimate through completion.</p></article></div></section>

  <section className="home-markets"><div className="wrap home-markets__grid"><article><p className="eyebrow">RESIDENTIAL</p><h2>FOR YOUR HOME.</h2><p>Metal roofing and siding planned around your property, your priorities, and the way you want the finished exterior to look.</p><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button></article><article><p className="eyebrow">COMMERCIAL</p><h2>FOR YOUR PROPERTY.</h2><p>Professionally managed exterior scopes for commercial buildings—from focused system upgrades to coordinated roofing and siding.</p><Button href="/commercial" light>COMMERCIAL SERVICES</Button></article></div></section>

  <section className="service-area wrap"><p className="eyebrow">SERVING WESTERN PENNSYLVANIA</p><div><Link href="/service-areas/pittsburgh-pa">GREATER PITTSBURGH</Link><Link href="/service-areas/cranberry-township-pa">CRANBERRY TOWNSHIP</Link><Link href="/service-areas/butler-county-pa">BUTLER COUNTY</Link><Link href="/service-areas/mercer-county-pa">MERCER COUNTY</Link></div><Link className="simple-link service-area__all" href="/service-areas">VIEW SERVICE AREAS ↗</Link></section>

  <section className="home-cta"><div className="wrap"><div><p className="eyebrow">START A CONVERSATION</p><h2>TELL US ABOUT YOUR PROJECT.</h2></div><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button></div></section>
  </> }
