export type ProjectRecord = {
  slug: string;
  title: string;
  description: string;
  services: { name: string; href: string }[];
  images: string[];
  location?: { name: string; serviceAreaHref?: string };
  materials?: string[];
  completedDate?: string;
};

// Future projects should only be added after location, services, materials, and
// photography are verified. Optional fields remain absent when facts are unknown.
export const completeExteriorTransformation: ProjectRecord = {
  slug: "complete-metal-exterior-transformation",
  title: "Complete Metal Exterior Transformation",
  description: "A documented exterior renovation using dark vertical metal siding, coordinated metal roofing, contrasting trim, and custom exterior details.",
  services: [
    { name: "Metal Roofing", href: "/metal-roofing" },
    { name: "Metal Siding", href: "/metal-siding" },
    { name: "Exterior Renovation", href: "/commercial" },
  ],
  images: ["metal-exterior-wide.png", "02_before_front.jpeg", "03_before_side_roof.jpeg", "04_installation_wide_panels.jpeg", "05_installation_close.jpeg", "06_installation_facade.jpeg", "07_near_complete_roof_siding.jpeg"],
};
