import { Mark } from "@/components/brand-logo";
import { barnProjectImagesFlat, poleBuildingBoardAndBatten } from "@/lib/projects";
import { PhoneLink } from "@/components/phone-link";
import { ESTIMATE_HREF } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

const projectImages: Record<string, { src: string; alt: string; position?: string }> = {
  hero: { src: "/images/metal-exterior-wide.png", alt: "Completed commercial building with black vertical ribbed metal siding and metal roofing by HBG Construction", position: "center 55%" },
  finished: { src: "/images/metal-exterior-wide.png", alt: "Finished commercial building with black vertical ribbed metal siding and metal roofing" },
  after: { src: "/images/metal-exterior-wide.png", alt: "Completed metal roofing and vertical ribbed metal siding after renovation" },
  before: { src: "/images/02_before_front.jpeg", alt: "Building exterior before metal roofing and siding renovation" },
  prep: { src: "/images/03_before_side_roof.jpeg", alt: "Existing side wall and roof during exterior preparation" },
  installation: { src: "/images/04_installation_wide_panels.jpeg", alt: "Metal siding panels staged during installation" },
  siding: { src: barnProjectImagesFlat.afterGable.src, alt: barnProjectImagesFlat.afterGable.alt, position: "center 45%" },
  detail: { src: "/images/metal-siding-front.png", alt: "Front facade of commercial building with black vertical ribbed metal siding" },
  roof: {
    src: "/images/metal-roofing-barn-install.jpg",
    alt: "Crew installing standing seam metal roofing on a black board-and-batten barn",
    position: "center 40%",
  },
  roofDetail: { src: "/images/metal-roofing-roof.png", alt: "Angled view of corrugated metal roofing on a commercial building" },
  commercial: { src: "/images/metal-exterior-wide.png", alt: "Completed large-scale commercial building with black vertical ribbed metal siding, metal roofing, and coordinated trim" },
  pole: { src: poleBuildingBoardAndBatten.src, alt: poleBuildingBoardAndBatten.alt, position: "center 55%" },
  progress: { src: "/images/04_installation_wide_panels.jpeg", alt: "Exterior metal installation in progress" },
  teamwork: { src: "/images/05_installation_close.jpeg", alt: "Installation crew working on the metal exterior" },
  // Representative-only kinds for expanded services (never mixed into Projects / REAL WORK).
  shingle: {
    src: "/images/representative/shingle-roofing.jpg",
    alt: "Representative asphalt shingle roof on a suburban home",
    position: "center 40%",
  },
  vinyl: {
    src: "/images/representative/vinyl-siding.jpg",
    alt: "Representative vinyl siding on a suburban home",
    position: "center 45%",
  },
  fiber: {
    src: "/images/representative/fiber-cement-siding.jpg",
    alt: "Representative fiber-cement siding on a craftsman-style home",
    position: "center 45%",
  },
  windows: {
    src: "/images/representative/window-replacement.jpg",
    alt: "Representative replacement windows on a home exterior",
    position: "center 45%",
  },
  doors: {
    src: "/images/representative/door-replacement.jpg",
    alt: "Representative exterior entry door on a home porch",
    position: "center 45%",
  },
  garageDoor: {
    src: "/images/representative/garage-door.jpg",
    alt: "Representative garage door on a two-car garage",
    position: "center 50%",
  },
};

