import Image from "next/image";
import Link from "next/link";
import { JsonLd, ServiceAreaLinks } from "@/components/seo";
import {
  Button,
  PageHero,
  Process,
  ProjectCTA,
  SectionHead,
} from "@/components/ui";
import {
  faqSchema,
  LEAD_SERVICE_AREA,
  leadServiceSchema,
  type LeadService,
  estimateHrefForService,
} from "@/lib/services";
import { PhoneLink } from "@/components/phone-link";

const LEAD_PROCESS = [
  ["01", "Tell us about the project", "Share the building, ZIP code, and what you need."],
  ["02", "Receive an estimate", "We review the details and put the scope in writing."],
  ["03", "Schedule the work", "When you are ready, we schedule the crew and materials."],
] as const;

export function ServiceLeadPage({
  service,
  children,
}: {
  service: LeadService;
  children?: React.ReactNode;
}) {
  const quoteHref = estimateHrefForService(service.slug);

  return (
    <>
      <JsonLd data={leadServiceSchema(service)} />
      <JsonLd data={faqSchema(service.faqs)} />

      <PageHero
        kicker={service.kicker}
        title={service.heroTitle}
        copy={service.heroCopy}
        kind={service.heroKind}
        contain={service.heroContain}
        estimateHref={quoteHref}
        estimateLabel="REQUEST A FREE ESTIMATE"
        showCall
      />

      <section className="editorial wrap">
        <SectionHead kicker="WHAT WE PROVIDE" title={service.cardTitle} />
        <div className="editorial__grid">
          <p className="lead">{service.lead}</p>
          <div>
            {service.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="button-row service-lead__actions">
              <Button href={quoteHref}>REQUEST A FREE ESTIMATE</Button>
              <PhoneLink className="text-button text-button--ink" prefix="CALL " />
            </div>
          </div>
        </div>
        {children}
        {service.photos.map((photo) => (
          <figure
            className={`asset-panel wide-visual${photo.contain ? " asset-panel--contain" : ""}${
              photo.representative ? " asset-panel--representative" : ""
            }`}
            key={photo.src + photo.alt}
          >
            {photo.contain ? (
              <Image
                className="asset-panel__photo"
                src={photo.src}
                alt={photo.alt}
                width={1024}
                height={768}
                sizes="(max-width: 800px) 100vw, 80vw"
              />
            ) : (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 800px) 100vw, 80vw"
                style={{ objectFit: "cover", objectPosition: photo.position || "center" }}
              />
            )}
            {photo.representative || photo.caption ? (
              <figcaption className="asset-panel__caption">
                {photo.caption || "Representative image — not an HBG project"}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </section>

      <section className="service-depth wrap">
        {service.depth.map((block) => (
          <article key={block.title}>
            <p className="eyebrow">{block.eyebrow}</p>
            <h2>{block.title}</h2>
            <p>{block.copy}</p>
          </article>
        ))}
      </section>

      <Process
        kicker="HOW IT WORKS"
        title={service.processTitle || "FROM QUOTE TO SCHEDULE."}
        steps={service.processSteps || LEAD_PROCESS}
      />

      <ServiceAreaLinks
        heading={`${service.navLabel} service area`}
        copy={service.serviceAreaCopy || `${service.navLabel} across ${LEAD_SERVICE_AREA}.`}
      />

      <section className="faq wrap" aria-label="FAQ">
        <SectionHead kicker="FAQ" title="COMMON QUESTIONS." />
        <div className="faq-list">
          {service.faqs.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="related-links wrap" aria-labelledby="related-services">
        <p className="eyebrow">RELATED</p>
        <div>
          <h2 id="related-services">Other services</h2>
          <nav aria-label="Related services">
            {service.related.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
                <span>↗</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <ProjectCTA
        title="REQUEST A FREE ESTIMATE."
        copy={`Ready to talk about ${service.navLabel.toLowerCase()}?`}
        estimateHref={quoteHref}
        estimateLabel="REQUEST A FREE ESTIMATE"
        showCall
      />
    </>
  );
}
