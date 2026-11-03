import { NextResponse } from "next/server";
import { checkRateLimit, clientKeyFromRequest } from "@/lib/estimate/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT =
  "HBGConstructionEstimateForm/1.0 (https://www.heritagebuildgroup.com; contact=scott@heritagebuildgroup.com)";
const MIN_QUERY_LEN = 3;
const MAX_RESULTS = 5;

/** Nominatim usage policy: ≤1 request/second. Serialize outbound calls in this instance. */
let lastNominatimAt = 0;
let nominatimChain: Promise<void> = Promise.resolve();

function enqueueNominatim<T>(fn: () => Promise<T>): Promise<T> {
  const run = nominatimChain.then(async () => {
    const wait = Math.max(0, 1100 - (Date.now() - lastNominatimAt));
    if (wait) await new Promise((r) => setTimeout(r, wait));
    lastNominatimAt = Date.now();
    return fn();
  });
  // Keep the chain alive even if a call fails.
  nominatimChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export type AddressSuggestion = {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

type NominatimResult = {
  place_id?: number;
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    residential?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
  };
};

function pickLocality(addr: NonNullable<NominatimResult["address"]>) {
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.municipality ||
    addr.suburb ||
    addr.county ||
    ""
  );
}

function pickStreet(addr: NonNullable<NominatimResult["address"]>) {
  const road = addr.road || addr.pedestrian || addr.residential || "";
  if (addr.house_number && road) return `${addr.house_number} ${road}`;
  return road || addr.neighbourhood || "";
}

function stateAbbrev(state: string) {
  const map: Record<string, string> = {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
    "district of columbia": "DC",
  };
  const key = state.trim().toLowerCase();
  if (map[key]) return map[key];
  if (/^[A-Z]{2}$/i.test(state.trim())) return state.trim().toUpperCase();
  return state.trim();
}

function normalize(result: NominatimResult): AddressSuggestion | null {
  const addr = result.address || {};
  const street = pickStreet(addr);
  const city = pickLocality(addr);
  const state = addr.state ? stateAbbrev(addr.state) : "";
  const zip = (addr.postcode || "").split("-")[0]?.trim() || "";
  if (!street && !result.display_name) return null;

  const label =
    result.display_name ||
    [street, city, state, zip].filter(Boolean).join(", ");

  return {
    id: String(result.place_id ?? label),
    label,
    street: street || label.split(",")[0]?.trim() || label,
    city,
    state,
    zip,
  };
}

export async function GET(request: Request) {
  const clientKey = clientKeyFromRequest(request);
  // Tighter than estimate submit: autocomplete fires often while typing.
  const limited = checkRateLimit(`addr:${clientKey}`, {
    windowMs: 60 * 1000,
    max: 30,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many address lookups. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().slice(0, 120);
  if (q.length < MIN_QUERY_LEN) {
    return NextResponse.json({ ok: true, suggestions: [] as AddressSuggestion[] });
  }

  try {
    const suggestions = await enqueueNominatim(async () => {
      const url = new URL(NOMINATIM_URL);
      url.searchParams.set("q", q);
      url.searchParams.set("format", "json");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("limit", String(MAX_RESULTS));
      url.searchParams.set("countrycodes", "us");

      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
        // Nominatim asks not to cache aggressively for personal use; short CDN ok.
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        throw new Error(`Nominatim ${res.status}`);
      }

      const raw = (await res.json()) as NominatimResult[];
      if (!Array.isArray(raw)) return [] as AddressSuggestion[];

      const out: AddressSuggestion[] = [];
      for (const item of raw) {
        const normalized = normalize(item);
        if (normalized) out.push(normalized);
      }
      return out;
    });

    return NextResponse.json({
      ok: true,
      suggestions,
      attribution: "© OpenStreetMap contributors",
    });
  } catch (error) {
    console.error("[address-suggest]", error);
    return NextResponse.json(
      { ok: false, error: "Address suggestions unavailable right now.", suggestions: [] },
      { status: 502 },
    );
  }
}
