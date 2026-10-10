import Link from "next/link";
import { AssetPanel, Button, ProjectCTA } from "@/components/ui";
import { ServiceAreaLinks } from "@/components/seo";
import { ESTIMATE_HREF, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pole Buildings, Barns & Garages | Pittsburgh PA",
  description:
    "HBG Construction builds pole buildings, barns, garages, and additions across Western Pennsylvania—with metal exteriors when the job calls for them.",
  path: "/buildings",
});

const offerings = [
  {
    title: "POLE BUILDINGS",
    copy: "Post-frame barns, workshops, storage, and light-commercial buildings.",
    href: "/pole-buildings",
    kind: "commercial",
  },
  {
    title: "GARAGES",
    copy: "Detached, attached, and shop-style garages for vehicles, storage, and work space.",
    href: "/garages",
    kind: "installation",
  },
  {
    title: "ADDITIONS",
    copy: "Home and property additions that connect cleanly to what you already have.",
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
            <h1>POLE BUILDINGS, GARAGES &amp; ADDITIONS.</h1>
            <p>
              Custom buildings planned around how you use the property—then finished with a durable exterior when metal roofing or siding is part of the job.
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

      <section className="related-links wrap">
        <p className="eyebrow">ALSO OFFERED</p>
        <div>
          <h2>Metal exteriors</h2>
          <p className="related-links__copy">
            Many buildings finish with metal roofing and siding. We can include that in the same project.
          </p>
          <nav aria-label="Metal exterior services">
            <Link href="/metal-roofing">Metal Roofing<span>↗</span></Link>
            <Link href="/metal-siding">Metal Siding<span>↗</span></Link>
            <Link href="/commercial">Commercial Exteriors<span>↗</span></Link>
          </nav>
        </div>
      </section>

      <ServiceAreaLinks heading="Building construction service areas" />
      <ProjectCTA />
    </>
  );
}
