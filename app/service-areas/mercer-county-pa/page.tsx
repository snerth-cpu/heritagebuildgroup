import { LocationPage } from "@/components/location-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Mercer County PA",
  description: "Premium metal roofing and siding for residential, commercial, and working properties throughout Mercer County, Pennsylvania.",
  path: "/service-areas/mercer-county-pa",
});

export default function Page() {
  return (
    <LocationPage
      location={{
        name: "Mercer County",
        path: "/service-areas/mercer-county-pa",
        kicker: "MERCER COUNTY • PENNSYLVANIA",
        title: "METAL ROOFING & SIDING IN MERCER COUNTY, PA",
        intro: "Durable metal roofing and siding for Mercer County homes, businesses, and working buildings.",
        lead: "Mercer County properties often need exteriors that last and are straightforward to maintain. Metal roofing and siding are a strong option for homes, businesses, and working buildings when the details are planned together.",
        imageKind: "commercial",
        sections: [
          {
            title: "Long-lasting metal roofing",
            copy: "A metal roof can look clean and last on Mercer County properties. Panels are only part of it: flashing, edges, drainage, pipes, and where the roof meets the walls all matter.",
          },
          {
            title: "Metal siding that fits the building",
            copy: "Metal siding gives an exterior a consistent look and lasting protection. We look at how panels meet the foundation, openings, corners, rooflines, and existing materials before we lock in the install plan.",
          },
          {
            title: "Residential and commercial scopes",
            copy: "A home update and a commercial project have different access, scheduling, and coordination needs. We start with the building type and plan the roofing, siding, trim, or combined job around it.",
          },
        ],
        projectNote: "Send photos and a short description of the current exterior, how the property is used, and whether roofing, siding, or both are being considered. That gives the estimate conversation a useful starting point.",
      }}
    />
  );
}
