import Image from "next/image";
import Link from "next/link";
import { ProjectCTA } from "@/components/ui";
import { ProjectGallery } from "@/components/project-gallery";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { completeExteriorTransformation as project, exteriorProjectGallery } from "@/lib/projects";

export const metadata = pageMetadata({
  title: "Metal Exterior Project Photos",
  description:
    "Photos from a metal roofing and siding exterior project—existing conditions, install progress, and the finished building.",
  path: "/projects/complete-metal-exterior-transformation",
});

export default function Page() {
  const { before, during, after } = exteriorProjectGallery;
  const hero = after[0];

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
          image: project.images.map((image) => absoluteUrl(`/images/${image}`)),
          about: project.services.map((service) => service.name),
        }}
      />

      <section className="case-hero">
        <div className="case-hero__media">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className="wrap">
          <p className="eyebrow">PROJECT</p>
          <h1>
            METAL ROOFING
            <br />
            &amp; SIDING
          </h1>
          <p>Photos from an exterior update—prep, install, and finish.</p>
        </div>
      </section>

      <section className="case-intro wrap">
        <p className="eyebrow">OVERVIEW</p>
        <div>
          <p className="lead">Dark vertical metal siding, matching roofing, and trim details.</p>
          <nav className="inline-links" aria-label="Services shown in this project">
            {project.services.map((service) => (
              <Link href={service.href} key={service.href}>
                {service.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="project-stage wrap">
        <div className="project-section-head">
          <p className="eyebrow">BEFORE</p>
          <h2>EXISTING CONDITIONS</h2>
        </div>
        <ProjectGallery images={before} />
      </section>

      <section className="project-stage project-stage--cream">
        <div className="wrap">
          <div className="project-section-head">
            <p className="eyebrow">DURING</p>
            <h2>INSTALL</h2>
          </div>
          <ProjectGallery images={during} />
        </div>
      </section>

      <section className="project-stage wrap">
        <div className="project-section-head">
          <p className="eyebrow">AFTER</p>
          <h2>FINISHED LOOK</h2>
        </div>
        <ProjectGallery images={after} />
      </section>

      <section className="project-taxonomy wrap">
        <p className="eyebrow">PROJECT INFORMATION</p>
        <div>
          <p>
            <strong>Services</strong>
            <br />
            Metal roofing, metal siding, exterior renovation
          </p>
          <p>
            <strong>Location</strong>
            <br />
            Not published
          </p>
          <p>
            <strong>Materials</strong>
            <br />
            Specific product details not provided
          </p>
        </div>
      </section>
      <ProjectCTA />
    </>
  );
}
