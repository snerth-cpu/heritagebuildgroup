import type { ReactNode } from "react";
import Link from "next/link";
import { ESTIMATE_HREF, serviceAreas } from "@/lib/seo";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function ServiceAreaLinks({ heading = "Service areas", copy }: { heading?: string; copy?: ReactNode }) {
  return (
    <section className="related-links wrap" aria-labelledby="service-area-links">
      <p className="eyebrow">WESTERN PENNSYLVANIA</p>
      <div>
        <h2 id="service-area-links">{heading}</h2>
        {copy ? <p className="related-links__copy">{copy}</p> : null}
        <nav aria-label="Service area links">{serviceAreas.map((area) => <Link href={area.href} key={area.href}>{area.label}<span>↗</span></Link>)}</nav>
      </div>
    </section>
  );
}

export function ServiceLinks() {
  return <nav className="inline-links" aria-label="Related exterior services"><Link href="/metal-roofing">Metal Roofing</Link><Link href="/metal-siding">Metal Siding</Link><Link href="/commercial">Commercial Exteriors</Link><Link href={ESTIMATE_HREF}>Request an Estimate</Link></nav>;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })) }} />;
}
