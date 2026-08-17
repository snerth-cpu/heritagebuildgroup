import { EstimateForm } from "@/components/estimate-form";
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_PHONE_HREF, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Metal Roofing or Siding Estimate",
  description: "Tell Heritage Build Group about your residential or commercial metal roofing, siding, or exterior project in Western Pennsylvania.",
  path: "/estimate",
});

export default function Page() {
  return (
    <section className="estimate">
      <div className="wrap estimate__grid">
        <aside>
          <p className="eyebrow">RESIDENTIAL + COMMERCIAL ESTIMATES</p>
          <h1>TELL US ABOUT<br />YOUR PROPERTY.</h1>
          <p>Home or commercial building—tell us the property, the work you have in mind, and the timing. We’ll use that to figure out the next step.</p>
          <p className="estimate-contact">
            <a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>
          <div className="estimate__aside">
            <span>01</span>
            <p>
              <strong>Residential Projects</strong>
              <br />
              Metal roofing · Metal siding
              <br />
              Complete exterior renovations
            </p>
          </div>
          <div className="estimate__aside">
            <span>02</span>
            <p>
              <strong>Commercial Projects</strong>
              <br />
              Roofing · Siding · Wall panels
              <br />
              Trim and full exterior projects
            </p>
          </div>
        </aside>
        <EstimateForm />
      </div>
    </section>
  );
}
