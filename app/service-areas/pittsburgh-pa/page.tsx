import { LocationPage } from "@/components/location-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metal Roofing & Siding Pittsburgh PA",
  description: "Premium metal roofing, standing seam roofing, metal siding, and commercial metal exterior projects throughout Pittsburgh and Greater Pittsburgh, PA.",
  path: "/service-areas/pittsburgh-pa",
});

export default function Page() {
  return (
    <LocationPage
      location={{
        name: "Pittsburgh",
        path: "/service-areas/pittsburgh-pa",
        kicker: "PRIMARY SERVICE AREA • PITTSBURGH PA",
        title: "METAL ROOFING & SIDING IN PITTSBURGH, PA",
        intro: "Metal roofing and siding for homes and commercial buildings throughout Pittsburgh and Greater Pittsburgh.",
        lead: "Pittsburgh has a mix of older homes, commercial buildings, and updated properties. Exterior work should respect what is already there and still last.",
        imageKind: "hero",
        sections: [
          {
            title: "Standing seam metal roofing in Pittsburgh",
            copy: "A standing seam metal roof has a clean, durable look that works on homes and commercial buildings. The job starts with the roof shape and includes valleys, edges, pipes, drainage, and where the roof meets the walls.",
          },
          {
            title: "Metal siding for Pittsburgh properties",
            copy: "Vertical metal siding can update an exterior and add lasting protection. Panel layout, window and door trim, corners, and where materials meet are planned as one job.",
          },
          {
            title: "Commercial metal exterior projects",
            copy: "For commercial properties, we plan metal roofing, siding, trim, and updates as one clear scope. The focus is the building in front of us, the order of work, and clear communication.",
          },
        ],
        projectNote: "Share the building type, the current exterior, the work you are considering, and any photos. We will use that to figure out whether the next step is roofing, siding, or both.",
      }}
    />
  );
}
