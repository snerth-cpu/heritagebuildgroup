import Link from "next/link";
import { EstimateForm } from "@/components/estimate-form";
import { Mark } from "@/components/brand-logo";
import { getLeadService, leadServices, estimateHrefForService } from "@/lib/services";
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_PHONE_HREF, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Quote | Metal Roofing, Siding & Buildings",
  description:
    "Request a quote from HBG Construction for metal roofing, metal siding, barn siding, pole buildings, or garages in the Pittsburgh region and nearby Ohio communities.",
  path: "/estimate",
});

type PageProps = {
  searchParams?: Promise<{ service?: string; lead?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const selected = getLeadService(params.service);
  const leadSuccess = params.lead === "success";

  return (
    <section className="estimate">
      <div className="wrap estimate__grid">
        <aside>
          <Mark size="section" className="brand--ink" />
          <p className="eyebrow">REQUEST A QUOTE</p>
          <h1>TELL US ABOUT<br />YOUR PROJECT.</h1>
          <p>
            Share your name, phone, project ZIP code, project type, and a short description. Email and dimensions help when you have them.
          </p>
          {selected ? (
            <p className="estimate-selected" role="status">
              Suggested project type: <strong>{selected.projectTypeLabel}</strong>
              {selected.asksScope
                ? " — note supply and install, installation only, or materials only in the description if needed."
                : null}
              {selected.asksBuildingStatus
                ? " — say whether this is an existing building or new construction."
                : null}
            </p>
          ) : (
            <p className="estimate-selected">
              Choose a project type below or in the form so we can route your request.
            </p>
          )}
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
            <a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>
          <div className="estimate__aside">
            <span>01</span>
            <p>
              <strong>Required</strong>
              <br />
              Name · Phone · Project ZIP · Project type · Short description
            </p>
          </div>
          <div className="estimate__aside">
            <span>02</span>
            <p>
              <strong>Helpful</strong>
              <br />
              Email · Approx. dimensions (or “Not sure”) · Desired start · Photos if the form allows
            </p>
          </div>
          {leadSuccess ? (
            <p className="estimate-success" role="status">
              Thanks — your request was received. We will follow up using the contact details you submitted.
            </p>
          ) : null}
        </aside>
        <EstimateForm serviceSlug={selected?.slug} />
      </div>
    </section>
  );
}
