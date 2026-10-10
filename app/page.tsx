import Image from "next/image";
import Link from "next/link";
import { AssetPanel, Button } from "@/components/ui";
import { BeforeAfter } from "@/components/before-after";
import { Mark } from "@/components/brand-logo";
import { barnProjectImagesFlat } from "@/lib/projects";
import { pageMetadata, ESTIMATE_HREF, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

const services = [
  ["METAL ROOFING", "Standing seam and metal roofing for homes and commercial buildings.", "/metal-roofing", "roof"],
  ["METAL SIDING", "Metal siding for homes and commercial walls, including board-and-batten.", "/metal-siding", "siding"],
  ["POLE BUILDINGS", "Post-frame barns, shops, storage, and light-commercial buildings.", "/pole-buildings", "commercial"],
  ["GARAGES", "Detached, attached, and shop-style garages sized for how you use them.", "/garages", "installation"],
  ["COMMERCIAL EXTERIORS", "Commercial roofing, siding, trim, and full exterior updates.", "/commercial", "prep"],
] as const;

export default function Home() {
  return (
    <>
      <section className="hero home-hero home-hero--dual">
        <div className="hero__media">
          <div className="hero__shot hero__shot--barn">
            <Image
              src={barnProjectImagesFlat.afterHero.src}
              alt={barnProjectImagesFlat.afterHero.alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          </div>
          <div className="hero__shot hero__shot--commercial">
            <Image
              src="/images/metal-exterior-wide.png"
              alt="Completed commercial building with black vertical metal siding and metal roofing"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 45vw"
              style={{ objectFit: "cover", objectPosition: "center 45%" }}
            />
          </div>
        </div>
        <div className="hero__shade" />
        <div className="wrap hero__content">
          <p className="eyebrow">WESTERN PENNSYLVANIA</p>
          <h1 className="hero__brand">
            <Mark size="hero" priority />
            <span className="visually-hidden">HBG Construction</span>
          </h1>
          <p className="hero__offer">Metal Roofing, Siding &amp; Custom Buildings</p>
          <p className="hero__copy">
            Metal exteriors and custom buildings for homes, garages, barns, and commercial properties across Western Pennsylvania.
          </p>
          <div className="button-row">
            <Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button>
            <Link href="/projects" className="text-button">VIEW OUR WORK <span>↓</span></Link>
          </div>
        </div>
      </section>

      <section className="home-services wrap">
        <div className="home-heading">
          <p className="eyebrow">SERVICES</p>
          <h2>WHAT WE BUILD</h2>
        </div>
        <div className="home-services__grid home-services__grid--five">
          {services.map(([title, copy, href, kind]) => (
            <Link href={href} className="home-service" key={href}>
              <AssetPanel kind={kind} />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span>LEARN MORE ↗</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="home-services__note">
          Looking for a home addition?{" "}
          <Link href="/additions" className="text-link">See Additions</Link>.
        </p>
      </section>

      <section className="home-transformation">
        <div className="wrap">
          <div className="home-heading home-heading--split">
            <div>
              <p className="eyebrow">FEATURED PROJECTS</p>
              <h2>REAL WORK</h2>
            </div>
            <p>Before-and-after photos from completed metal exterior projects.</p>
          </div>
          <BeforeAfter />
          <div className="home-featured-links">
            <Link className="simple-link" href="/projects/complete-metal-exterior-transformation">
              COMMERCIAL EXTERIOR PHOTOS <span>↗</span>
            </Link>
            <Link className="simple-link" href="/projects/black-board-and-batten-barn">
              BARN SIDING PHOTOS <span>↗</span>
            </Link>
            <Link className="simple-link" href="/projects">
              ALL PROJECTS <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-featured-projects wrap">
        <Link href="/projects/black-board-and-batten-barn" className="project-card project-card--compact">
          <div className="asset-panel">
            <Image
              src={barnProjectImagesFlat.afterHero.src}
              alt={barnProjectImagesFlat.afterHero.alt}
              fill
              sizes="(max-width: 800px) 100vw, 60vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          </div>
          <div>
            <p className="eyebrow">METAL SIDING</p>
            <h2>BLACK BOARD-AND-BATTEN BARN</h2>
            <p>Before, during, and after photos from a residential barn siding project.</p>
            <span>VIEW PHOTOS ↗</span>
          </div>
        </Link>
      </section>

      <section className="why wrap">
        <div className="home-heading">
          <div>
            <Mark size="section" className="brand--ink" />
            <p className="eyebrow">WHY HBG</p>
            <h2>CLEAR, DIRECT, AND ACCOUNTABLE.</h2>
          </div>
        </div>
        <div className="why__grid">
          <article>
            <span>01</span>
            <h3>CLEAR ESTIMATES</h3>
            <p>Know what is included before work begins.</p>
          </article>
          <article>
            <span>02</span>
            <h3>QUALITY WORKMANSHIP</h3>
            <p>Experienced crews and a consistent finish standard.</p>
          </article>
          <article>
            <span>03</span>
            <h3>ONE POINT OF CONTACT</h3>
            <p>The same person from estimate through completion.</p>
          </article>
        </div>
      </section>

      <section className="service-area wrap">
        <p className="eyebrow">SERVING WESTERN PENNSYLVANIA</p>
        <div>
          <Link href="/service-areas/pittsburgh-pa">GREATER PITTSBURGH</Link>
          <Link href="/service-areas/cranberry-township-pa">CRANBERRY TOWNSHIP</Link>
          <Link href="/service-areas/butler-county-pa">BUTLER COUNTY</Link>
          <Link href="/service-areas/mercer-county-pa">MERCER COUNTY</Link>
          <span>ERIE COUNTY</span>
        </div>
        <Link className="simple-link service-area__all" href="/service-areas">
          VIEW SERVICE AREAS ↗
        </Link>
      </section>

      <section className="home-cta">
        <div className="wrap">
          <div>
            <Mark size="cta" />
            <p className="eyebrow">NEXT STEP</p>
            <h2>REQUEST AN ESTIMATE.</h2>
          </div>
          <Button href={ESTIMATE_HREF} light>REQUEST AN ESTIMATE</Button>
        </div>
      </section>
    </>
  );
}
