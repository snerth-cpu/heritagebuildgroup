import { NextResponse } from "next/server";
import { checkRateLimit, clientKeyFromRequest } from "@/lib/estimate/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_QUERY_LEN = 3;
const MAX_RESULTS = 5;

/** Pittsburgh region bias for PA/OH results (Places Autocomplete locationBias). */
const PITTSBURGH = { latitude: 40.4406, longitude: -79.9959 };
const BIAS_RADIUS_METERS = 200_000; // ~124 mi — covers Butler/Mercer + nearby OH

export type AddressSuggestion = {
  id: string;
  placeId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

type PlacePrediction = {
  place?: string;
  placeId?: string;
  text?: { text?: string };
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
};

type GoogleErrorBody = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: unknown;
  };
};

type AutocompleteResponse = GoogleErrorBody & {
  suggestions?: Array<{ placePrediction?: PlacePrediction }>;
};

type AddressComponent = {
  longText?: string;
  shortText?: string;
  types?: string[];
};

type PlaceDetailsResponse = GoogleErrorBody & {
  formattedAddress?: string;
  addressComponents?: AddressComponent[];
};

function placesKey() {
  return (process.env.GOOGLE_PLACES_API_KEY || "").trim();
}

function wantDebug(request: Request) {
  const { searchParams } = new URL(request.url);
  return searchParams.get("debug") === "1";
}

/** Safe summary of a Google error — never includes the API key. */
function googleErrorSummary(status: number, payload: GoogleErrorBody | null) {
  return {
    httpStatus: status,
    code: payload?.error?.code ?? status,
    status: payload?.error?.status || undefined,
    message: payload?.error?.message || `Google Places request failed (${status})`,
  };
}

function component(
  components: AddressComponent[] | undefined,
  type: string,
  preferShort = false,
) {
  const match = components?.find((c) => c.types?.includes(type));
  if (!match) return "";
  if (preferShort) return (match.shortText || match.longText || "").trim();
  return (match.longText || match.shortText || "").trim();
}

function partsFromComponents(components: AddressComponent[] | undefined) {
  const streetNumber = component(components, "street_number");
  const route = component(components, "route");
  const street = [streetNumber, route].filter(Boolean).join(" ").trim();
  const city =
    component(components, "locality") ||
    component(components, "sublocality") ||
    component(components, "postal_town") ||
    component(components, "administrative_area_level_3") ||
    component(components, "administrative_area_level_2");
  const state = component(components, "administrative_area_level_1", true);
  const zip = component(components, "postal_code");
  const unit = component(components, "subpremise");
  return { street, city, state, zip, unit };
}

async function autocomplete(query: string, sessionToken?: string): Promise<AddressSuggestion[]> {
  const key = placesKey();
  const body: Record<string, unknown> = {
    input: query,
    languageCode: "en",
    regionCode: "us",
    includedRegionCodes: ["us"],
    locationBias: {
      circle: {
        center: PITTSBURGH,
        radius: BIAS_RADIUS_METERS,
      },
    },
  };
  if (sessionToken) body.sessionToken = sessionToken;

  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      // Field mask is optional for Autocomplete (New); keep it explicit and nested.
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.place,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 },
  });

  const payload = (await res.json().catch(() => null)) as AutocompleteResponse | null;
  if (!res.ok) {
    const summary = googleErrorSummary(res.status, payload);
    console.error("[address-suggest] Places autocomplete error", summary);
    const err = new Error(summary.message) as Error & { google?: typeof summary };
    err.google = summary;
    throw err;
  }

  const out: AddressSuggestion[] = [];
  for (const item of payload?.suggestions || []) {
    const pred = item.placePrediction;
    if (!pred) continue;
    const placeId = pred.placeId || pred.place?.replace(/^places\//, "") || "";
    if (!placeId) continue;
    const label =
      pred.text?.text ||
      [pred.structuredFormat?.mainText?.text, pred.structuredFormat?.secondaryText?.text]
        .filter(Boolean)
        .join(", ") ||
      placeId;
    const main = pred.structuredFormat?.mainText?.text || label.split(",")[0]?.trim() || label;
    out.push({
      id: placeId,
      placeId,
      label,
      street: main,
      city: "",
      state: "",
      zip: "",
    });
    if (out.length >= MAX_RESULTS) break;
  }
  return out;
}

