import Link from "next/link";
import { ServiceLeadPage } from "@/components/service-lead";
import { getLeadService } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

const service = getLeadService("pole-buildings")!;

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

export default function Page() {
  return (
    <ServiceLeadPage service={service}>
      <p className="service-lead__note">
        Replacing siding on a barn you already have?{" "}
        <Link className="text-link" href="/barn-siding">
          See barn siding replacement
        </Link>
        .
      </p>
    </ServiceLeadPage>
  );
}
