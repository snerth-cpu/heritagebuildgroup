import Link from "next/link";
import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { JsonLd, ServiceAreaLinks } from "@/components/seo";
import { ESTIMATE_HREF, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/seo";

const TITLE = "Commercial Metal Roofing & Siding Pittsburgh, PA | HBG Construction";
const DESCRIPTION =
  "Commercial metal roofing, siding, and exterior renovations across Pittsburgh and Western Pennsylvania. HBG Construction installs and manages the work.";
const PAGE_PATH = "/commercial";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PAGE_PATH,
  absoluteTitle: true,
});

const faqs = [
  {
    question: "Do you install commercial metal roofing and siding in Pittsburgh?",
    answer:
      "Yes. HBG Construction installs commercial metal roofing and siding in Pittsburgh and across Western Pennsylvania, including Cranberry Township, Butler County, Mercer County, and Erie County.",
  },
  {
    question: "Do you work on existing buildings and new construction?",
    answer:
      "Yes. We work on occupied and existing buildings as well as new construction, and we coordinate with property teams and general contractors as needed.",
  },
  {
    question: "What kinds of commercial properties do you serve?",
    answer:
      "Office, retail, church, auto, mixed-use, warehouse, industrial, and light-commercial buildings—including older block buildings that need a cleaner exterior.",
  },
  {
    question: "How do we request a commercial estimate?",
    answer:
      "Share the property type, location, and whether the work involves roofing, siding, a full exterior update, or a combination. Request an Estimate and we will follow up.",
  },
] as const;

const pageUrl = absoluteUrl(PAGE_PATH);

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Commercial Metal Roofing and Siding",
  serviceType: "Commercial metal exterior contracting",
  description: DESCRIPTION,
  url: pageUrl,
  provider: { "@id": `${SITE_URL}/#business` },
  areaServed: [
    { "@type": "City", name: "Pittsburgh", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
    { "@type": "City", name: "Cranberry Township", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
    { "@type": "AdministrativeArea", name: "Butler County, Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Mercer County, Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Erie County, Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Western Pennsylvania" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      <PageHero
        kicker="PITTSBURGH • WESTERN PENNSYLVANIA"
        title="COMMERCIAL METAL ROOFING AND SIDING."
        copy="Commercial metal roofing, siding, and exterior updates for existing buildings and new construction across Western Pennsylvania."
        kind="commercial"
      />

      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">SIDING</p>
          <h2>Commercial metal walls</h2>
          <p>
            Vertical metal panels give commercial buildings a strong, clean wall. We install the wall system—including openings, corners, and trim—so the finished exterior reads as one surface.
          </p>
          <nav className="inline-links" aria-label="Metal siding">
            <Link href="/metal-siding">Metal Siding</Link>
          </nav>
        </article>
        <article>
          <p className="eyebrow">ROOFING</p>
          <h2>Commercial metal roofing</h2>
          <p>
            Standing seam commercial roofing is planned around drainage, rooftop equipment, and where the roof meets the walls. Roofing and wall work can be scoped together when that helps the building.
          </p>
          <nav className="inline-links" aria-label="Metal roofing">
            <Link href="/metal-roofing">Metal Roofing</Link>
          </nav>
        </article>
      </section>

      <section className="transformation">
        <div className="wrap">
          <SectionHead kicker="BUILDING UPDATES" title="REFRESH AN OLDER EXTERIOR." />
          <div className="editorial__grid">
            <p className="lead">Metal siding and roofing can give an older commercial building a cleaner, more finished look.</p>
            <div>
              <p>
                Many block buildings and shops are still solid but look dated. A metal exterior update—walls, roof, or both—can modernize the property while keeping daily operations in mind.
              </p>
              <p>
                We write a clear scope for renovations and new construction, then manage the install from estimate through completion.
              </p>
              <nav className="inline-links" aria-label="Project photography">
                <Link href="/projects">View Projects</Link>
                <Link href={ESTIMATE_HREF}>Request an Estimate</Link>
              </nav>
            </div>
          </div>
          <AssetPanel kind="commercial" className="wide-visual" />
        </div>
      </section>

      <Process />

      <ServiceAreaLinks
        heading="Service area"
        copy={
          <>
            Commercial metal roofing and siding across{" "}
            <Link href="/service-areas/pittsburgh-pa" className="text-link">Pittsburgh</Link>,{" "}
            <Link href="/service-areas/cranberry-township-pa" className="text-link">Cranberry Township</Link>,{" "}
            <Link href="/service-areas/butler-county-pa" className="text-link">Butler County</Link>,{" "}
            <Link href="/service-areas/mercer-county-pa" className="text-link">Mercer County</Link>
            , Erie County, and Western Pennsylvania.
          </>
        }
      />

      <section className="faq wrap" aria-label="FAQ">
        <SectionHead kicker="FAQ" title="COMMON QUESTIONS." />
        <div className="faq-list">
          {faqs.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <ProjectCTA />
    </>
  );
}
