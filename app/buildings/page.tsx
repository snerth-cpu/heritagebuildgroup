import Link from "next/link";
import { AssetPanel, Button, Process, ProjectCTA, SectionHead } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import { ESTIMATE_HREF, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pole Buildings, Barns & Garages | Pittsburgh PA",
  description:
    "HBG Construction builds pole buildings, barns, garages, workshops, and storage buildings across Western Pennsylvania—with metal exteriors when the job calls for them.",
  path: "/buildings",
});

const offerings = [
  {
    title: "POLE BUILDINGS",
    copy: "Post-frame for barns, workshops, storage, agricultural, and commercial buildings—planned around how you use the property.",
    href: "/pole-buildings",
    kind: "commercial",
  },
  {
    title: "GARAGES",
    copy: "Detached, attached, and shop-style garages sized for vehicles, storage, and daily access.",
    href: "/garages",
    kind: "installation",
  },
  {
    title: "ADDITIONS",
    copy: "Home and property additions scoped to meet the building you already have—structure, connections, and finish.",
    href: "/additions",
    kind: "teamwork",
  },
] as const;

export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero__grid">
          <div>
            <p className="eyebrow">POST-FRAME &amp; BUILDINGS • WESTERN PENNSYLVANIA</p>
            <h1>POLE BUILDINGS, BARNS &amp; GARAGES.</h1>
            <p>
              HBG Construction plans and builds post-frame structures and related buildings—clear scope, quality materials, experienced crews, and one point of contact.
            </p>
            <Button href={ESTIMATE_HREF}>REQUEST AN ESTIMATE</Button>
          </div>
          <AssetPanel kind="commercial" />
        </div>
      </section>

      <section className="home-services wrap">
        <div className="home-heading">
          <p className="eyebrow">WHAT WE BUILD</p>
          <h2>BUILDING SERVICES</h2>
        </div>
        <div className="home-services__grid">
          {offerings.map(({ title, copy, href, kind }) => (
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
      </section>

      <section className="editorial wrap editorial--copy">
        <SectionHead
          kicker="HOW WE WORK"
          title="BUILT WITH THE EXTERIOR IN MIND."
          copy="Many buildings finish with metal roofing and siding. When structure and exterior are in the same job, we plan them together so the building looks and performs as one project."
        />
      </section>

      <section className="related-links wrap">
        <p className="eyebrow">ALSO OFFERED</p>
        <div>
          <h2>Metal exteriors</h2>
          <p className="related-links__copy">
            Metal roofing and metal siding remain a core specialty—on homes, commercial buildings, and post-frame structures.
          </p>
          <nav aria-label="Metal exterior services">
            <Link href="/metal-roofing">Metal Roofing<span>↗</span></Link>
            <Link href="/metal-siding">Metal Siding<span>↗</span></Link>
            <Link href="/commercial">Commercial<span>↗</span></Link>
          </nav>
        </div>
      </section>

      <ServiceAreaLinks heading="Building construction service areas" />
      <Process />
      <ProjectCTA />
    </>
  );
}
