import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ProjectCTA } from "@/components/ui";
import { BeforeAfter } from "@/components/before-after";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { barnProjectImages, completeExteriorTransformation as project } from "@/lib/projects";

function publicFileExists(publicPath: string) {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

const hasBeforePhotos =
  publicFileExists(barnProjectImages.beforePrimary.src) &&
  publicFileExists(barnProjectImages.beforeSecondary.src);

export const metadata = pageMetadata({
  title: "Black Board-and-Batten Barn Exterior Transformation",
  description:
    "See a genuine HBG Construction barn siding renovation—from the existing red metal exterior through installation to the finished black board-and-batten metal siding.",
  path: "/projects/complete-metal-exterior-transformation",
});

export default function Page() {
  const afterHero = barnProjectImages.afterHero;
  const progress = barnProjectImages.progress;

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
          image: [
            absoluteUrl(afterHero.src),
            ...(hasBeforePhotos
              ? [absoluteUrl(barnProjectImages.beforePrimary.src), absoluteUrl(barnProjectImages.beforeSecondary.src)]
              : []),
            ...progress.map((image) => absoluteUrl(image.src)),
            absoluteUrl(barnProjectImages.completedLong.src),
            absoluteUrl(barnProjectImages.completedGable.src),
          ],
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
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className="wrap">
          <p className="eyebrow">PROJECT CASE STUDY</p>
          <h1>
            BLACK BOARD-AND-BATTEN
            <br />
            BARN EXTERIOR
          </h1>
          <p>Metal Siding • Exterior Renovation • Western Pennsylvania</p>
        </div>
      </section>

      <section className="case-intro wrap">
        <p className="eyebrow">THE PROJECT</p>
        <div>
          <p className="lead">
            HBG Construction updated this barn exterior with black vertical board-and-batten-style metal siding—documented from existing conditions through installation to completion.
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

      {hasBeforePhotos && (
        <section className="project-compare wrap">
          <div className="project-section-head">
            <p className="eyebrow">THE CHANGE</p>
            <h2>BEFORE / AFTER</h2>
            <p>The same barn—red metal exterior replaced with black vertical board-and-batten-style metal siding.</p>
          </div>
          <BeforeAfter
            beforeSrc={barnProjectImages.beforePrimary.src}
            afterSrc={afterHero.src}
            beforeAlt={barnProjectImages.beforePrimary.alt}
            afterAlt={afterHero.alt}
          />
          <div className="ba-pair" aria-label="Before and after side by side">
            <figure className="ba-pair__item">
              <div className="ba-pair__frame">
                <Image
                  src={barnProjectImages.beforePrimary.src}
                  alt={barnProjectImages.beforePrimary.alt}
                  fill
                  sizes="(max-width: 800px) 100vw, 620px"
                />
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
      )}

      {hasBeforePhotos && (
        <section className="project-stage wrap">
          <div className="project-section-head">
            <p className="eyebrow">SECTION 01</p>
            <h2>BEFORE</h2>
            <p>
              The existing barn had aging red metal siding with large sections of the exterior open and exposed. HBG Construction was brought in to update the exterior with black vertical board-and-batten-style metal siding.
            </p>
          </div>
          <div className="before-gallery">
            <figure className="before-gallery__primary">
              <div className="project-photo">
                <Image
                  src={barnProjectImages.beforePrimary.src}
                  alt={barnProjectImages.beforePrimary.alt}
                  fill
                  sizes="(max-width: 800px) 100vw, 760px"
                />
              </div>
            </figure>
            <figure className="before-gallery__secondary">
              <div className="project-photo">
                <Image
                  src={barnProjectImages.beforeSecondary.src}
                  alt={barnProjectImages.beforeSecondary.alt}
                  fill
                  sizes="(max-width: 800px) 100vw, 460px"
                />
              </div>
            </figure>
          </div>
        </section>
      )}

      <section className="project-stage project-stage--cream">
        <div className="wrap">
          <div className="project-section-head">
            <p className="eyebrow">SECTION 02</p>
            <h2>THE TRANSFORMATION</h2>
            <p>
              The existing exterior was opened up and prepared before new black vertical metal siding was installed across the barn. Installation progressed around the original framing, windows, openings, corners, and gable areas.
            </p>
          </div>
          <div className="progress-gallery">
            {progress.map((image) => (
              <figure
                className={image.feature ? "progress-gallery__item progress-gallery__item--feature" : "progress-gallery__item"}
                key={image.src}
              >
                <div className="project-photo">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
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
          <p className="eyebrow">SECTION 03</p>
          <h2>THE FINISHED EXTERIOR</h2>
          <p>
            The finished black vertical metal siding gives the original barn a completely different appearance while retaining the structure and character of the existing building.
          </p>
        </div>
        <figure className="finished-hero">
          <div className="project-photo project-photo--hero">
            <Image src={afterHero.src} alt={afterHero.alt} fill sizes="100vw" />
          </div>
        </figure>
        <div className="finished-grid">
          <figure>
            <div className="project-photo">
              <Image
                src={barnProjectImages.completedLong.src}
                alt={barnProjectImages.completedLong.alt}
                fill
                sizes="(max-width: 800px) 100vw, 620px"
              />
            </div>
            <figcaption>{barnProjectImages.completedLong.caption}</figcaption>
          </figure>
          <figure>
            <div className="project-photo">
              <Image
                src={barnProjectImages.completedGable.src}
                alt={barnProjectImages.completedGable.alt}
                fill
                sizes="(max-width: 800px) 100vw, 620px"
              />
            </div>
            <figcaption>{barnProjectImages.completedGable.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="project-taxonomy wrap">
        <p className="eyebrow">PROJECT INFORMATION</p>
        <div>
          <p>
            <strong>Services documented</strong>
            <br />
            Metal siding, exterior renovation
          </p>
          <p>
            <strong>Location</strong>
            <br />
            Not published—the project location has not been provided.
          </p>
          <p>
            <strong>Materials</strong>
            <br />
            Black vertical board-and-batten-style metal siding. Specific manufacturer information has not been provided.
          </p>
        </div>
      </section>
      <ProjectCTA />
    </>
  );
}
