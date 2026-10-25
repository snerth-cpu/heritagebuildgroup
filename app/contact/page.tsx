import Link from "next/link";
import { Mark } from "@/components/brand-logo";
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  BUSINESS_TRUST_LINE,
  ESTIMATE_HREF,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact HBG Construction",
  description:
    "Call, email, or request an estimate from HBG Construction for pole buildings, garages, additions, and metal exterior projects in Western Pennsylvania.",
  path: "/contact",
});

export default function Page() {
  return (
    <section className="contact">
      <div className="wrap">
        <Mark size="section" className="brand--ink" />
        <p className="eyebrow">FULL-SERVICE CONSTRUCTION • WESTERN PENNSYLVANIA</p>
        <h1>
          LET’S TALK ABOUT
          <br />
          YOUR PROJECT.
        </h1>
        <p className="contact__intro">
          Prefer to talk now? Call us. Or send project details and we’ll help you determine the next step.
        </p>
        <p className="contact__trust">{BUSINESS_TRUST_LINE}</p>

        <div className="contact-primary">
          <a className="button" href={BUSINESS_PHONE_HREF}>
            CALL {BUSINESS_PHONE} <span aria-hidden="true">↗</span>
          </a>
          <Link className="button button--ghost" href={ESTIMATE_HREF}>
            REQUEST AN ESTIMATE <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="contact-options">
          <article>
            <span>01</span>
            <h2>CALL US</h2>
            <a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a>
          </article>
          <article>
            <span>02</span>
            <h2>EMAIL US</h2>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </article>
          <article>
            <span>03</span>
            <h2>REQUEST AN ESTIMATE</h2>
            <Link href={ESTIMATE_HREF}>
              Send us your project details <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
