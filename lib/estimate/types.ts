export const PROJECT_TYPES = [
  "metal_roofing",
  "metal_siding",
  "board_and_batten",
  "pole_building",
  "garage",
  "window_door_replacement",
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

/** Labels aligned with Jobber / site service names. */
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  metal_roofing: "Metal Roofing",
  metal_siding: "Metal Siding",
  board_and_batten: "Barn Siding (Board & Batten)",
  pole_building: "Pole Building",
  garage: "Garage",
  window_door_replacement: "Window / Door Replacement",
  other: "Other",
};

/** Map site service slugs → form project type. */
export function projectTypeFromServiceSlug(slug?: string | null): ProjectType | undefined {
  switch (slug) {
    case "metal-roofing":
      return "metal_roofing";
    case "metal-siding":
      return "metal_siding";
    case "barn-siding":
      return "board_and_batten";
    case "pole-buildings":
      return "pole_building";
    case "garages":
      return "garage";
    default:
      return undefined;
  }
}
