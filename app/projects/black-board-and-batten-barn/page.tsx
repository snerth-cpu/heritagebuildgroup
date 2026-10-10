import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Mark } from "@/components/brand-logo";
import { BeforeAfter } from "@/components/before-after";
import { ProjectGallery } from "@/components/project-gallery";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { absoluteUrl, ESTIMATE_HREF, pageMetadata } from "@/lib/seo";
import {
  barnProjectImages,
  barnProjectImagesFlat,
  blackBoardAndBattenBarn as project,
} from "@/lib/projects";

export const metadata = pageMetadata({
  title: "Black Board-and-Batten Barn Exterior",
  description:
    "Photos from a barn siding project—before, during install, and the finished black board-and-batten metal exterior.",
  path: "/projects/black-board-and-batten-barn",
});

export default function Page() {
  const { before, during, after } = barnProjectImages;
  const { beforePrimary, afterHero } = barnProjectImagesFlat;
  const allImages = [...after, ...before, ...during].map((image) => image.src);

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
          <p className="eyebrow">PROJECT</p>
          <h1>
            BLACK BOARD-AND-BATTEN
            <br />
            BARN
          </h1>
          <p>Metal siding on an existing barn—before, during, and after.</p>
        </div>
      </section>

      <section className="case-intro wrap">
        <p className="eyebrow">OVERVIEW</p>
        <div>
          <p className="lead">New black vertical metal siding over the original structure.</p>
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
          <p className="eyebrow">COMPARE</p>
          <h2>BEFORE / AFTER</h2>
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
          <h2>STARTING POINT</h2>
        </div>
        <ProjectGallery images={before} shape="portrait" />
      </section>

      <section className="project-stage project-stage--cream">
        <div className="wrap">
          <div className="project-section-head">
            <p className="eyebrow">DURING</p>
            <h2>THE WORK</h2>
          </div>
          <ProjectGallery images={during} shape="portrait" />
        </div>
      </section>

      <section className="project-stage wrap">
        <div className="project-section-head">
          <p className="eyebrow">AFTER</p>
          <h2>FINISHED</h2>
        </div>
        <ProjectGallery images={after} shape="portrait" />
      </section>

      <section className="cta-band">
        <div className="wrap">
          <Mark size="cta" />
          <div>
            <p className="eyebrow">NEXT PROJECT</p>
            <h2>TELL US ABOUT YOURS.</h2>
            <p className="cta-band__copy">
              Metal siding, metal roofing, pole buildings, garages, and exterior work across the Pittsburgh region.
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
