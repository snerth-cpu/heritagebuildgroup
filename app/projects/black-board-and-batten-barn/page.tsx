import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Mark } from "@/components/brand-logo";
import { BeforeAfter } from "@/components/before-after";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { absoluteUrl, ESTIMATE_HREF, pageMetadata } from "@/lib/seo";
import { barnProjectImages, blackBoardAndBattenBarn as project } from "@/lib/projects";

export const metadata = pageMetadata({
  title: "From Red Barn to Modern Black Metal Exterior",
  description:
    "A complete Heritage Build Group exterior transformation featuring black board-and-batten metal siding—from the original red barn through installation to the finished exterior.",
  path: "/projects/black-board-and-batten-barn",
});

export default function Page() {
  const {
    beforePrimary,
    beforeSecondary,
    beforeTertiary,
    afterHero,
    completedGable,
    progress,
  } = barnProjectImages;

  const allImages = [
    afterHero.src,
    beforePrimary.src,
    beforeSecondary.src,
    beforeTertiary.src,
    ...progress.map((image) => image.src),
    completedGable.src,
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Projects", url: absoluteUrl("/projects") },
          { name: project.title, url: absoluteUrl(`/projects/${project.slug}`) },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          url: absoluteUrl(`/projects/${project.slug}`),
          creator: { "@id": `${absoluteUrl("/")}#business` },
          image: allImages.map((image) => absoluteUrl(image)),
          about: project.services.map((service) => service.name),
        }}
      />

      <section className="case-hero">
        <div className="case-hero__media">
          <Image
            src={afterHero.src}
            alt={afterHero.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
        </div>
        <div className="wrap">
          <p className="eyebrow">PROJECT CASE STUDY</p>
          <h1>
            FROM RED BARN TO
            <br />
            MODERN BLACK METAL EXTERIOR
          </h1>
          <p>A complete exterior transformation featuring black board-and-batten metal siding, installed by Heritage Build Group.</p>
        </div>
      </section>

      <section className="case-intro wrap">
        <p className="eyebrow">THE PROJECT</p>
        <div>
          <p className="lead">
            Aging red metal siding replaced with black vertical board-and-batten-style metal siding—documented from existing conditions through installation to completion.
          </p>
          <nav className="inline-links" aria-label="Services shown in this project">
            {project.services.map((service) => (
              <Link href={service.href} key={service.href}>
                {service.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="project-compare wrap">
        <div className="project-section-head">
          <p className="eyebrow">BEFORE &amp; AFTER</p>
          <h2>THE CHANGE</h2>
          <p>Same barn. Same structure. A completely different exterior.</p>
        </div>
        <BeforeAfter
          beforeSrc={beforePrimary.src}
          afterSrc={afterHero.src}
          beforeAlt={beforePrimary.alt}
          afterAlt={afterHero.alt}
        />
        <div className="ba-pair" aria-label="Before and after side by side">
          <figure className="ba-pair__item">
            <div className="ba-pair__frame">
              <Image src={beforePrimary.src} alt={beforePrimary.alt} fill sizes="(max-width: 800px) 100vw, 620px" />
            </div>
            <figcaption>BEFORE</figcaption>
          </figure>
          <figure className="ba-pair__item">
            <div className="ba-pair__frame">
              <Image src={afterHero.src} alt={afterHero.alt} fill sizes="(max-width: 800px) 100vw, 620px" />
            </div>
            <figcaption>AFTER</figcaption>
          </figure>
        </div>
      </section>

      <section className="project-stage wrap">
        <div className="project-section-head">
          <p className="eyebrow">BEFORE</p>
          <h2>THE EXISTING BARN</h2>
          <p>Aging red metal siding with large sections of the exterior open and exposed.</p>
        </div>
        <div className="before-gallery before-gallery--three">
          <figure className="before-gallery__primary">
            <div className="project-photo project-photo--portrait">
              <Image src={beforePrimary.src} alt={beforePrimary.alt} fill sizes="(max-width: 800px) 100vw, 720px" />
            </div>
          </figure>
          <figure>
            <div className="project-photo project-photo--portrait">
              <Image src={beforeSecondary.src} alt={beforeSecondary.alt} fill sizes="(max-width: 800px) 100vw, 420px" />
            </div>
          </figure>
          <figure>
            <div className="project-photo project-photo--portrait">
              <Image src={beforeTertiary.src} alt={beforeTertiary.alt} fill sizes="(max-width: 800px) 100vw, 420px" />
            </div>
          </figure>
        </div>
      </section>

      <section className="project-stage project-stage--cream">
        <div className="wrap">
          <div className="project-section-head">
            <p className="eyebrow">THE TRANSFORMATION</p>
            <h2>INSTALLATION IN PROGRESS</h2>
            <p>Existing exterior preparation, panel installation, and progress around the building.</p>
          </div>
          <div className="progress-gallery">
            {progress.map((image) => (
              <figure
                className={image.feature ? "progress-gallery__item progress-gallery__item--feature" : "progress-gallery__item"}
                key={image.src}
              >
                <div className={`project-photo ${image.feature ? "project-photo--feature" : "project-photo--portrait"}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="lazy"
                    sizes={image.feature ? "(max-width: 800px) 100vw, 1240px" : "(max-width: 800px) 100vw, 600px"}
                  />
                </div>
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="project-stage wrap">
        <div className="project-section-head">
          <p className="eyebrow">THE FINISHED EXTERIOR</p>
          <h2>BLACK BOARD-AND-BATTEN</h2>
          <p>The finished black vertical metal siding gives the original barn a completely different appearance.</p>
        </div>
        <figure className="finished-hero">
          <div className="project-photo project-photo--hero">
            <Image src={afterHero.src} alt={afterHero.alt} fill sizes="100vw" loading="lazy" />
          </div>
        </figure>
        <div className="finished-grid finished-grid--single">
          <figure>
            <div className="project-photo project-photo--portrait">
              <Image src={completedGable.src} alt={completedGable.alt} fill sizes="(max-width: 800px) 100vw, 720px" loading="lazy" />
            </div>
            <figcaption>{completedGable.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <Mark size="cta" />
          <div>
            <p className="eyebrow">YOUR PROPERTY. YOUR PROJECT.</p>
            <h2>READY TO TRANSFORM YOUR BUILDING?</h2>
            <p className="cta-band__copy">
              Heritage Build Group specializes in metal siding, metal roofing, pole buildings, garages, and exterior renovations throughout the Pittsburgh region.
            </p>
          </div>
          <Button href={ESTIMATE_HREF} light>
            REQUEST A FREE ESTIMATE
          </Button>
        </div>
      </section>
    </>
  );
}
