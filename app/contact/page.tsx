import Link from "next/link";
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  ESTIMATE_HREF,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Heritage Build Group",
  description:
    "Call, email, or request an estimate from Heritage Build Group for residential and commercial metal roofing and siding projects in Western Pennsylvania.",
  path: "/contact",
});

const options = [
  {
    num: "01",
    title: "CALL US",
    detail: BUSINESS_PHONE,
    href: BUSINESS_PHONE_HREF,
    external: true,
  },
  {
    num: "02",
    title: "EMAIL US",
    detail: BUSINESS_EMAIL,
    href: `mailto:${BUSINESS_EMAIL}`,
    external: true,
  },
  {
    num: "03",
    title: "REQUEST AN ESTIMATE",
    detail: "Send us your project details",
    href: ESTIMATE_HREF,
    external: false,
  },
] as const;

export default function Page() {
  return (
    <section className="contact">
      <div className="wrap">
        <p className="eyebrow">RESIDENTIAL + COMMERCIAL • WESTERN PENNSYLVANIA</p>
        <h1>
          LET’S TALK ABOUT
          <br />
          YOUR PROJECT.
        </h1>
        <p className="contact__intro">
          Call, email, or send us your project details and we’ll help you determine the next step.
        </p>
        <div className="contact-options">
          {options.map(({ num, title, detail, href, external }) => (
            <article key={num}>
              <span>{num}</span>
              <h2>{title}</h2>
              {external ? (
                <a href={href}>{detail}</a>
              ) : (
                <Link href={href}>
                  {detail} <span aria-hidden="true">↗</span>
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
