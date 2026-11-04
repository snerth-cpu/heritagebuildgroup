export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-JJ9HCGZZEM";

/**
 * Google Ads account ID (`AW-…`) for website call conversion tracking.
 * Prefer env so secrets/labels are not hard-coded; leave unset until Tag Assistant validation.
 */
export const GOOGLE_ADS_ID = (process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "").trim();

/**
 * Conversion label from the “Calls to a phone number on your website” action.
 * Combined send id is `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PHONE_CONVERSION_LABEL}`.
 */
export const GOOGLE_ADS_PHONE_CONVERSION_LABEL = (
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL || ""
).trim();

/** Optional combined override: `AW-XXXXXXXXXX/XXXXXXXXXXXXXXXXXXXX`. */
export const GOOGLE_ADS_PHONE_CONVERSION =
  (process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION || "").trim() ||
  (GOOGLE_ADS_ID && GOOGLE_ADS_PHONE_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PHONE_CONVERSION_LABEL}`
    : "");

/** Live site hosts that may load production GA4 `G-JJ9HCGZZEM`. */
export const PRODUCTION_GA_HOSTS = new Set([
  "heritagebuildgroup.com",
  "www.heritagebuildgroup.com",
]);

/**
 * Temporary Tag Assistant / preview verification only.
 * Never set on Production. When `1`, marketing tags may load off heritagebuildgroup.com.
 */
export function isTagDebugEnabled() {
  return (process.env.NEXT_PUBLIC_ENABLE_TAG_DEBUG || "").trim() === "1";
}

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
    __hbgAdsPhoneConfigured?: boolean;
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
  if (isTagDebugEnabled()) {
    const hostname =
      options?.hostname ??
      (typeof window !== "undefined" ? window.location.hostname : null);
    // Debug mode is for local / preview Tag Assistant only — never force-on for unknown hosts.
    if (!hostname) return true;
    const host = normalizeHost(hostname);
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".vercel.app") ||
      host.endsWith(".netlify.app") ||
      isProductionGaHost(host)
    );
  }

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

/** True when Ads website-call conversion IDs are configured (not when only GA4 is present). */
export function hasGoogleAdsPhoneConversionConfig() {
  if (GOOGLE_ADS_PHONE_CONVERSION) {
    return /^AW-\d+\/[A-Za-z0-9_-]+$/.test(GOOGLE_ADS_PHONE_CONVERSION);
  }
  return Boolean(GOOGLE_ADS_ID && GOOGLE_ADS_PHONE_CONVERSION_LABEL);
}

export function googleAdsAccountId() {
  if (GOOGLE_ADS_ID && /^AW-\d+$/.test(GOOGLE_ADS_ID)) return GOOGLE_ADS_ID;
  const match = GOOGLE_ADS_PHONE_CONVERSION.match(/^(AW-\d+)\//);
  return match?.[1] || "";
}

export function shouldEnableGoogleAdsPhoneConversion(options?: {
  hostname?: string | null;
  context?: string | null;
  vercelEnv?: string | null;
  nodeEnv?: string | null;
}) {
  return shouldEnableProductionGa(options) && hasGoogleAdsPhoneConversionConfig();
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
 * Configure Google Ads account + website phone-call conversion on the existing gtag
 * (same gtag.js as GA4 — no second tag script). Idempotent per page load.
 */
export async function configureGoogleAdsPhoneConversion(options: {
  phoneDisplay: string;
  phoneCssClass: string;
  phoneLinkClass: string;
}): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!shouldEnableGoogleAdsPhoneConversion()) return false;
  if (window.__hbgAdsPhoneConfigured) return true;

  const sendTo = GOOGLE_ADS_PHONE_CONVERSION;
  const accountId = googleAdsAccountId();
  if (!sendTo || !accountId) return false;

  await waitForGtag();
  if (!shouldEnableGoogleAdsPhoneConversion()) return false;
  if (typeof window.gtag !== "function") return false;
  if (window.__hbgAdsPhoneConfigured) return true;

  window.__hbgAdsPhoneConfigured = true;

  // Account-level config once (remarketing / click cookies). Do not fire a conversion event here.
  window.gtag("config", accountId);

  window.gtag("config", sendTo, {
    phone_conversion_number: options.phoneDisplay,
    phone_conversion_css_class: options.phoneCssClass,
    phone_conversion_callback: (formattedNumber: string, plainNumber: string) => {
      try {
        const formatted = String(formattedNumber || "").trim();
        const plain = String(plainNumber || "").replace(/\D/g, "");
        if (!formatted || !plain) return;

        document.querySelectorAll(`.${options.phoneCssClass}`).forEach((node) => {
          node.textContent = formatted;
        });

        const href = plain.startsWith("1") && plain.length === 11 ? `tel:+${plain}` : `tel:+1${plain}`;
        document.querySelectorAll(`a.${options.phoneLinkClass}`).forEach((node) => {
          if (node instanceof HTMLAnchorElement) node.href = href;
        });
      } catch {
        /* never break the page if replacement fails — keep business number */
      }
    },
  });

  return true;
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
