export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-JJ9HCGZZEM";

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
