export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-JJ9HCGZZEM";

const ATTRIBUTION_KEY = "hbg_attribution";
/** Session-scoped dedupe so generate_lead fires once per successful lead. */
export const LEAD_SUCCESS_KEY = "hbg_lead_success_tracked";

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
] as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type GaEventParams = Record<string, string | number | boolean | undefined>;

export function pageContext() {
  return {
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    page_title: document.title,
  };
}

/** Persist non-PII campaign params for later analytics events (subject to consent / existing GA). */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const stored: Record<string, string> = { ...readAttribution() };
    for (const key of ATTRIBUTION_KEYS) {
      const value = params.get(key);
      if (value) stored[key] = value;
    }
    if (Object.keys(stored).length) {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(stored));
    }
  } catch {
    /* ignore */
  }
}

export function readAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Install the standard gtag stub so early events queue as Arguments objects
 * (plain-array pushes are not reliably replayed by gtag.js).
 */
export function ensureGtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag() {
    // Prefer Arguments — this is the format gtag.js drains from dataLayer.
    window.dataLayer!.push(arguments);
  };
}

function gaInitPresent() {
  return Boolean(document.getElementById("_next-ga-init") || document.getElementById("_next-ga"));
}

/** Resolves once the Next.js GA bootstrap is present, or after timeout (stub still works). */
export function waitForGtag(timeoutMs = 4000): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  ensureGtag();
  if (gaInitPresent() && typeof window.gtag === "function") return Promise.resolve(true);

  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      ensureGtag();
      if (gaInitPresent() && typeof window.gtag === "function") {
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(false);
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

/** Sends a GA4 event through the existing gtag install. Queues safely before the snippet is ready. */
export function trackEvent(name: string, params?: GaEventParams) {
  if (typeof window === "undefined") return;
  ensureGtag();
  window.gtag!("event", name, params);
}

export type LeadSource = "thank_you_redirect" | "thank_you_page";

/**
 * Fire generate_lead exactly once per browser session after a confirmed success landing.
 * Uses beacon transport so the hit survives immediate navigation.
 */
export async function trackGenerateLeadOnce(
  source: LeadSource,
  extra?: GaEventParams,
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (sessionStorage.getItem(LEAD_SUCCESS_KEY) === "1") return false;
    // Claim before awaiting gtag so concurrent mounts cannot double-fire.
    sessionStorage.setItem(LEAD_SUCCESS_KEY, "1");
  } catch {
    /* still attempt once this page load */
  }

  await waitForGtag();
  trackEvent("generate_lead", {
    ...pageContext(),
    ...readAttribution(),
    location: "estimate_form",
    lead_source: source,
    transport_type: "beacon",
    ...extra,
  });
  return true;
}

export function isLeadSuccessLanding(pathname: string, search: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/estimate/thanks") return true;
  try {
    return new URLSearchParams(search).get("lead") === "success";
  } catch {
    return false;
  }
}
