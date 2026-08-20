import { ESTIMATE_HREF } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

const projectImages: Record<string, { src: string; alt: string; position?: string }> = {
  hero: { src: "/images/metal-exterior-wide.png", alt: "Completed commercial building with black vertical ribbed metal siding and metal roofing by Heritage Build Group", position: "center 55%" },
  finished: { src: "/images/metal-exterior-wide.png", alt: "Finished commercial building with black vertical ribbed metal siding and metal roofing" },
  after: { src: "/images/metal-exterior-wide.png", alt: "Completed metal roofing and vertical ribbed metal siding after renovation" },
  before: { src: "/images/02_before_front.jpeg", alt: "Building exterior before metal roofing and siding renovation" },
  prep: { src: "/images/03_before_side_roof.jpeg", alt: "Existing side wall and roof during exterior preparation" },
  installation: { src: "/images/04_installation_wide_panels.jpeg", alt: "Metal siding panels staged during installation" },
  siding: { src: "/images/metal-siding-front.png", alt: "Front view of commercial building with black vertical ribbed metal siding" },
  detail: { src: "/images/metal-siding-front.png", alt: "Front facade of commercial building with black vertical ribbed metal siding" },
  roof: { src: "/images/metal-roofing-roof.png", alt: "Angled view of corrugated metal roofing on a commercial building" },
  commercial: { src: "/images/metal-exterior-wide.png", alt: "Completed large-scale commercial building with black vertical ribbed metal siding, metal roofing, and coordinated trim" },
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
    <Image src={image.src} alt={image.alt} fill sizes={kind === "hero" ? "100vw" : "(max-width: 800px) 100vw, 60vw"} priority={kind === "hero"} style={{ objectPosition: image.position }} />{label && <span>{label}</span>}
  </div>;
}
export function PageHero({ kicker, title, copy, kind = "detail" }: { kicker: string; title: string; copy: string; kind?: string }) {
  return <section className="page-hero"><div className="wrap page-hero__grid"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{copy}</p><Button href={ESTIMATE_HREF}>REQUEST AN ESTIMATE</Button></div><AssetPanel kind={kind} /></div></section>;
}
export function Process() {
  return <section className="process wrap"><SectionHead kicker="HOW WE WORK" title="CLEAR STEPS FROM START TO FINISH." />
    <div className="process__grid">{[["01","Planning","A clear scope starts with the property, what needs to last, and how you want it to look."],["02","Materials","Materials and details chosen to last, fit the building, and look right when the job is done."],["03","Installation","Experienced crews install to a clear standard, with care at edges, transitions, and trim."],["04","Communication","One point of contact and clear updates from estimate through completion."]].map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div>
  </section>;
}
export function ProjectCTA() { return <section className="cta-band"><div className="wrap"><p className="eyebrow">YOUR PROPERTY. YOUR PROJECT.</p><h2>LET’S TALK ABOUT YOUR PROJECT.</h2><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button></div></section>; }
