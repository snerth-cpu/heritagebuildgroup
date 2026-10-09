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
    src: `${PROJECT_ROOT}/01_BEFORE/before-red-barn-front-angle.jpeg`,
    alt: "Existing red metal barn exterior before HBG Construction siding renovation",
  },
  beforeSecondary: {
    src: `${PROJECT_ROOT}/01_BEFORE/before-red-barn-side-angle.jpeg`,
    alt: "Existing barn before installation of black board-and-batten metal siding",
  },
  afterHero: {
    src: `${PROJECT_ROOT}/03_COMPLETED/completed-black-board-batten-hero-angle.jpeg`,
    alt: "Completed barn with black board-and-batten-style metal siding by HBG Construction",
  },
  completedLong: {
    src: `${PROJECT_ROOT}/03_COMPLETED/completed-black-board-batten-long-side.jpeg`,
    alt: "Completed long elevation with black board-and-batten-style metal siding",
    caption: "Completed long elevation with black board-and-batten-style metal siding.",
  },
  completedGable: {
    src: `${PROJECT_ROOT}/03_COMPLETED/completed-black-board-batten-gable.jpeg`,
    alt: "Completed gable elevation showing the finished vertical panel layout",
    caption: "Completed gable elevation showing the finished vertical panel layout.",
  },
  progress: [
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-existing-siding-removed.jpeg`,
      alt: "Existing barn exterior removed with framing exposed for new metal siding",
      caption: "Existing exterior removed and framing exposed for the new siding installation.",
      feature: true,
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-early-black-siding-installation.jpeg`,
      alt: "Black vertical metal siding beginning to cover the barn exterior",
      caption: "Black vertical metal siding beginning to transform the barn exterior.",
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-crew-installing-siding.jpeg`,
      alt: "HBG Construction crew installing black metal siding on the barn",
      caption: "HBG crew installing the new siding across the main elevation.",
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-gable-siding-installation.jpeg`,
      alt: "Board-and-batten metal siding installation continuing into the barn gable",
      caption: "Board-and-batten-style metal siding installation continuing into the gable.",
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-wide-installation-view.jpeg`,
      alt: "Metal siding installation progressing across multiple barn elevations",
      caption: "Installation progressing across multiple elevations of the barn.",
      feature: true,
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-siding-around-windows.jpeg`,
      alt: "Black metal siding carefully laid out around barn windows and openings",
      caption: "Careful panel layout around the barn's existing windows and openings.",
    },
    {
      src: `${PROJECT_ROOT}/02_PROGRESS/progress-gable-nearing-completion.jpeg`,
      alt: "Barn exterior nearing completion with black siding on upper elevations",
      caption: "The exterior nearing completion as the black siding continues through the upper elevations.",
    },
  ] satisfies ProjectImage[],
};

// Future projects should only be added after location, services, materials, and
// photography are verified. Optional fields remain absent when facts are unknown.
export const completeExteriorTransformation: ProjectRecord = {
  slug: "complete-metal-exterior-transformation",
  title: "Black Board-and-Batten Barn Exterior",
  description:
    "A documented barn exterior renovation: aging red metal siding replaced with black vertical board-and-batten-style metal siding by HBG Construction.",
  services: [
    { name: "Metal Siding", href: "/metal-siding" },
    { name: "Pole Buildings", href: "/pole-buildings" },
    { name: "Exterior Renovation", href: "/commercial" },
  ],
  images: [
    barnProjectImages.afterHero.src.replace(/^\//, ""),
    barnProjectImages.beforePrimary.src.replace(/^\//, ""),
    barnProjectImages.beforeSecondary.src.replace(/^\//, ""),
    ...barnProjectImages.progress.map((image) => image.src.replace(/^\//, "")),
    barnProjectImages.completedLong.src.replace(/^\//, ""),
    barnProjectImages.completedGable.src.replace(/^\//, ""),
  ],
};
