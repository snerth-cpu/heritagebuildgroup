import { LocationPage } from "@/components/location-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Cranberry Township PA",
  description: "Residential and commercial metal roofing and siding in Cranberry Township, PA, with standing seam roofing and coordinated exterior systems.",
  path: "/service-areas/cranberry-township-pa",
});

export default function Page() {
  return (
    <LocationPage
      location={{
        name: "Cranberry Township",
        path: "/service-areas/cranberry-township-pa",
        kicker: "CRANBERRY TOWNSHIP • BUTLER COUNTY",
        title: "METAL ROOFING & SIDING IN CRANBERRY TOWNSHIP, PA",
        intro: "Metal roofing and siding for Cranberry Township homes, commercial properties, and growing business corridors.",
        lead: "Cranberry Township projects often need a modern look that still holds up. Metal roofing, siding, and trim planned together are a strong fit for homes and commercial buildings.",
        imageKind: "roof",
        sections: [
          {
            title: "Residential metal roofing",
            copy: "For a Cranberry Township home, metal roofing can look clean and last. We look at roof shape, nearby materials, drainage, and the visible details before we write the scope.",
          },
          {
            title: "Metal siding and exterior updates",
            copy: "Metal siding can cover the whole wall or be one part of a larger update. Panel size and trim should look like they belong on the building—not like an add-on.",
          },
          {
            title: "Commercial property coordination",
            copy: "Commercial jobs need a plan for access, daily operations, and how the roof meets the walls. A clear proposal shows what is included before installation starts.",
          },
        ],
        projectNote: "Tell us whether the property is residential or commercial, which walls or roof areas are involved, and how you want the finished exterior to look. Photos help us see transitions and access.",
      }}
    />
  );
}
