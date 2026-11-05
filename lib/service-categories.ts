/**
 * Primary exterior service taxonomy for homepage + navigation.
 * Existing HBG project photography stays on its current pages/sections;
 * representative imagery is only used where noted.
 */

export type ServiceNavItem = {
  label: string;
  href: string;
  /** AssetPanel kind for homepage category grids */
  imageKind: string;
  /** False = representative imagery; must be labeled in UI */
  realProjectPhoto: boolean;
  contain?: boolean;
};

export type ServiceCategory = {
  id: "roofing" | "siding" | "windows-doors" | "buildings-garages";
  title: string;
  eyebrow: string;
  summary: string;
  items: ServiceNavItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "roofing",
    title: "Roofing",
    eyebrow: "ROOFING",
    summary: "Metal and asphalt shingle roofing for homes and outbuildings.",
    items: [
      {
        label: "Metal Roofing",
        href: "/metal-roofing",
        imageKind: "roof",
        realProjectPhoto: true,
      },
      {
        label: "Asphalt Shingle Roofing",
        href: "/shingle-roofing",
        imageKind: "shingle",
        realProjectPhoto: false,
      },
    ],
  },
  {
    id: "siding",
    title: "Siding",
    eyebrow: "SIDING",
    summary: "Metal, vinyl, and fiber-cement exteriors—install and replacement.",
    items: [
      {
        label: "Metal Siding",
        href: "/metal-siding",
        imageKind: "siding",
        realProjectPhoto: true,
        contain: true,
      },
      {
        label: "Vinyl Siding",
        href: "/vinyl-siding",
        imageKind: "vinyl",
        realProjectPhoto: false,
      },
      {
        label: "Fiber-Cement Siding",
        href: "/fiber-cement-siding",
        imageKind: "fiber",
        realProjectPhoto: false,
      },
    ],
  },
  {
    id: "windows-doors",
    title: "Windows & Doors",
    eyebrow: "WINDOWS & DOORS",
    summary: "Window, exterior door, and garage door installation and replacement.",
    items: [
      {
        label: "Window Replacement",
        href: "/window-replacement",
        imageKind: "windows",
        realProjectPhoto: false,
      },
      {
        label: "Exterior Door Replacement",
        href: "/door-replacement",
        imageKind: "doors",
        realProjectPhoto: false,
      },
      {
        label: "Garage Door Installation & Replacement",
        href: "/garage-doors",
        imageKind: "garageDoor",
        realProjectPhoto: false,
      },
    ],
  },
  {
    id: "buildings-garages",
    title: "Buildings & Garages",
    eyebrow: "BUILDINGS & GARAGES",
    summary: "Pole buildings, barns, and detached garage construction.",
    items: [
      {
        label: "Pole Buildings",
        href: "/pole-buildings",
        imageKind: "pole",
        realProjectPhoto: true,
        contain: true,
      },
      {
        label: "Barns",
        href: "/barn-siding",
        imageKind: "siding",
        realProjectPhoto: true,
        contain: true,
      },
      {
        label: "Garages",
        href: "/garages",
        imageKind: "installation",
        realProjectPhoto: true,
      },
    ],
  },
];

/** Flat list for sitemap / footer (deduped by href). */
export function uniqueCategoryLinks() {
  const seen = new Set<string>();
  const links: { label: string; href: string }[] = [];
  for (const category of serviceCategories) {
    for (const item of category.items) {
      if (seen.has(item.href)) continue;
      seen.add(item.href);
      links.push({ label: item.label, href: item.href });
    }
  }
  return links;
}
