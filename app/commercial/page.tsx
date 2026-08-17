import Link from "next/link";
import { AssetPanel, PageHero, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { JsonLd, ServiceAreaLinks } from "@/components/seo";
import { ESTIMATE_HREF, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/seo";

const TITLE = "Commercial Metal Roofing & Siding Pittsburgh, PA | Heritage Build Group";
const DESCRIPTION =
  "Commercial metal roofing, siding, wall panels, and exterior renovations across Pittsburgh and Western Pennsylvania. Heritage installs and manages the work.";
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
      "Yes. Heritage Build Group installs commercial metal roofing, metal siding, and wall panels in Pittsburgh and across Western Pennsylvania, including Cranberry Township, Butler County, and Mercer County.",
  },
  {
    question: "Do you work on existing buildings and new construction?",
    answer:
      "Yes. We install commercial metal roofing and siding on occupied and existing buildings as well as new construction. We coordinate with property teams and general contractors as the project requires.",
  },
  {
    question: "Are you a metal manufacturer?",
    answer:
      "No. Heritage Build Group is the contractor, installer, and project manager. We choose and install metal roofing and wall panels suited to the building; we do not manufacture the panels.",
  },
  {
    question: "What kinds of commercial properties do you serve?",
    answer:
      "Office, retail, church, auto, mixed-use, warehouse, industrial or light-commercial buildings, and garages or shops. That includes older block buildings that need a cleaner exterior. Each scope is written around the property, not a generic package.",
  },
  {
    question: "Can roofing and wall panels be planned as one exterior?",
    answer:
      "Often, yes. Standing seam commercial roofing and metal wall panels look and perform better when edges, transitions, and the order of work are planned together.",
  },
  {
    question: "How do we request a commercial estimate?",
    answer:
      "Share the property type, location, and whether the work involves roofing, siding, a building update, or a combination. Request an Estimate and we will follow up with the next step.",
  },
] as const;

