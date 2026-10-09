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

const PROJECT_ROOT = "/projects/black-board-and-batten-barn";

export const barnProjectImages = {
  beforePrimary: {
    src: `${PROJECT_ROOT}/01_BEFORE/before-red-barn-corner-angle.jpg`,
    alt: "Existing red metal barn exterior with open wall sections before HBG Construction siding renovation",
  },
  beforeSecondary: {
    src: `${PROJECT_ROOT}/01_BEFORE/before-red-barn-gable.jpg`,
    alt: "Gable end of the barn with aging red metal siding and exposed framing before renovation",
  },
  beforeTertiary: {
    src: `${PROJECT_ROOT}/01_BEFORE/before-barn-exposed-frame-dusk.jpg`,
    alt: "Barn with siding removed and timber frame exposed at dusk before new metal siding",
  },
  afterHero: {
    src: `${PROJECT_ROOT}/03_COMPLETED/completed-black-barn-corner-hero.jpg`,
    alt: "Completed barn with black board-and-batten metal siding by Heritage Build Group",
  },
  completedGable: {
    src: `${PROJECT_ROOT}/03_COMPLETED/completed-black-barn-gable.jpg`,
    alt: "Completed gable elevation with black vertical board-and-batten metal siding",
    caption: "Finished gable elevation with clean vertical panel layout.",
  },
  progress: [
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-siding-removed-crew.jpg`,
      alt: "Crew preparing the barn after original siding removal with timber frame exposed",
      caption: "Existing exterior removed and framing prepared for new siding.",
      feature: true,
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-gable-siding-install.jpg`,
      alt: "Workers installing black metal siding on the barn gable from scaffolding",
      caption: "Black board-and-batten panels going up on the gable.",
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-side-wall-install.jpg`,
      alt: "HBG crew installing black metal siding across the barn side wall",
      caption: "Installation progressing across the main elevation.",
      feature: true,
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-corner-scaffolding.jpg`,
      alt: "Scaffolding and ladders as black metal siding wraps the barn corner",
      caption: "Panels continuing around corners and openings.",
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-windows-and-framing.jpg`,
      alt: "Barn with new windows and black siding on the gable while framing remains on the side wall",
      caption: "Detail work around windows, framing, and the gable.",
    },
  ] satisfies ProjectImage[],
};

export const completeExteriorTransformation: ProjectRecord = {
  slug: "complete-metal-exterior-transformation",
  title: "From Red Barn to Modern Black Metal Exterior",
  description:
    "A complete exterior transformation featuring black board-and-batten metal siding, installed by Heritage Build Group.",
  services: [
    { name: "Metal Siding", href: "/metal-siding" },
    { name: "Pole Buildings", href: "/pole-buildings" },
    { name: "Exterior Renovation", href: "/commercial" },
  ],
  images: [
    barnProjectImages.afterHero.src.replace(/^\//, ""),
    barnProjectImages.beforePrimary.src.replace(/^\//, ""),
    barnProjectImages.beforeSecondary.src.replace(/^\//, ""),
    barnProjectImages.beforeTertiary.src.replace(/^\//, ""),
    ...barnProjectImages.progress.map((image) => image.src.replace(/^\//, "")),
    barnProjectImages.completedGable.src.replace(/^\//, ""),
  ],
};
