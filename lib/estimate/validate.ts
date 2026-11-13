import {
  PROJECT_TYPES,
  type EstimateFieldErrors,
  type LeadAttribution,
  type ProjectType,
} from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const PHONE_DIGITS_RE = /^\d{10}$/;

export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
export const MIN_FORM_MS = 2800;

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

export function formatPhoneDisplay(digits: string) {
  if (digits.length !== 10) return digits;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function trim(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export type ValidatedEstimateInput = {
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
  photos: File[];
  startedAt: number;
};

export function validateEstimateFormData(
  form: FormData,
): { ok: true; data: ValidatedEstimateInput } | { ok: false; errors: EstimateFieldErrors; status: number } {
  const errors: EstimateFieldErrors = {};

  // Honeypot — bots fill hidden fields.
  const honeypot = trim(form.get("company_website"));
  if (honeypot) {
    return { ok: false, errors: { form: "Unable to submit right now." }, status: 400 };
  }

  const startedRaw = trim(form.get("_form_started_at"));
  const startedAt = Number(startedRaw);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return { ok: false, errors: { form: "Please reload the page and try again." }, status: 400 };
  }
  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_FORM_MS) {
    return { ok: false, errors: { form: "Please take a moment to complete the form, then try again." }, status: 429 };
  }
  // Reject absurdly old timestamps (replay / clock skew beyond 24h).
  if (elapsed > 24 * 60 * 60 * 1000) {
    return { ok: false, errors: { form: "Please reload the page and try again." }, status: 400 };
  }

  const name = trim(form.get("name"));
  if (name.length < 2 || name.length > 120) errors.name = "Enter your full name.";

  const phoneDigits = normalizePhone(trim(form.get("phone")));
  if (!PHONE_DIGITS_RE.test(phoneDigits)) errors.phone = "Enter a valid 10-digit U.S. phone number.";

  const emailRaw = trim(form.get("email")).toLowerCase();
  const email = emailRaw;
  if (email && (!EMAIL_RE.test(email) || email.length > 200)) {
    errors.email = "Enter a valid email address, or leave this field blank.";
  }

  // Street / city / state are optional — collected later when scheduling.
  const address = trim(form.get("address"));
  if (address.length > 200) errors.address = "Address is too long.";

  const unit = trim(form.get("unit"));
  if (unit.length > 40) errors.unit = "Unit / apt is too long.";

  const city = trim(form.get("city"));
  if (city.length > 100) errors.city = "City is too long.";

  const stateRaw = trim(form.get("state"));
  const state = stateRaw
    ? /^[A-Za-z]{2}$/.test(stateRaw)
      ? stateRaw.toUpperCase()
      : stateRaw
    : "";
  if (state && !/^[A-Z]{2}$/.test(state)) errors.state = "Enter a 2-letter state (e.g. PA), or leave blank.";

  const zip = trim(form.get("zip"));
  if (!ZIP_RE.test(zip)) errors.zip = "Enter a valid 5-digit ZIP code.";

  const projectType = trim(form.get("projectType")) as ProjectType;
  if (!PROJECT_TYPES.includes(projectType)) errors.projectType = "Select a project type.";

  const description = trim(form.get("description"));
  if (description.length > 4000) errors.description = "Description is too long.";

  const consent = trim(form.get("consent"));
  if (consent !== "yes") errors.consent = "Please confirm we may contact you about this request.";

  const photos = form
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (photos.length > MAX_PHOTOS) {
    errors.photos = `Up to ${MAX_PHOTOS} photos allowed.`;
  } else {
    for (const photo of photos) {
      const type = (photo.type || "").toLowerCase();
      const nameLower = photo.name.toLowerCase();
      const looksExecutable = /\.(exe|bat|cmd|sh|js|mjs|cjs|php|py|rb|jar|html|htm|svg)$/i.test(nameLower);
      if (looksExecutable || type.includes("svg") || type.includes("javascript") || type.includes("html")) {
        errors.photos = "Photos must be JPEG, PNG, WebP, or HEIC images.";
        break;
      }
      if (!ALLOWED_PHOTO_TYPES.has(type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(nameLower)) {
        errors.photos = "Photos must be JPEG, PNG, WebP, or HEIC images.";
        break;
      }
      if (photo.size > MAX_PHOTO_BYTES) {
        errors.photos = "Each photo must be 4 MB or smaller.";
        break;
      }
    }
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors, status: 400 };
  }

  let attribution: LeadAttribution = {};
  const attributionRaw = trim(form.get("attribution"));
  if (attributionRaw) {
    try {
      const parsed = JSON.parse(attributionRaw) as LeadAttribution;
      if (parsed && typeof parsed === "object") {
        attribution = {
          utm_source: str(parsed.utm_source),
          utm_medium: str(parsed.utm_medium),
          utm_campaign: str(parsed.utm_campaign),
          utm_content: str(parsed.utm_content),
          utm_term: str(parsed.utm_term),
          gclid: str(parsed.gclid),
          gbraid: str(parsed.gbraid),
          wbraid: str(parsed.wbraid),
          landing_path: str(parsed.landing_path),
          service_slug: str(parsed.service_slug),
        };
      }
    } catch {
      /* ignore bad attribution JSON */
    }
  }

  return {
    ok: true,
    data: {
      name,
      phone: phoneDigits,
      email,
      address,
      unit: unit || undefined,
      city: city || undefined,
      state: state || undefined,
      zip,
      projectType,
      description: description || "",
      consent: true,
      attribution,
      photos,
      startedAt,
    },
  };
}

function str(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 200) : undefined;
}
