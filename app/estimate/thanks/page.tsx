import Link from "next/link";
import { Mark } from "@/components/brand-logo";
import { LeadThanksBreakout } from "@/components/lead-thanks-breakout";
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_PHONE_HREF, pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Quote request received",
    description: "Thanks — HBG Construction received your quote request and will follow up soon.",
    path: "/estimate/thanks",
  }),
  robots: { index: false, follow: false },
};

export default function EstimateThanksPage() {
  return (
    <section className="estimate estimate--thanks">
      <LeadThanksBreakout />
      <div className="wrap estimate__grid">
        <aside>
          <Mark size="section" className="brand--ink" />
          <p className="eyebrow">REQUEST RECEIVED</p>
          <h1>THANKS — WE<br />GOT YOUR QUOTE.</h1>
          <p className="estimate-success" role="status">
            Your request was submitted successfully. We will follow up using the contact details you provided.
          </p>
          <p className="estimate-contact">
            <a href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>
          <p className="estimate-thanks-nav">
            <Link href="/">Back to home</Link>
            <Link href="/estimate">Request another quote</Link>
          </p>
        </aside>
        <div className="estimate-thanks-panel" aria-hidden="true">
          <p>PA Registered & Fully Insured</p>
        </div>
      </div>
    </section>
  );
}