export function Button({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link href={href} className={`button ${light ? "button--light" : ""}`}>{children}<span>↗</span></Link>;
}
export function SectionHead({ kicker, title, copy }: { kicker: string; title: string; copy?: string }) {
  return <div className="section-head"><p className="eyebrow">{kicker}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>;
}
const REPRESENTATIVE_KINDS = new Set(["shingle", "vinyl", "fiber", "windows", "doors", "garageDoor"]);

export function AssetPanel({
  kind = "finished",
  label,
  className = "",
  contain = false,
  caption,
}: {
  kind?: string;
  label?: string;
  className?: string;
  contain?: boolean;
  caption?: string;
}) {
  const image = projectImages[kind] || projectImages.finished;
  const showCaption =
    caption ||
    (REPRESENTATIVE_KINDS.has(kind) ? "Representative image — not an HBG project" : undefined);
  if (contain) {
    return (
      <figure className={`asset-panel asset-panel--${kind} asset-panel--contain ${className}`}>
        <Image className="asset-panel__photo" src={image.src} alt={image.alt} width={1024} height={768} sizes="(max-width: 800px) 100vw, 60vw" />
        {label && <span>{label}</span>}
        {showCaption ? <figcaption className="asset-panel__caption">{showCaption}</figcaption> : null}
      </figure>
    );
  }
  return (
    <figure className={`asset-panel asset-panel--${kind} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={kind === "hero" ? "100vw" : "(max-width: 800px) 100vw, 60vw"}
        priority={kind === "hero"}
        style={{ objectFit: "cover", objectPosition: image.position || "center" }}
      />
      {label && <span>{label}</span>}
      {showCaption ? <figcaption className="asset-panel__caption">{showCaption}</figcaption> : null}
    </figure>
  );
}

type PageHeroProps = {
  kicker: string;
  title: string;
  copy: string;
  kind?: string;
  contain?: boolean;
  estimateHref?: string;
  estimateLabel?: string;
  showCall?: boolean;
};

export function PageHero({
  kicker,
  title,
  copy,
  kind = "detail",
  contain = false,
  estimateHref = ESTIMATE_HREF,
  estimateLabel = "REQUEST A QUOTE",
  showCall = false,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="wrap page-hero__grid">
        <div>
          <Mark size="cta" className="brand--on-dark" />
          <p className="eyebrow">{kicker}</p>
          <h1>{title}</h1>
          <p>{copy}</p>
          <div className="button-row page-hero__actions">
            <Button href={estimateHref}>{estimateLabel}</Button>
            {showCall ? (
              <PhoneLink className="text-button text-button--on-dark" prefix="CALL " />
            ) : null}
          </div>
        </div>
        <AssetPanel kind={kind} contain={contain} />
      </div>
    </section>
  );
}

const DEFAULT_PROCESS = [
  ["01", "Estimate", "We review the property and put the scope in writing."],
  ["02", "Materials", "We select systems that fit the building and the finish you want."],
  ["03", "Install", "Crews build to a clear standard at edges, openings, and transitions."],
  ["04", "Follow-through", "One point of contact stays with you through completion."],
] as const;

export function Process({
  kicker = "HOW A PROJECT WORKS",
  title = "FROM ESTIMATE TO FINISH.",
  steps = DEFAULT_PROCESS,
}: {
  kicker?: string;
  title?: string;
  steps?: readonly (readonly [string, string, string])[];
}) {
  return (
    <section className="process wrap">
      <SectionHead kicker={kicker} title={title} />
      <div className={`process__grid${steps.length === 3 ? " process__grid--three" : ""}`}>
        {steps.map(([n, t, c]) => (
          <article key={n}>
            <span>{n}</span>
            <h3>{t}</h3>
            <p>{c}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type ProjectCTAProps = {
  title?: string;
  copy?: string;
  estimateHref?: string;
  estimateLabel?: string;
  showCall?: boolean;
};

export function ProjectCTA({
  title = "REQUEST A QUOTE.",
  copy,
  estimateHref = ESTIMATE_HREF,
  estimateLabel = "REQUEST A QUOTE",
  showCall = true,
}: ProjectCTAProps = {}) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <Mark size="cta" />
        <div>
          <p className="eyebrow">READY TO START?</p>
          <h2>{title}</h2>
          {copy ? <p className="cta-band__copy">{copy}</p> : null}
        </div>
        <div className="button-row cta-band__actions">
          <Button href={estimateHref} light>
            {estimateLabel}
          </Button>
          {showCall ? (
            <PhoneLink className="text-button text-button--on-dark" prefix="CALL " />
          ) : null}
        </div>
      </div>
    </section>
  );
}
