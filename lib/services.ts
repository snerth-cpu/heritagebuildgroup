import { barnProjectImagesFlat, poleBuildingBoardAndBatten } from "@/lib/projects";
import { absoluteUrl, ESTIMATE_HREF, SERVICE_AREA_REGION, SERVICE_AREA_SHORT, SITE_URL } from "@/lib/seo";

export type ServiceSlug =
  | "metal-roofing"
  | "metal-siding"
  | "barn-siding"
  | "pole-buildings"
  | "garages";

export type ServiceFaq = { question: string; answer: string };

export type ServicePhoto = {
  src: string;
  alt: string;
  position?: string;
  contain?: boolean;
};

export type LeadService = {
  slug: ServiceSlug;
  path: `/${ServiceSlug}`;
  navLabel: string;
  /** When false, omit from homepage “What We Build” cards (page still exists for Ads/SEO). */
  showOnHome?: boolean;
  cardTitle: string;
  cardCopy: string;
  cardKind: string;
  /** Suggested Ads / SEO headline (sentence case). */
  headline: string;
  /** Display title in page hero (site style: condensed uppercase). */
  heroTitle: string;
  kicker: string;
  heroCopy: string;
  heroKind: string;
  heroContain?: boolean;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  body: string[];
  depth: [{ eyebrow: string; title: string; copy: string }, { eyebrow: string; title: string; copy: string }];
  photos: ServicePhoto[];
  related: { label: string; href: string }[];
  faqs: ServiceFaq[];
  /** Jobber project-type label visitors should pick (and that Jobber should offer). */
  projectTypeLabel: string;
  /** Whether supply/install options apply on this page. */
  asksScope: boolean;
  /** Whether existing vs new building applies. */
  asksBuildingStatus: boolean;
};

/** Short, accurate service-area line for lead pages. Not statewide. */
export const LEAD_SERVICE_AREA = SERVICE_AREA_REGION;

export const LEAD_SERVICE_AREA_SHORT = SERVICE_AREA_SHORT;

export function estimateHrefForService(slug?: string | null) {
  if (!slug) return ESTIMATE_HREF;
  const params = new URLSearchParams({ service: slug });
  return `/estimate?${params.toString()}#estimate-form`;
}

