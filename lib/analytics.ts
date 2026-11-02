export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-JJ9HCGZZEM";

const ATTRIBUTION_KEY = "hbg_attribution";
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

/** Sends a GA4 event through the existing gtag install. No-ops until the snippet is ready. */
export function trackEvent(name: string, params?: GaEventParams) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", name, params]);
}
