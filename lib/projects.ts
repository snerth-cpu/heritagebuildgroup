export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
  feature?: boolean;
};

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

const BARN_ROOT = "/projects/black-board-and-batten-barn";

export const barnProjectImages = {
  before: [
    {
      src: `${BARN_ROOT}/01_BEFORE/before-red-barn-corner-angle.jpg`,
      alt: "Red metal barn exterior before the siding renovation",
      caption: "The barn before the new siding went on.",
      feature: true,
    },
    {
      src: `${BARN_ROOT}/01_BEFORE/before-red-barn-gable.jpg`,
      alt: "Gable end of the barn with aging red metal siding",
      caption: "Red metal and open framing on the gable end.",
    },
    {
      src: `${BARN_ROOT}/01_BEFORE/before-barn-exposed-frame-dusk.jpg`,
      alt: "Barn timber frame exposed at dusk",
      caption: "Open framing late in the day.",
    },
  ] satisfies ProjectImage[],
  during: [
    {
      src: `${BARN_ROOT}/02_PROGRESS/progress-siding-removed-crew.jpg`,
      alt: "Crew working with the barn framing exposed",
      caption: "Siding off, framing open.",
      feature: true,
    },
    {
      src: `${BARN_ROOT}/02_PROGRESS/progress-gable-siding-install.jpg`,
      alt: "Workers installing black metal siding on the barn gable",
      caption: "Panels going up on the gable.",
    },
    {
      src: `${BARN_ROOT}/02_PROGRESS/progress-side-wall-install.jpg`,
      alt: "Crew installing black metal siding on the barn side wall",
      caption: "Working across the long wall.",
      feature: true,
    },
    {
      src: `${BARN_ROOT}/02_PROGRESS/progress-corner-scaffolding.jpg`,
      alt: "Scaffolding along the barn during black metal siding install",
      caption: "Around the corner and openings.",
    },
    {
      src: `${BARN_ROOT}/02_PROGRESS/progress-windows-and-framing.jpg`,
      alt: "Barn with black siding on the gable and framing still open on the side",
      caption: "Windows in, siding still moving.",
    },
  ] satisfies ProjectImage[],
  after: [
    {
      src: `${BARN_ROOT}/03_COMPLETED/completed-black-barn-corner-hero.jpg`,
      alt: "Completed barn with black board-and-batten metal siding",
      caption: "Finished corner view.",
      feature: true,
    },
    {
      src: `${BARN_ROOT}/03_COMPLETED/completed-black-barn-gable.jpg`,
      alt: "Completed barn gable with black vertical metal siding",
      caption: "The finished gable.",
    },
  ] satisfies ProjectImage[],
};

export const barnProjectImagesFlat = {
  beforePrimary: barnProjectImages.before[0],
  afterHero: barnProjectImages.after[0],
};

export const exteriorProjectGallery = {
  before: [
    {
      src: "/images/02_before_front.jpeg",
      alt: "Building exterior before metal roofing and siding renovation",
      caption: "Existing conditions.",
      feature: true,
    },
    {
      src: "/images/03_before_side_roof.jpeg",
      alt: "Side wall and roof during exterior preparation",
      caption: "Prep along the side wall.",
    },
  ] satisfies ProjectImage[],
  during: [
    {
      src: "/images/04_installation_wide_panels.jpeg",
      alt: "Metal siding panels staged during installation",
      caption: "Panels staged for install.",
      feature: true,
    },
    {
      src: "/images/05_installation_close.jpeg",
      alt: "Installation crew working on the metal exterior",
      caption: "Close work on the wall.",
    },
    {
      src: "/images/06_installation_facade.jpeg",
      alt: "Metal siding installation across the building facade",
      caption: "Facade taking shape.",
    },
    {
      src: "/images/07_near_complete_roof_siding.jpeg",
      alt: "Nearly complete metal roofing and siding",
      caption: "Nearly wrapped.",
      feature: true,
    },
    {
      src: "/images/metal-roofing-roof.png",
      alt: "Corrugated metal roofing on the building",
      caption: "Roof details.",
    },
  ] satisfies ProjectImage[],
  after: [
    {
      src: "/images/metal-exterior-wide.png",
      alt: "Completed metal roofing and vertical metal siding",
      caption: "Finished exterior.",
      feature: true,
    },
    {
      src: "/images/01_finished_exterior_hero.jpeg",
      alt: "Completed long elevation with black metal siding",
      caption: "Long elevation.",
    },
    {
      src: "/images/metal-siding-front.png",
      alt: "Front view of the finished metal siding",
      caption: "Front elevation.",
    },
  ] satisfies ProjectImage[],
};

export const completeExteriorTransformation: ProjectRecord = {
  slug: "complete-metal-exterior-transformation",
  title: "Complete Metal Exterior Transformation",
  description:
    "A documented exterior renovation using dark vertical metal siding, coordinated metal roofing, contrasting trim, and custom exterior details.",
  services: [
    { name: "Metal Roofing", href: "/metal-roofing" },
    { name: "Metal Siding", href: "/metal-siding" },
    { name: "Exterior Renovation", href: "/commercial" },
  ],
  images: [
    "metal-exterior-wide.png",
    "02_before_front.jpeg",
    "03_before_side_roof.jpeg",
    "04_installation_wide_panels.jpeg",
    "05_installation_close.jpeg",
    "06_installation_facade.jpeg",
    "07_near_complete_roof_siding.jpeg",
    "01_finished_exterior_hero.jpeg",
    "metal-siding-front.png",
    "metal-roofing-roof.png",
  ],
};

export const blackBoardAndBattenBarn: ProjectRecord = {
  slug: "black-board-and-batten-barn",
  title: "Black Board-and-Batten Barn",
  description:
    "Black board-and-batten metal siding on an existing barn—shown from start through install to finish.",
  services: [
    { name: "Metal Siding", href: "/metal-siding" },
    { name: "Pole Buildings", href: "/pole-buildings" },
    { name: "Exterior Renovation", href: "/commercial" },
  ],
  images: [
    ...barnProjectImages.after.map((image) => image.src.replace(/^\//, "")),
    ...barnProjectImages.before.map((image) => image.src.replace(/^\//, "")),
    ...barnProjectImages.during.map((image) => image.src.replace(/^\//, "")),
  ],
};
