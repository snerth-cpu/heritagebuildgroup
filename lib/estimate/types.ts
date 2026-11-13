export const PROJECT_TYPES = [
  "metal_roofing",
  "metal_siding",
  "board_and_batten",
  "pole_building",
  "garage",
  "pole_buildings_garages",
  "shingle_roofing",
  "vinyl_siding",
  "fiber_cement_siding",
  "window_replacement",
  "door_replacement",
  "garage_door",
  "window_door_replacement",
  "decks",
  "additions_renovations",
  "other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type LeadAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landing_path?: string;
  service_slug?: string;
};

export type LeadPhoto = {
  key: string;
  filename: string;
  contentType: string;
  size: number;
};

export type LeadRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  unit?: string;
  city?: string;
  state?: string;
  zip: string;
  projectType: ProjectType;
  description: string;
  consent: true;
  attribution: LeadAttribution;
  photos: LeadPhoto[];
  /** Staff notify (scott@) status. */
  emailStatus: "sent" | "skipped" | "failed";
  emailError?: string;
  /** Customer confirmation email status. */
  customerEmailStatus?: "sent" | "skipped" | "failed";
  customerEmailError?: string;
  userAgent?: string;
  /** Truncated / hashed client hint for rate-limit diagnostics only — not PII. */
  clientKey?: string;
};

export type EstimateFieldErrors = Partial<
  Record<
    | "name"
    | "phone"
    | "email"
    | "address"
    | "unit"
    | "city"
    | "state"
    | "zip"
    | "projectType"
    | "description"
    | "photos"
    | "consent"
    | "form"
    | "detail",
    string
  >
>;

/** Labels aligned with site service names. Legacy keys retained for saved leads. */
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  metal_roofing: "Metal Roofing",
  shingle_roofing: "Shingle Roofing",
  metal_siding: "Metal Siding",
  vinyl_siding: "Vinyl Siding",
  fiber_cement_siding: "Fiber-Cement Siding",
  window_replacement: "Window Replacement",
  door_replacement: "Exterior Door Replacement",
  garage_door: "Garage Door Installation / Replacement",
  pole_building: "Pole Buildings",
  garage: "Garages",
  pole_buildings_garages: "Pole Buildings & Garages",
  board_and_batten: "Barn Siding",
  window_door_replacement: "Windows & Doors",
  decks: "Decks",
  additions_renovations: "Additions & Renovations",
  other: "Other",
};

/**
 * Ordered options shown on the estimate form.
 * Legacy types remain valid in PROJECT_TYPES for stored leads.
 */
export const ESTIMATE_FORM_PROJECT_TYPES: ProjectType[] = [
  "metal_roofing",
  "shingle_roofing",
  "metal_siding",
  "vinyl_siding",
  "pole_buildings_garages",
  "decks",
  "additions_renovations",
  "window_door_replacement",
  "other",
];

/** Map site service slugs → form project type. */
export function projectTypeFromServiceSlug(slug?: string | null): ProjectType | undefined {
  switch (slug) {
    case "metal-roofing":
      return "metal_roofing";
    case "metal-siding":
    case "barn-siding":
      return "metal_siding";
    case "pole-buildings":
    case "garages":
      return "pole_buildings_garages";
    case "shingle-roofing":
      return "shingle_roofing";
    case "vinyl-siding":
      return "vinyl_siding";
    case "fiber-cement-siding":
      return "other";
    case "window-replacement":
    case "door-replacement":
      return "window_door_replacement";
    case "garage-doors":
      return "other";
    case "additions":
      return "additions_renovations";
    default:
      return undefined;
  }
}
