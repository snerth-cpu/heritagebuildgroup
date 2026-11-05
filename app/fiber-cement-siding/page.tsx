import { ServiceLeadPage } from "@/components/service-lead";
import { getLeadService } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

const service = getLeadService("fiber-cement-siding")!;

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

export default function Page() {
  return <ServiceLeadPage service={service} />;
}