async function placeDetails(
  placeId: string,
  sessionToken?: string,
): Promise<AddressSuggestion | null> {
  const key = placesKey();
  const id = placeId.replace(/^places\//, "");
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`);
  if (sessionToken) url.searchParams.set("sessionToken", sessionToken);
  url.searchParams.set("languageCode", "en");
  url.searchParams.set("regionCode", "us");

  const res = await fetch(url.toString(), {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "formattedAddress,addressComponents",
    },
    next: { revalidate: 0 },
  });

  const payload = (await res.json().catch(() => null)) as PlaceDetailsResponse | null;
  if (!res.ok) {
    const summary = googleErrorSummary(res.status, payload);
    console.error("[address-suggest] Places details error", summary);
    const err = new Error(summary.message) as Error & { google?: typeof summary };
    err.google = summary;
    throw err;
  }

  const parts = partsFromComponents(payload?.addressComponents);
  const street =
    parts.street ||
    payload?.formattedAddress?.split(",")[0]?.trim() ||
    "";
  if (!street && !payload?.formattedAddress) return null;

  const label =
    payload?.formattedAddress ||
    [street, parts.city, parts.state, parts.zip].filter(Boolean).join(", ");

  return {
    id,
    placeId: id,
    label,
    street: street || label,
    city: parts.city,
    state: parts.state,
    zip: parts.zip,
  };
}

export async function GET(request: Request) {
  const debug = wantDebug(request);
  const clientKey = clientKeyFromRequest(request);
  const limited = checkRateLimit(`addr:${clientKey}`, {
    windowMs: 60 * 1000,
    max: 40,
  });
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        enabled: Boolean(placesKey()),
        error: "Too many address lookups. Please wait a moment.",
        ...(debug ? { debug: { reason: "rate_limited", retryAfterSec: limited.retryAfterSec } } : {}),
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const key = placesKey();
  if (!key) {
    // Form still works with manual entry — no empty/broken dropdown payload.
    return NextResponse.json({
      ok: true,
      enabled: false,
      suggestions: [] as AddressSuggestion[],
      ...(debug
        ? {
            debug: {
              reason: "missing_GOOGLE_PLACES_API_KEY",
              hint: "Set GOOGLE_PLACES_API_KEY on Netlify (Deploy Previews + Production) and redeploy. Enable Places API (New).",
            },
          }
        : {}),
    });
  }

  const { searchParams } = new URL(request.url);
  const placeId = (searchParams.get("placeId") || "").trim().slice(0, 256);
  const sessionToken = (searchParams.get("session") || "").trim().slice(0, 36) || undefined;
  const q = (searchParams.get("q") || "").trim().slice(0, 120);

  // Health / config probe — no Google call when neither q nor placeId.
  if (!placeId && q.length < MIN_QUERY_LEN) {
    return NextResponse.json({
      ok: true,
      enabled: true,
      suggestions: [] as AddressSuggestion[],
      ...(debug
        ? {
            debug: {
              reason: "configured",
              hasKey: true,
              minQueryLen: MIN_QUERY_LEN,
              endpoint: "places.googleapis.com/v1/places:autocomplete",
            },
          }
        : {}),
    });
  }

  try {
    if (placeId) {
      const suggestion = await placeDetails(placeId, sessionToken);
      return NextResponse.json({
        ok: true,
        enabled: true,
        suggestion,
        suggestions: suggestion ? [suggestion] : [],
      });
    }

    const suggestions = await autocomplete(q, sessionToken);
    return NextResponse.json({
      ok: true,
      enabled: true,
      suggestions,
      ...(debug ? { debug: { count: suggestions.length } } : {}),
    });
  } catch (error) {
    const google =
      error && typeof error === "object" && "google" in error
        ? (error as { google?: ReturnType<typeof googleErrorSummary> }).google
        : undefined;
    console.error("[address-suggest]", google || error);
    return NextResponse.json(
      {
        ok: false,
        enabled: true,
        error: "Address suggestions unavailable right now.",
        suggestions: [] as AddressSuggestion[],
        ...(debug
          ? {
              debug: {
                reason: "google_error",
                google: google || {
                  message: error instanceof Error ? error.message : "Unknown error",
                },
              },
            }
          : {}),
      },
      { status: 502 },
    );
  }
}