export const leadServices: LeadService[] = [
  {
    slug: "metal-roofing",
    path: "/metal-roofing",
    navLabel: "Metal Roofing",
    cardTitle: "METAL ROOFING",
    cardCopy: "Supply and install standing seam and metal roofing for homes, barns, and garages.",
    cardKind: "roof",
    headline: "Metal Roof Installation for Homes, Barns & Garages",
    heroTitle: "METAL ROOF INSTALLATION FOR HOMES, BARNS & GARAGES.",
    kicker: "METAL ROOFING • SUPPLY & INSTALL",
    heroCopy: `We supply and install metal roofing for homes, barns, and garages across ${LEAD_SERVICE_AREA}.`,
    heroKind: "roof",
    metaTitle: "Metal Roof Installation | Homes, Barns & Garages",
    metaDescription: `Metal roof supply and installation for homes, barns, and garages in ${LEAD_SERVICE_AREA}. Request a quote from HBG Construction.`,
    lead: "HBG Construction supplies and installs metal roofing—not materials-only drop-offs by default.",
    body: [
      "We plan the roof around shape, drainage, penetrations, and where the roof meets walls or other materials.",
      "Standing seam and metal roofing both get a written scope before work starts. Color, panel style, and trim are part of that plan.",
    ],
    depth: [
      {
        eyebrow: "HOMES & OUTBUILDINGS",
        title: "Roofs that fit the building.",
        copy: "Houses, barns, and garages—scoped so the finished roof looks and performs as one system.",
      },
      {
        eyebrow: "SUPPLY & INSTALL",
        title: "Materials and crew together.",
        copy: "We supply the metal roofing system and install it. Ask if you need installation only or materials only.",
      },
    ],
    photos: [
      {
        src: "/images/metal-roofing-barn-install.jpg",
        alt: "Crew installing standing seam metal roofing on a black board-and-batten barn",
        position: "center 40%",
      },
      {
        src: "/images/metal-roofing-roof.png",
        alt: "Angled view of corrugated metal roofing on a commercial building",
      },
    ],
    related: [
      { label: "Metal Siding", href: "/metal-siding" },
      { label: "Barn Siding", href: "/barn-siding" },
      { label: "Pole Buildings", href: "/pole-buildings" },
      { label: "Garages", href: "/garages" },
    ],
    faqs: [
      {
        question: "Do you supply and install metal roofing?",
        answer:
          "Yes. HBG Construction supplies and installs metal roofing for homes, barns, and garages. Tell us if you need installation only or materials only.",
      },
      {
        question: "Where do you install metal roofs?",
        answer: `We serve ${LEAD_SERVICE_AREA}. We do not claim statewide coverage.`,
      },
      {
        question: "How do I get a metal roofing quote?",
        answer:
          "Request a Quote, or call. Share the building type, ZIP code, and a short project description. Photos help when you have them.",
      },
    ],
    projectTypeLabel: "Metal Roofing",
    asksScope: true,
    asksBuildingStatus: true,
  },
  {
    slug: "metal-siding",
    path: "/metal-siding",
    navLabel: "Metal Siding",
    cardTitle: "METAL SIDING",
    cardCopy: "Supply and install metal siding for homes, barns, and commercial walls—including board-and-batten.",
    cardKind: "siding",
    headline: "Metal Siding Installation & Replacement",
    heroTitle: "METAL SIDING INSTALLATION & REPLACEMENT.",
    kicker: "METAL SIDING • SUPPLY & INSTALL",
    heroCopy: `We supply and install metal siding—including board-and-batten—for homes and working buildings across ${LEAD_SERVICE_AREA}.`,
    heroKind: "siding",
    heroContain: true,
    metaTitle: "Metal Siding Installation & Replacement",
    metaDescription: `Metal siding supply, installation, and replacement in ${LEAD_SERVICE_AREA}. Board-and-batten and metal wall panels by HBG Construction.`,
    lead: "Metal siding updates an exterior with a durable finish and clean lines.",
    body: [
      "We supply and install the wall system—panels, openings, corners, and trim—so the finished wall reads as one job.",
      "For homes, board-and-batten is a common residential look. For commercial walls, we plan large surfaces for a consistent finish.",
      "Replacing siding on an existing barn is different from building a new pole building. If you need a new structure, see Pole Buildings.",
    ],
    depth: [
      {
        eyebrow: "HOMES",
        title: "Board-and-batten and more.",
        copy: "Vertical metal that still feels like a house—finished at every opening.",
      },
      {
        eyebrow: "REPLACEMENT",
        title: "New siding on what you have.",
        copy: "We replace tired exteriors on existing buildings. New post-frame construction is scoped under Pole Buildings.",
      },
    ],
    photos: [
      {
        src: barnProjectImagesFlat.afterGable.src,
        alt: barnProjectImagesFlat.afterGable.alt,
        position: "center 45%",
      },
      {
        src: barnProjectImagesFlat.afterLongWall.src,
        alt: barnProjectImagesFlat.afterLongWall.alt,
        position: "center 40%",
      },
      {
        src: "/images/metal-exterior-wide.png",
        alt: "Completed commercial building with black vertical metal siding and metal roofing",
        position: "center 55%",
      },
    ],
    related: [
      { label: "Barn Siding", href: "/barn-siding" },
      { label: "Metal Roofing", href: "/metal-roofing" },
      { label: "Pole Buildings", href: "/pole-buildings" },
      { label: "Commercial", href: "/commercial" },
    ],
    faqs: [
      {
        question: "Do you supply and install metal siding?",
        answer:
          "Yes. We supply and install metal siding, including board-and-batten. Say if you need installation only or materials only.",
      },
      {
        question: "Is barn siding the same as a new pole building?",
        answer:
          "No. Barn siding replacement updates the exterior on an existing barn. A new pole building is a new structure—see our Pole Buildings page.",
      },
      {
        question: "Where do you install metal siding?",
        answer: `We serve ${LEAD_SERVICE_AREA}.`,
      },
    ],
    projectTypeLabel: "Metal Siding",
    asksScope: true,
    asksBuildingStatus: true,
  },
  {
    slug: "barn-siding",
    path: "/barn-siding",
    navLabel: "Barn Siding",
    showOnHome: false,
    cardTitle: "BARN SIDING",
    cardCopy: "Replace and upgrade siding on existing barns—distinct from new pole building construction.",
    cardKind: "siding",
    headline: "Barn Siding Replacement & Upgrades",
    heroTitle: "BARN SIDING REPLACEMENT & UPGRADES.",
    kicker: "EXISTING BARNS • SIDING REPLACEMENT",
    heroCopy: `We replace and upgrade siding on existing barns across ${LEAD_SERVICE_AREA}. This is exterior work on a building you already have—not a new pole building.`,
    heroKind: "siding",
    heroContain: true,
    metaTitle: "Barn Siding Replacement & Upgrades",
    metaDescription: `Barn siding replacement and upgrades for existing barns in ${LEAD_SERVICE_AREA}. Distinct from new pole building construction. HBG Construction.`,
    lead: "Barn siding replacement puts a new metal exterior on the barn you already have.",
    body: [
      "We remove or cover tired siding and install metal panels with finished corners, openings, and trim.",
      "This page is for existing barns. If you need a new post-frame building, kits, and construction, use Pole Buildings instead.",
    ],
    depth: [
      {
        eyebrow: "EXISTING BARN",
        title: "Update the exterior.",
        copy: "Siding replacement and upgrades on the structure you already use.",
      },
      {
        eyebrow: "NOT A NEW BUILD",
        title: "New barns are Pole Buildings.",
        copy: "Complete kits and construction for a new building are scoped on our Pole Buildings page.",
      },
    ],
    photos: [
      {
        src: barnProjectImagesFlat.afterGable.src,
        alt: barnProjectImagesFlat.afterGable.alt,
        position: "center 45%",
      },
      {
        src: barnProjectImagesFlat.afterLongWall.src,
        alt: barnProjectImagesFlat.afterLongWall.alt,
        position: "center 40%",
      },
      {
        src: barnProjectImagesFlat.afterHero.src,
        alt: barnProjectImagesFlat.afterHero.alt,
        position: "center 40%",
      },
    ],
    related: [
      { label: "Metal Siding", href: "/metal-siding" },
      { label: "Pole Buildings", href: "/pole-buildings" },
      { label: "Metal Roofing", href: "/metal-roofing" },
      { label: "Barn Project", href: "/projects/black-board-and-batten-barn" },
    ],
    faqs: [
      {
        question: "Is this for an existing barn or a new building?",
        answer:
          "Barn siding is for an existing barn. New pole buildings—including kits and construction—are listed under Pole Buildings.",
      },
      {
        question: "Do you only do metal siding on barns?",
        answer:
          "Our documented barn project used black board-and-batten metal siding. Ask about the look and scope that fit your barn.",
      },
      {
        question: "How do I request a barn siding quote?",
        answer:
          "Request a Quote and choose Barn Siding as the project type. Include ZIP code, approximate size if you know it, and a short description.",
      },
    ],
    projectTypeLabel: "Barn Siding",
    asksScope: true,
    asksBuildingStatus: false,
  },
  {
    slug: "pole-buildings",
    path: "/pole-buildings",
    navLabel: "Pole Buildings",
    cardTitle: "POLE BUILDINGS",
    cardCopy: "Complete building kits and construction for new post-frame buildings.",
    cardKind: "pole",
    headline: "Pole Building Kits & Construction",
    heroTitle: "POLE BUILDING KITS & CONSTRUCTION.",
    kicker: "POLE BUILDINGS • KITS & BUILD",
    heroCopy: `HBG Construction supplies complete building kits and construction for new pole buildings across ${LEAD_SERVICE_AREA}.`,
    heroKind: "pole",
    heroContain: true,
    metaTitle: "Pole Building Kits & Construction",
    metaDescription: `Pole building kits and construction in ${LEAD_SERVICE_AREA}. HBG Construction supplies the kit and builds the structure.`,
    lead: "We supply complete building kits and construct the pole building.",
    body: [
      "Scope covers the post-frame structure, openings, roof, and exterior finish as written in your estimate. Optional items are only included when they are in that scope—we do not imply every upgrade comes standard.",
      "Barns, shops, storage, and light-commercial layouts are planned around how you use the property.",
      "Siding replacement on an existing barn is a different job—see Barn Siding.",
    ],
    depth: [
      {
        eyebrow: "KITS + CONSTRUCTION",
        title: "Supply and build.",
        copy: "Complete kit supply and construction. Your written estimate lists what is included.",
      },
      {
        eyebrow: "SIZED TO USE",
        title: "Layout that works.",
        copy: "Doors, height, and finish planned around equipment, storage, or shop work.",
      },
    ],
    photos: [
      {
        src: poleBuildingBoardAndBatten.src,
        alt: poleBuildingBoardAndBatten.alt,
        position: "center 55%",
      },
    ],
    related: [
      { label: "Garages", href: "/garages" },
      { label: "Barn Siding", href: "/barn-siding" },
      { label: "Metal Roofing", href: "/metal-roofing" },
      { label: "Metal Siding", href: "/metal-siding" },
    ],
    faqs: [
      {
        question: "Do you supply the kit and build the building?",
        answer:
          "Yes. HBG Construction supplies complete building kits and provides construction. Your estimate lists what is included for your project.",
      },
      {
        question: "Are all options included in every pole building?",
        answer:
          "No. Optional items are included only when they are written into your estimate. Ask about doors, height, finish, and other choices for your site.",
      },
      {
        question: "Is barn siding the same service?",
        answer:
          "No. Pole buildings are new construction. Replacing siding on an existing barn is covered on our Barn Siding page.",
      },
    ],
    projectTypeLabel: "Pole Building",
    asksScope: false,
    asksBuildingStatus: false,
  },
  {
    slug: "garages",
    path: "/garages",
    navLabel: "Garages",
    cardTitle: "GARAGES",
    cardCopy: "Detached garage construction sized for vehicles, storage, and shop space.",
    cardKind: "installation",
    headline: "Detached Garage Construction",
    heroTitle: "DETACHED GARAGE CONSTRUCTION.",
    kicker: "GARAGES • DETACHED & SHOP-STYLE",
    heroCopy: `We build detached garages for vehicles, storage, and work space across ${LEAD_SERVICE_AREA}.`,
    heroKind: "installation",
    metaTitle: "Detached Garage Construction",
    metaDescription: `Detached garage construction in ${LEAD_SERVICE_AREA}. Sized for parking, storage, and shop use. Request a quote from HBG Construction.`,
    lead: "A useful garage starts with how you park, store, and work.",
    body: [
      "We build detached garages, including taller shop-style buildings with wider doors or extra work space.",
      "Exterior finish can include metal roofing or siding when you want a durable look.",
      "Larger post-frame structures and complete kits are listed under Pole Buildings.",
    ],
    depth: [
      {
        eyebrow: "DETACHED",
        title: "Fit the driveway and lot.",
        copy: "Size, doors, and finish planned around how you approach and use the building.",
      },
      {
        eyebrow: "STORAGE & SHOP",
        title: "More than parking.",
        copy: "When the garage doubles as storage or a workshop, layout and durability come first.",
      },
    ],
    photos: [
      {
        src: "/images/04_installation_wide_panels.jpeg",
        alt: "Metal siding panels staged during installation",
      },
      {
        src: "/images/01_finished_exterior_hero.jpeg",
        alt: "Completed long elevation with black metal siding",
      },
    ],
    related: [
      { label: "Pole Buildings", href: "/pole-buildings" },
      { label: "Metal Roofing", href: "/metal-roofing" },
      { label: "Metal Siding", href: "/metal-siding" },
      { label: "Additions", href: "/additions" },
    ],
    faqs: [
      {
        question: "Do you build detached garages?",
        answer:
          "Yes. Detached garage construction is a main service. Tell us size, door needs, and whether you want metal roofing or siding.",
      },
      {
        question: "How is a garage different from a pole building?",
        answer:
          "Garages are sized for parking and related storage or shop use. Larger post-frame barns, shops, and kits are listed under Pole Buildings.",
      },
      {
        question: "Where do you build garages?",
        answer: `We serve ${LEAD_SERVICE_AREA}.`,
      },
    ],
    projectTypeLabel: "Garage",
    asksScope: false,
    asksBuildingStatus: true,
  },
];

export function getLeadService(slug: string | null | undefined) {
  if (!slug) return undefined;
  return leadServices.find((service) => service.slug === slug);
}

/** Homepage “What We Build” cards — excludes secondary/Ads-only landings. */
export function homeLeadServices() {
  return leadServices.filter((service) => service.showOnHome !== false);
}

export function leadServiceSchema(service: LeadService) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.headline,
    serviceType: service.projectTypeLabel,
    description: service.metaDescription,
    url: absoluteUrl(service.path),
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Western Pennsylvania" },
      { "@type": "City", name: "Pittsburgh", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
      { "@type": "City", name: "Cranberry Township", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
      { "@type": "AdministrativeArea", name: "Butler County, Pennsylvania" },
      { "@type": "AdministrativeArea", name: "Mercer County, Pennsylvania" },
      { "@type": "AdministrativeArea", name: "Northeast Ohio" },
    ],
  };
}

export function faqSchema(faqs: ServiceFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
