import { LocationPage } from "@/components/location-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Butler County PA",
  description: "Metal roofing, standing seam roofing, metal siding, and commercial exterior services for properties across Butler County, Pennsylvania.",
  path: "/service-areas/butler-county-pa",
});

export default function Page() {
  return (
    <LocationPage
      location={{
        name: "Butler County",
        path: "/service-areas/butler-county-pa",
        kicker: "BUTLER COUNTY • PENNSYLVANIA",
        title: "METAL ROOFING & SIDING IN BUTLER COUNTY, PA",
        intro: "Metal roofing and siding for homes, businesses, and working properties across Butler County.",
        lead: "Butler County has a wide mix of properties—from neighborhoods to rural and working buildings. That is why the scope and the install plan need to match the actual property.",
        imageKind: "siding",
        sections: [
          {
            title: "Metal roofing across varied properties",
            copy: "Roof shape, weather exposure, pipes, and site access can vary a lot from one Butler County property to another. Standing seam and other metal roofing should be planned around those conditions.",
          },
          {
            title: "Siding for homes and working buildings",
            copy: "Metal siding gives homes, businesses, and working buildings a durable, clean wall. Panel direction, the base of the wall, openings, and trim are planned together.",
          },
          {
            title: "A practical way to run the job",
            copy: "A clear scope matters when the job covers more than one wall, where the roof meets the walls, or a building that stays in use. One point of contact keeps materials, install stages, and communication connected.",
          },
        ],
        projectNote: "Include the property address, building use, approximate areas involved, and photos of the roof or walls. Those details help us talk through access, scope, and priorities.",
      }}
    />
  );
}
