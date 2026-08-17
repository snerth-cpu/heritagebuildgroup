import { ESTIMATE_HREF } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

const projectImages: Record<string, { src: string; alt: string; position?: string }> = {
  hero: { src: "/images/01_finished_exterior_hero.jpeg", alt: "Completed Heritage Build Group black metal exterior", position: "center 55%" },
  finished: { src: "/images/01_finished_exterior_hero.jpeg", alt: "Finished black metal roofing and siding exterior" },
  after: { src: "/images/01_finished_exterior_hero.jpeg", alt: "Completed dark metal exterior after renovation" },
  before: { src: "/images/02_before_front.jpeg", alt: "Building exterior before metal renovation" },
  prep: { src: "/images/03_before_side_roof.jpeg", alt: "Existing side wall and roof during exterior preparation" },
  installation: { src: "/images/04_installation_wide_panels.jpeg", alt: "Metal siding panels staged during installation" },
  siding: { src: "/images/05_installation_close.jpeg", alt: "Crew installing vertical black metal siding" },
  detail: { src: "/images/06_installation_facade.jpeg", alt: "Vertical metal siding installation at the front facade" },
  roof: { src: "/images/07_near_complete_roof_siding.jpeg", alt: "Near-complete coordinated metal roofing and siding" },
  commercial: { src: "/images/01_finished_exterior_hero.jpeg", alt: "Completed black exterior with vertical metal siding and coordinated trim" },
  progress: { src: "/images/04_installation_wide_panels.jpeg", alt: "Exterior metal installation in progress" },
  teamwork: { src: "/images/05_installation_close.jpeg", alt: "Installation crew working on the metal exterior" },
};

export function Button({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link href={href} className={`button ${light ? "button--light" : ""}`}>{children}<span>↗</span></Link>;
}
export function SectionHead({ kicker, title, copy }: { kicker: string; title: string; copy?: string }) {
  return <div className="section-head"><p className="eyebrow">{kicker}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>;
}
export function AssetPanel({ kind = "finished", label, className = "" }: { kind?: string; label?: string; className?: string }) {
  const image = projectImages[kind] || projectImages.finished;
  return <div className={`asset-panel asset-panel--${kind} ${className}`}>
    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 100vw, 60vw" priority={kind === "hero"} style={{ objectPosition: image.position }} />{label && <span>{label}</span>}
  </div>;
}
export function PageHero({ kicker, title, copy, kind = "detail" }: { kicker: string; title: string; copy: string; kind?: string }) {
  return <section className="page-hero"><div className="wrap page-hero__grid"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{copy}</p><Button href={ESTIMATE_HREF}>REQUEST AN ESTIMATE</Button></div><AssetPanel kind={kind} /></div></section>;
}
export function Process() {
  return <section className="process wrap"><SectionHead kicker="HOW WE WORK" title="CONTROL AT EVERY STAGE." />
    <div className="process__grid">{[["01","Planning","A defined scope starts with the property, performance needs, and architectural priorities."],["02","Materials","Systems and details selected for durability, compatibility, and a cohesive finished exterior."],["03","Installation","Experienced crews work to clear project standards with attention to transitions and trim."],["04","Communication","Professional management and one point of contact from estimate through completion."]].map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div>
  </section>;
}
export function ProjectCTA() { return <section className="cta-band"><div className="wrap"><p className="eyebrow">YOUR PROPERTY. YOUR PROJECT.</p><h2>LET’S BUILD A BETTER EXTERIOR.</h2><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button></div></section>; }
