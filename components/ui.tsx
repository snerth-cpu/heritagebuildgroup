import { Mark } from "@/components/brand-logo";
import { ESTIMATE_HREF } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

const projectImages: Record<string, { src: string; alt: string; position?: string }> = {
  hero: { src: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-board-batten-hero-angle.jpeg", alt: "Completed barn with black board-and-batten-style metal siding by HBG Construction", position: "center 55%" },
  finished: { src: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-board-batten-hero-angle.jpeg", alt: "Finished barn with black vertical board-and-batten-style metal siding" },
  after: { src: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-board-batten-hero-angle.jpeg", alt: "Completed black board-and-batten metal siding after barn renovation" },
  before: { src: "/projects/black-board-and-batten-barn/01_BEFORE/before-red-barn-front-angle.jpeg", alt: "Existing red metal barn exterior before HBG Construction siding renovation" },
  prep: { src: "/projects/black-board-and-batten-barn/02_PROGRESS/progress-existing-siding-removed.jpeg", alt: "Existing barn exterior removed and framing exposed for new siding" },
  installation: { src: "/projects/black-board-and-batten-barn/02_PROGRESS/progress-wide-installation-view.jpeg", alt: "Black metal siding installation progressing across the barn" },
  siding: { src: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-board-batten-gable.jpeg", alt: "Completed gable elevation with black board-and-batten-style metal siding" },
  detail: { src: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-board-batten-gable.jpeg", alt: "Finished vertical panel layout on the barn gable elevation" },
  roof: { src: "/projects/black-board-and-batten-barn/02_PROGRESS/progress-early-black-siding-installation.jpeg", alt: "Early black metal siding installation on the barn exterior" },
  commercial: { src: "/projects/black-board-and-batten-barn/03_COMPLETED/completed-black-board-batten-long-side.jpeg", alt: "Completed long barn elevation with black board-and-batten-style metal siding" },
  progress: { src: "/projects/black-board-and-batten-barn/02_PROGRESS/progress-crew-installing-siding.jpeg", alt: "HBG Construction crew installing black metal siding" },
  teamwork: { src: "/projects/black-board-and-batten-barn/02_PROGRESS/progress-crew-installing-siding.jpeg", alt: "Installation crew working on the barn metal exterior" },
};

export function Button({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link href={href} className={`button ${light ? "button--light" : ""}`}>{children}<span>↗</span></Link>;
}
export function SectionHead({ kicker, title, copy }: { kicker: string; title: string; copy?: string }) {
  return <div className="section-head"><p className="eyebrow">{kicker}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>;
}
export function AssetPanel({ kind = "finished", label, className = "", contain = false }: { kind?: string; label?: string; className?: string; contain?: boolean }) {
  const image = projectImages[kind] || projectImages.finished;
  if (contain) {
    return <div className={`asset-panel asset-panel--${kind} asset-panel--contain ${className}`}>
      <Image className="asset-panel__photo" src={image.src} alt={image.alt} width={1024} height={768} sizes="(max-width: 800px) 100vw, 60vw" />{label && <span>{label}</span>}
    </div>;
  }
  return <div className={`asset-panel asset-panel--${kind} ${className}`}>
    <Image src={image.src} alt={image.alt} fill sizes={kind === "hero" ? "100vw" : "(max-width: 800px) 100vw, 60vw"} priority={kind === "hero"} style={{ objectPosition: image.position }} />{label && <span>{label}</span>}
  </div>;
}
export function PageHero({ kicker, title, copy, kind = "detail", contain = false }: { kicker: string; title: string; copy: string; kind?: string; contain?: boolean }) {
  return <section className="page-hero"><div className="wrap page-hero__grid"><div><Mark size="cta" className="brand--on-dark" /><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{copy}</p><Button href={ESTIMATE_HREF}>REQUEST AN ESTIMATE</Button></div><AssetPanel kind={kind} contain={contain} /></div></section>;
}
export function Process() {
  return <section className="process wrap"><SectionHead kicker="FULL-SERVICE CONSTRUCTION" title="FROM PLANNING TO COMPLETION." />
    <div className="process__grid">{[["01","Planning","A clear scope starts with the property, what you need the building to do, and how you want it to look."],["02","Materials","Materials and details chosen to last, fit the structure, and look right when the job is done."],["03","Build","Experienced crews build to a clear standard, with care at structure, edges, transitions, and finish."],["04","Communication","One point of contact and clear updates from the first plan through completion."]].map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div>
  </section>;
}
export function ProjectCTA() { return <section className="cta-band"><div className="wrap"><Mark size="cta" /><div><p className="eyebrow">YOUR PROPERTY. YOUR PROJECT.</p><h2>LET’S TALK ABOUT YOUR PROJECT.</h2></div><Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button></div></section>; }
