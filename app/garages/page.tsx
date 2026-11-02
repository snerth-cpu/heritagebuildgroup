import Link from "next/link";
import { ServiceLeadPage } from "@/components/service-lead";
import { getLeadService } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

const service = getLeadService("garages")!;

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

export default function Page() {
  return (
    <ServiceLeadPage service={service}>
      <p className="service-lead__note">
        Looking for a larger post-frame building or complete kit?{" "}
        <Link className="text-link" href="/pole-buildings">
          See pole building kits &amp; construction
        </Link>
        .
      </p>
    </ServiceLeadPage>
  );
}
