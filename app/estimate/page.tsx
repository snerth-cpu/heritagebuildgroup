import { EstimateForm } from "@/components/estimate-form";
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_PHONE_HREF, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Construction Estimate | Pittsburgh PA",
  description:
    "Tell HBG Construction about your pole building, garage, addition, or metal roofing and siding project in Western Pennsylvania.",
  path: "/estimate",
});

export default function Page() {
  return (
    <section className="estimate">
      <div className="wrap estimate__grid">
        <aside>
          <p className="eyebrow">FULL-SERVICE ESTIMATES</p>
          <h1>TELL US ABOUT<br />YOUR PROJECT.</h1>
          <p>Pole building, garage, addition, or metal exterior—tell us the property, the work you have in mind, and the timing. We’ll use that to figure out the next step.</p>
          <p className="estimate-contact">
            <a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>
          <div className="estimate__aside">
            <span>01</span>
            <p>
              <strong>Buildings &amp; Additions</strong>
              <br />
              Pole buildings · Garages · Additions
              <br />
              Full-service from plan to completion
            </p>
          </div>
          <div className="estimate__aside">
            <span>02</span>
            <p>
              <strong>Metal Exteriors</strong>
              <br />
              Roofing · Siding · Wall panels
              <br />
              Residential and commercial
            </p>
          </div>
        </aside>
        <EstimateForm />
      </div>
    </section>
  );
}
