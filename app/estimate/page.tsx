import Link from "next/link";
import { EstimateForm } from "@/components/estimate-form";
import { Mark } from "@/components/brand-logo";
import { getLeadService, leadServices, estimateHrefForService } from "@/lib/services";
import { PhoneLink } from "@/components/phone-link";
import { BUSINESS_EMAIL, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Get a Free Estimate | Roofing, Siding & Contracting",
  description:
    "Request a free estimate from HBG Construction for metal roofing, siding, pole buildings, garages, and exterior projects in Western Pennsylvania and Northeast Ohio.",
  path: "/estimate",
});

type PageProps = {
  searchParams?: Promise<{ service?: string; submitted?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const selected = getLeadService(params.service);

  return (
    <section className="estimate">
      <div className="wrap estimate__grid">
        <aside className="estimate-aside">
          <Mark size="section" className="brand--ink" />
          <p className="eyebrow">FREE ESTIMATE</p>
          <h1>GET A FREE ESTIMATE.</h1>
          <p className="estimate-aside__copy">
            Tell us a little about your project, and we&apos;ll be in touch to discuss the details.
          </p>
          {selected ? (
            <p className="estimate-selected" role="status">
              Suggested project type: <strong>{selected.projectTypeLabel}</strong>
            </p>
          ) : null}
          <nav className="estimate-services" aria-label="Select project type">
            {leadServices.map((service) => {
              const active = selected?.slug === service.slug;
              return (
                <Link
                  key={service.slug}
                  href={estimateHrefForService(service.slug)}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {service.projectTypeLabel}
                </Link>
              );
            })}
          </nav>
          <p className="estimate-contact">
            <PhoneLink className="estimate-contact__phone" prefix="Call " />
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>
        </aside>
        <EstimateForm serviceSlug={selected?.slug} />
      </div>
    </section>
  );
}