const propertyTypes = [
  ["Office", "Office buildings need a clean metal wall and a roof that looks finished at every edge and entrance."],
  ["Retail", "Retail buildings need a clear look from the street. Panel layout, openings, and trim are planned so the front looks finished—not like stock siding."],
  ["Church", "Church and similar buildings need careful planning around whether the building stays in use, existing materials, and the look of the structure."],
  ["Auto", "Auto, garage, and service properties often need durable walls, practical access, and an exterior that stays presentable under daily use."],
  ["Mixed-use", "Mixed-use buildings combine storefronts, entries, and upper walls. The metal work should tie those together so it looks like one building."],
  ["Warehouse", "Warehouse updates can refresh large walls with vertical metal panels, with work planned around operations and access."],
  ["Industrial and light-commercial", "Industrial and light-commercial buildings are planned around how the building is used, which walls are in the job, and how the roof meets the walls."],
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
    { "@type": "AdministrativeArea", name: "Western Pennsylvania" },
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Commercial property owners, facility managers, developers, and general contractors",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Commercial metal exterior services",
    itemListElement: [
      "Commercial metal siding and wall panels",
      "Commercial metal roofing",
      "Exterior recladding and modernization",
      "Existing-building renovations",
      "New construction metal exteriors",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
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
        copy="Heritage Build Group installs and manages commercial metal roofing, siding, and wall panels for existing buildings and new construction across Pittsburgh and Western Pennsylvania."
        kind="commercial"
      />

      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">THE WALLS</p>
          <h2>Commercial metal siding and wall panels</h2>
          <p>
            Vertical metal panels give commercial buildings a strong, clean wall. Heritage Build Group installs commercial metal siding and wall panels in Pittsburgh as the contractor on the job—layout, openings, corners, the bottom of the wall, and trim treated as one wall. We choose a manufacturer’s wall system for the building; we do not manufacture the panels.
          </p>
          <nav className="inline-links" aria-label="Metal siding">
            <Link href="/metal-siding">Metal Siding</Link>
          </nav>
        </article>
        <article>
          <p className="eyebrow">THE ROOF</p>
          <h2>Commercial metal roofing</h2>
          <p>
            Standing seam commercial roofing is planned around the roof shape, drainage, pipes, rooftop equipment, and where the roof meets the walls. As the installer and project manager, we write a clear roofing scope for the building in front of us—not a generic package.
          </p>
          <nav className="inline-links" aria-label="Metal roofing">
            <Link href="/metal-roofing">Metal Roofing</Link>
          </nav>
        </article>
      </section>

      <section className="transformation">
        <div className="wrap">
          <SectionHead kicker="BUILDING UPDATES" title="UPDATE AN OLDER BUILDING." />
          <div className="editorial__grid">
            <p className="lead">Have an older block building or garage? Metal siding is one of the easiest ways to give it a completely new look.</p>
            <div>
              <p>
                Many commercial block buildings are still structurally useful, but they look dated from the outside. Commercial metal siding can give an older block building a much cleaner, newer appearance. Metal siding for garages, shops, warehouses, and other block commercial buildings is a strong fit when the structure is still good but the exterior feels dated.
              </p>
              <p>
                Metal siding for block buildings can completely change the look of a basic block exterior. It also gives owners a durable, low-maintenance finish. We plan the work around existing windows and doors, the roof, and how the property operates so the new metal looks and performs like a finished exterior—not a cover-up. When it makes sense, new metal roofing can be planned with the walls so the whole exterior updates together.
              </p>
              <p>
                The photo is a completed Heritage Build Group project: a complete metal exterior update with dark vertical metal siding, matching metal roofing, and trim. It is shown as that work, not as a named client, location, or original wall material.
              </p>
              <nav className="inline-links" aria-label="Project photography">
                <Link href="/projects">Projects</Link>
              </nav>
            </div>
          </div>
          <AssetPanel kind="commercial" className="wide-visual" />
        </div>
      </section>

      <section className="service-depth wrap">
        <article>
          <p className="eyebrow">IN PLACE</p>
          <h2>Existing-building renovations</h2>
          <p>
            Existing buildings start with what is already there: access, whether the building stays in use, and which walls or roofs are in the job. Warehouse updates and other work on buildings that stay open are planned so crews can work around daily operations.
          </p>
        </article>
        <article>
          <p className="eyebrow">ON THE SCHEDULE</p>
          <h2>New construction</h2>
          <p>
            On new construction, we install commercial metal roofing and wall panels with the general contractor, drawings, and schedule. We are on the job as a contractor—not just dropping off material.
          </p>
        </article>
      </section>

      <section className="location-copy wrap">
        <SectionHead
          kicker="WHO WE SERVE"
          title="PROPERTY TYPES SERVED."
          copy="Office, retail, church, auto, garage, mixed-use, warehouse, and industrial or light-commercial buildings across Western Pennsylvania."
        />
        <div className="property-grid">
          {propertyTypes.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial editorial--copy wrap">
        <SectionHead kicker="CONTRACTOR AND PROJECT MANAGER" title="WE PLAN THE JOB AND KEEP IT MOVING." />
        <div className="editorial__grid">
          <p className="lead">Commercial exterior work needs a clear scope, a plan for the order of work, and one person to call.</p>
          <div>
            <p>
              Heritage Build Group is a commercial exterior contractor in Pittsburgh. We install the work and manage the project. Property owners, facility managers, developers, and general contractors get a written scope, a crew on the job, and one point of contact from estimate through completion.
            </p>
            <p>
              When roofing, siding, and trim overlap, planning them together keeps edges, drainage, and the look aligned. That matters on occupied buildings and on jobs where several trades share the same walls.
            </p>
            <nav className="inline-links" aria-label="Request a commercial estimate">
              <Link href={ESTIMATE_HREF}>Request an Estimate</Link>
            </nav>
          </div>
        </div>
      </section>

      <Process />

      <section className="why wrap">
        <SectionHead kicker="MATERIAL" title="WHY METAL FOR COMMERCIAL PROPERTIES." />
        <div className="why__grid">
          <article>
            <span>01</span>
            <h3>Built to last</h3>
            <p>Metal roofing and wall panels protect the building and keep their look on properties that get daily use.</p>
          </article>
          <article>
            <span>02</span>
            <h3>A consistent look</h3>
            <p>Panel layout, color, and trim can pull large walls together so the property looks like one building.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Practical to maintain</h3>
            <p>A well-detailed metal exterior means less patching and repainting over time.</p>
          </article>
        </div>
      </section>

      <section className="related-links wrap" aria-labelledby="related-services">
        <p className="eyebrow">CONTINUE</p>
        <div>
          <h2 id="related-services">Related services</h2>
          <nav aria-label="Related services">
            <Link href="/metal-siding">Metal Siding<span>↗</span></Link>
            <Link href="/metal-roofing">Metal Roofing<span>↗</span></Link>
            <Link href="/projects">Projects<span>↗</span></Link>
            <Link href={ESTIMATE_HREF}>Request an Estimate<span>↗</span></Link>
          </nav>
        </div>
      </section>

      <ServiceAreaLinks
        heading="Service area"
        copy={
          <>
            Heritage Build Group installs commercial metal roofing and siding across{" "}
            <Link href="/service-areas/pittsburgh-pa" className="text-link">Pittsburgh</Link>,{" "}
            <Link href="/service-areas/cranberry-township-pa" className="text-link">Cranberry Township</Link>,{" "}
            <Link href="/service-areas/butler-county-pa" className="text-link">Butler County</Link>,{" "}
            <Link href="/service-areas/mercer-county-pa" className="text-link">Mercer County</Link>
            , and Western Pennsylvania.
          </>
        }
      />

      <section className="faq wrap" aria-label="FAQ">
        <SectionHead kicker="BEFORE YOU BUILD" title="FREQUENTLY ASKED QUESTIONS." />
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
