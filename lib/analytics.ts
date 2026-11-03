export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-JJ9HCGZZEM";

/** Live site hosts that may load production GA4 `G-JJ9HCGZZEM`. */
export const PRODUCTION_GA_HOSTS = new Set([
  "heritagebuildgroup.com",
  "www.heritagebuildgroup.com",
]);

const ATTRIBUTION_KEY = "hbg_attribution";
/** Per-submission-id dedupe so generate_lead fires once per successfully saved lead. */
export const LEAD_SUCCESS_PREFIX = "hbg_lead_tracked:";

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

function normalizeHost(hostname: string) {
  return hostname.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

export function isProductionGaHost(hostname: string) {
  return PRODUCTION_GA_HOSTS.has(normalizeHost(hostname));
}

/**
 * Production GA4 only on the live heritagebuildgroup.com site.
 * Uses Netlify/Vercel deploy context + hostname (www included).
 * Preview / branch / temporary *.netlify.app / *.vercel.app → off.
 */
export function shouldEnableProductionGa(options?: {
  hostname?: string | null;
  /** Netlify: production | deploy-preview | branch-deploy | dev */
  context?: string | null;
  /** Vercel: production | preview | development */
  vercelEnv?: string | null;
  nodeEnv?: string | null;
}) {
  const context = options?.context ?? process.env.CONTEXT ?? null;
  const vercelEnv = options?.vercelEnv ?? process.env.VERCEL_ENV ?? null;
  const nodeEnv = options?.nodeEnv ?? process.env.NODE_ENV ?? null;

  if (context && context !== "production") return false;
  if (vercelEnv && vercelEnv !== "production") return false;
  if (nodeEnv && nodeEnv !== "production") return false;

  const hostname =
    options?.hostname ??
    (typeof window !== "undefined" ? window.location.hostname : null);

  if (hostname) {
    const host = normalizeHost(hostname);
    if (host.endsWith(".netlify.app") || host.endsWith(".vercel.app") || host === "localhost") {
      return false;
    }
    return isProductionGaHost(host);
  }

  // Server render without a request host: trust deploy context only when explicitly production.
  return context === "production" || vercelEnv === "production";
}

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
 * Only used when production GA is enabled for this host.
 */
export function ensureGtag() {
  if (typeof window === "undefined") return;
  if (!shouldEnableProductionGa()) return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
}

function gaInitPresent() {
  return Boolean(document.getElementById("_next-ga-init") || document.getElementById("_next-ga"));
}

/** Resolves once the Next.js GA bootstrap is present, or after timeout (stub still works). */
export function waitForGtag(timeoutMs = 4000): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!shouldEnableProductionGa()) return Promise.resolve(false);
  ensureGtag();
  if (gaInitPresent() && typeof window.gtag === "function") return Promise.resolve(true);

  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (!shouldEnableProductionGa()) {
        resolve(false);
        return;
      }
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

/** Sends a GA4 event through the existing gtag install. No-ops off production hosts. */
export function trackEvent(name: string, params?: GaEventParams) {
  if (typeof window === "undefined") return;
  if (!shouldEnableProductionGa()) return;
  ensureGtag();
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Fire generate_lead exactly once per saved submission id after the API confirms success.
 * Does NOT fire on form_start, button clicks, failed submits, or direct thank-you visits.
 * No PII — only service/project type and attribution params.
 */
export async function trackGenerateLeadOnce(
  submissionId: string,
  extra?: GaEventParams,
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!shouldEnableProductionGa()) return false;
  if (!submissionId || submissionId.length < 8) return false;

  const key = `${LEAD_SUCCESS_PREFIX}${submissionId}`;
  try {
    if (sessionStorage.getItem(key) === "1") return false;
    sessionStorage.setItem(key, "1");
  } catch {
    /* still attempt once this page load */
  }

  await waitForGtag();
  if (!shouldEnableProductionGa()) return false;

  trackEvent("generate_lead", {
    ...pageContext(),
    ...readAttribution(),
    location: "estimate_form",
    lead_source: "native_form_save",
    transport_type: "beacon",
    // Non-PII correlation only — not the full UUID if preferred; id prefix is fine for debug.
    submission_id: submissionId.slice(0, 8),
    ...extra,
  });
  return true;
}
