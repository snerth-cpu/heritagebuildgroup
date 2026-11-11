import { LocationPage } from "@/components/location-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Erie County PA",
  description:
    "Metal roofing, metal siding, and building construction for homes, barns, garages, and commercial properties across Erie County, Pennsylvania.",
  path: "/service-areas/erie-county-pa",
});

export default function Page() {
  return (
    <LocationPage
      location={{
        name: "Erie County",
        path: "/service-areas/erie-county-pa",
        kicker: "ERIE COUNTY • PENNSYLVANIA",
        title: "METAL ROOFING & SIDING IN ERIE COUNTY, PA",
        intro:
          "Metal roofing, siding, and exterior construction for Erie County homes, barns, garages, and commercial properties.",
        lead: "Erie County properties need exteriors that hold up to lake-effect weather and everyday use. Metal roofing and siding are a durable option for homes, working buildings, and commercial exteriors when the project is planned around the building.",
        imageKind: "roof",
        sections: [
          {
            title: "Metal roofing for Erie County buildings",
            copy: "We install metal roofing on homes, barns, garages, and commercial buildings. Panel style, color, trim, and flashing are planned with the building before work starts.",
          },
          {
            title: "Metal siding and exterior updates",
            copy: "Metal siding gives walls a clean, lasting finish. We plan openings, corners, the wall base, and where the walls meet the roof so the exterior reads as one job.",
          },
          {
            title: "Homes, barns, and commercial work",
            copy: "Residential updates and commercial or agricultural buildings have different access and scheduling needs. We start with how the property is used and write a clear scope from there.",
          },
        ],
        projectNote:
          "Include the property location, building type, and whether the work involves roofing, siding, or both. Photos of the current exterior help us talk through scope and access.",
      }}
    />
  );
}
