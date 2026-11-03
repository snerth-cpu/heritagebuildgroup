import Image from "next/image";
import Link from "next/link";
import { ServiceLeadPage } from "@/components/service-lead";
import { SectionHead } from "@/components/ui";
import { barnBeforeAfterPrimary } from "@/lib/projects";
import { getLeadService } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

const service = getLeadService("barn-siding")!;

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

export default function Page() {
  return (
    <ServiceLeadPage service={service}>
      <section className="siding-compare siding-compare--embedded">
        <SectionHead
          kicker="EXISTING BARN"
          title="BEFORE AND AFTER."
          copy="Same front elevation on an existing barn—siding replacement, not a new building."
        />
        <div
          className="ba-pair ba-pair--visible ba-pair--hero"
          aria-label={`${barnBeforeAfterPrimary.label} before and after`}
        >
          <figure className="ba-pair__item">
            <div className="ba-pair__frame">
              <Image
                src={barnBeforeAfterPrimary.before.src}
                alt={barnBeforeAfterPrimary.before.alt}
                fill
                sizes="(max-width: 800px) 100vw, 620px"
              />
            </div>
            <figcaption>BEFORE</figcaption>
          </figure>
          <figure className="ba-pair__item">
            <div className="ba-pair__frame">
              <Image
                src={barnBeforeAfterPrimary.after.src}
                alt={barnBeforeAfterPrimary.after.alt}
                fill
                sizes="(max-width: 800px) 100vw, 620px"
              />
            </div>
            <figcaption>AFTER</figcaption>
          </figure>
        </div>
        <p className="service-lead__note">
          Need a new pole building instead?{" "}
          <Link className="text-link" href="/pole-buildings">
            See pole building kits &amp; construction
          </Link>
          .
        </p>
        <Link className="simple-link" href="/projects/black-board-and-batten-barn">
          SEE THE FULL BARN PROJECT <span>↗</span>
        </Link>
      </section>
    </ServiceLeadPage>
  );
}
