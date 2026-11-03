export const PROPERTY_TYPES = ["residential", "commercial"] as const;
export const WORK_TYPES = ["new_installation", "replacement", "renovation"] as const;
export const PROJECT_TYPES = [
  "metal_roofing",
  "metal_siding",
  "board_and_batten",
  "pole_building",
  "other",
] as const;
export const TIMELINES = [
  "asap",
  "1_3_months",
  "3_6_months",
  "6_plus_months",
  "flexible",
  "not_sure",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type WorkType = (typeof WORK_TYPES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type Timeline = (typeof TIMELINES)[number];

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
  address?: string;
  zip: string;
  propertyType: PropertyType;
  projectType: ProjectType;
  workType: WorkType;
  description: string;
  timeline: Timeline;
  projectSize?: string;
  budget?: string;
  consent: true;
  attribution: LeadAttribution;
  photos: LeadPhoto[];
  emailStatus: "sent" | "skipped" | "failed";
  emailError?: string;
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
    | "zip"
    | "propertyType"
    | "projectType"
    | "workType"
    | "description"
    | "timeline"
    | "projectSize"
    | "budget"
    | "photos"
    | "consent"
    | "form",
    string
  >
>;

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  metal_roofing: "Metal Roofing",
  metal_siding: "Metal Siding",
  board_and_batten: "Metal Board & Batten Siding",
  pole_building: "Pole Building",
  other: "Other",
};

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  new_installation: "New installation",
  replacement: "Replacement",
  renovation: "Renovation",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  residential: "Residential",
  commercial: "Commercial",
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  asap: "As soon as possible",
  "1_3_months": "1–3 months",
  "3_6_months": "3–6 months",
  "6_plus_months": "6+ months",
  flexible: "Flexible",
  not_sure: "Not sure yet",
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
      return "other";
    default:
      return undefined;
  }
}
