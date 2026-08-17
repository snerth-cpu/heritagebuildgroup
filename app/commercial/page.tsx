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
      "Yes. We provide commercial metal exterior solutions for occupied and existing buildings as well as new construction, coordinating with property teams and general contractors as the project requires.",
  },
  {
    question: "Are you a metal manufacturer?",
    answer:
      "No. Heritage Build Group is the contractor, installer, and project manager. We specify and install metal roofing and wall systems suited to the building; we do not manufacture the panels.",
  },
  {
    question: "What kinds of commercial properties do you serve?",
    answer:
      "Office, retail, church, auto, mixed-use, warehouse, and industrial or light-commercial buildings. Each scope is written around the property, not a generic package.",
  },
  {
    question: "Can roofing and wall panels be planned as one exterior?",
    answer:
      "Often, yes. Standing seam commercial roofing and metal wall panels perform and read better when edges, transitions, and sequencing are coordinated together.",
  },
  {
    question: "How do we request a commercial estimate?",
    answer:
      "Share the property type, location, and whether the work involves roofing, siding, recladding, or a combination. Request an Estimate and we will follow up to define the next step.",
  },
] as const;

const propertyTypes = [
  ["Office", "Office exteriors benefit from a quiet, ordered metal wall and a roof system that looks finished at every edge and entrance."],
  ["Retail", "Retail elevations need a clear identity at the street. Panel rhythm, openings, and trim are planned so the façade reads as architecture, not stock cladding."],
  ["Church", "Church and institutional buildings call for careful sequencing around occupancy, existing materials, and the character of the structure."],
  ["Auto", "Auto and service properties often need durable walls, practical access, and an exterior that stays presentable under daily use."],
  ["Mixed-use", "Mixed-use buildings combine storefront, entries, and upper walls. The metal scope should hold those conditions together as one composition."],
  ["Warehouse", "Warehouse exterior renovations can renew large elevations with vertical metal panels while work is planned around operations and access."],
  ["Industrial and light-commercial", "Industrial and light-commercial buildings are scoped around use, elevations in play, and how roofing and walls meet—not around a catalog building type."],
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
          <p className="eyebrow">WALL SYSTEMS</p>
          <h2>Commercial metal siding and wall panels</h2>
          <p>
            Vertical metal panels give commercial buildings a durable, ordered wall. Heritage Build Group installs commercial metal siding and wall panels in Pittsburgh as the contractor on the project—layout, openings, corners, base details, and trim treated as one elevation. We specify a manufacturer’s wall system for the building; we do not manufacture the panels.
          </p>
          <nav className="inline-links" aria-label="Metal siding">
            <Link href="/metal-siding">Metal Siding</Link>
          </nav>
        </article>
        <article>
          <p className="eyebrow">ROOF SYSTEMS</p>
          <h2>Commercial metal roofing</h2>
          <p>
            Standing seam commercial roofing and related metal roof systems are planned around geometry, drainage, penetrations, rooftop equipment, and the roof-to-wall condition. As the installer and project manager, we write a clear roofing scope for the building in front of us—not a generic package.
          </p>
          <nav className="inline-links" aria-label="Metal roofing">
            <Link href="/metal-roofing">Metal Roofing</Link>
          </nav>
        </article>
      </section>

      <section className="transformation">
        <div className="wrap">
          <SectionHead kicker="FACADE RENOVATIONS" title="EXTERIOR RECLADDING AND MODERNIZATION." />
          <div className="editorial__grid">
            <p className="lead">A new metal skin can modernize a commercial façade while the building keeps its purpose.</p>
            <div>
              <p>
                Exterior recladding is scoped around existing openings, adjacent roofing, and how the property operates. Façade renovations succeed when commercial metal cladding is treated as a coordinated exterior—not a cosmetic overlay.
              </p>
              <p>
                The photography here is a completed Heritage Build Group exterior: dark vertical metal siding, coordinated metal roofing, and architectural trim on a large-scale building. It is shown as that work, not as a named client, location, or product system.
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
            Existing buildings start with what is already there: assemblies, access, occupancy, and the elevations in scope. Warehouse exterior renovations and other in-place upgrades are managed so field work stays aligned with operations and a defined finish.
          </p>
        </article>
        <article>
          <p className="eyebrow">ON THE SCHEDULE</p>
          <h2>New construction</h2>
          <p>
            On new construction, we install commercial metal roofing and wall systems in coordination with the general contractor, drawings, and schedule. The exterior is a construction package with clear responsibilities—not a material drop-off.
          </p>
        </article>
      </section>

      <section className="location-copy wrap">
        <SectionHead
          kicker="WHO WE SERVE"
          title="PROPERTY TYPES SERVED."
          copy="Office, retail, church, auto, mixed-use, warehouse, and industrial or light-commercial buildings across Western Pennsylvania."
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
        <SectionHead kicker="CONTRACTOR AND PROJECT MANAGER" title="PROJECT PLANNING AND COORDINATION." />
        <div className="editorial__grid">
          <p className="lead">Commercial exterior work needs a defined scope, a field sequence, and one point of contact.</p>
          <div>
            <p>
              Heritage Build Group is a commercial exterior contractor in Pittsburgh: installer on the building and project manager for the work. Property owners, facility managers, developers, and general contractors get a written scope, coordinated crews, and communication from estimate through completion.
            </p>
            <p>
              When roofing, siding, and trim overlap, planning them together keeps edges, drainage, and appearance aligned. That is especially useful on occupied properties and on jobs where several trades share the same elevations.
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
            <h3>A durable envelope</h3>
            <p>Metal roofing and wall panels are selected for long-term protection and a finish that holds up on working buildings.</p>
          </article>
          <article>
            <span>02</span>
            <h3>A consistent exterior</h3>
            <p>Panel rhythm, color, and trim can unify large elevations so the property reads as one building rather than a collection of surfaces.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Practical to maintain</h3>
            <p>A well-detailed metal exterior reduces the cycle of patching and repainting that many commercial façades inherit.</p>
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
            Heritage Build Group provides commercial metal roofing, siding, and cladding across{" "}
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
