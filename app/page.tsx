import Image from "next/image";
import Link from "next/link";
import { AssetPanel, Button } from "@/components/ui";
import { BeforeAfter } from "@/components/before-after";
import { Mark } from "@/components/brand-logo";
import { barnBeforeAfterPrimary, barnProjectImagesFlat } from "@/lib/projects";
import { serviceCategories } from "@/lib/service-categories";
import { PhoneLink } from "@/components/phone-link";
import {
  pageMetadata,
  BUSINESS_TRUST_LINE,
  ESTIMATE_HREF,
  HOME_TITLE,
  HOME_DESCRIPTION,
  SERVICE_AREA_SHORT,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <section className="hero home-hero home-hero--dual">
        <div className="hero__media">
          <div className="hero__shot hero__shot--barn">
            <Image
              src={barnProjectImagesFlat.afterHero.src}
              alt={barnProjectImagesFlat.afterHero.alt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          </div>
          <div className="hero__shot hero__shot--commercial">
            <Image
              src="/images/metal-exterior-wide.png"
              alt="Completed commercial building with black vertical metal siding and metal roofing"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 45vw"
              style={{ objectFit: "cover", objectPosition: "center 45%" }}
            />
          </div>
        </div>
        <div className="hero__shade" />
        <div className="wrap hero__content">
          <p className="eyebrow">{SERVICE_AREA_SHORT.toUpperCase()}</p>
          <h1 className="hero__brand">
            <Mark size="hero" priority />
            <span className="visually-hidden">HBG Construction</span>
          </h1>
          <p className="hero__offer">Roofing, Siding &amp; Contracting</p>
          <p className="hero__copy">
            Serving Western Pennsylvania and Northeast Ohio.
          </p>
          <p className="hero__trust">{BUSINESS_TRUST_LINE}</p>
          <div className="button-row">
            <Button href={ESTIMATE_HREF} light>REQUEST A QUOTE</Button>
            <PhoneLink className="text-button" prefix="CALL " />
          </div>
        </div>
      </section>

      <section className="home-services wrap" id="services">
        <div className="home-heading home-heading--split">
          <div>
            <p className="eyebrow">EXTERIOR SERVICES</p>
            <h2>WHAT WE DO</h2>
          </div>
          <p>Roofing, siding, windows &amp; doors, buildings, and garages.</p>
        </div>

        <div className="home-categories">
          {serviceCategories.map((category) => (
            <section className="home-category" key={category.id} aria-labelledby={`cat-${category.id}`}>
              <div className="home-category__intro">
                <p className="eyebrow">{category.eyebrow}</p>
                <h3 id={`cat-${category.id}`}>{category.title}</h3>
                <p>{category.summary}</p>
              </div>
              <div className={`home-category__grid home-category__grid--${category.items.length}`}>
                {category.items.map((item) => (
                  <Link href={item.href} className="home-service" key={`${category.id}-${item.label}`}>
                    <AssetPanel kind={item.imageKind} contain={item.contain} />
                    <div className="home-service__body">
                      <h4>{item.label}</h4>
                      <span className="home-service__cta">LEARN MORE ↗</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="home-services__cta">
          <Button href={ESTIMATE_HREF}>REQUEST A FREE ESTIMATE</Button>
          <Link className="simple-link" href="/projects">
            OUR WORK ↗
          </Link>
        </div>
      </section>

      <section className="home-transformation">
        <div className="wrap">
          <div className="home-heading home-heading--split">
            <div>
              <p className="eyebrow">OUR WORK</p>
              <h2>REAL PROJECTS</h2>
            </div>
            <p>Before-and-after photos from completed HBG metal exterior projects—not representative stock.</p>
          </div>
          <div className="home-compares">
            <div className="home-compare">
              <p className="home-compare__label">Garage exterior</p>
              <BeforeAfter />
            </div>
            <div className="home-compare">
              <p className="home-compare__label">Barn front</p>
              <BeforeAfter
                className="before-after--barn-front"
                beforeSrc={barnBeforeAfterPrimary.before.src}
                afterSrc={barnBeforeAfterPrimary.after.src}
                beforeAlt={barnBeforeAfterPrimary.before.alt}
                afterAlt={barnBeforeAfterPrimary.after.alt}
                imagePosition={{ before: "center 42%", after: "center 55%" }}
              />
            </div>
          </div>
          <div className="home-featured-links">
            <Link className="button" href="/projects">
              VIEW OUR PROJECTS <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="why wrap">
        <div className="home-heading">
          <div>
            <Mark size="section" className="brand--ink" />
            <p className="eyebrow">WHY HBG</p>
            <h2>STRAIGHTFORWARD FROM QUOTE TO FINISH.</h2>
          </div>
        </div>
        <div className="why__grid">
          <article>
            <span>01</span>
            <h3>WRITTEN ESTIMATES</h3>
            <p>Scope and pricing in writing before work starts—no vague verbal quotes.</p>
          </article>
          <article>
            <span>02</span>
            <h3>LICENSED &amp; INSURED</h3>
            <p>PA registered and fully insured, with one crew standard from start to finish.</p>
          </article>
          <article>
            <span>03</span>
            <h3>ONE POINT OF CONTACT</h3>
            <p>The same person stays with your project from the first call through completion.</p>
          </article>
        </div>
      </section>

      <section className="service-area wrap">
        <p className="eyebrow">WHERE WE WORK</p>
        <div>
          <Link href="/service-areas/pittsburgh-pa">GREATER PITTSBURGH</Link>
          <Link href="/service-areas/cranberry-township-pa">CRANBERRY TOWNSHIP</Link>
          <Link href="/service-areas/butler-county-pa">BUTLER COUNTY</Link>
          <Link href="/service-areas/mercer-county-pa">MERCER COUNTY</Link>
          <span>NORTHEAST OHIO</span>
        </div>
        <Link className="simple-link service-area__all" href="/service-areas">
          VIEW SERVICE AREAS ↗
        </Link>
      </section>

      <section className="home-cta">
        <div className="wrap">
          <div>
            <Mark size="cta" />
            <p className="eyebrow">NEXT STEP</p>
            <h2>REQUEST A QUOTE.</h2>
          </div>
          <div className="button-row">
            <Button href={ESTIMATE_HREF} light>REQUEST A QUOTE</Button>
            <PhoneLink className="text-button text-button--on-dark" prefix="CALL " />
          </div>
        </div>
      </section>
    </>
  );
}
