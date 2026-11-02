"use client";

import { useEffect } from "react";
import { pageContext, readAttribution, trackEvent } from "@/lib/analytics";

const JOBBER_ORIGINS = new Set([
  "https://clienthub.getjobber.com",
  "https://www.getjobber.com",
  "https://getjobber.com",
]);

/**
 * Only fire generate_lead when Jobber is confirmed to send one of these, or when
 * the thank-you redirect lands with ?lead=success (configured in Jobber).
 * Do not treat iframe load, form open, or submit click as a lead.
 */
const JOBBER_SUCCESS_SIGNALS = new Set([
  "generate_lead",
  "form_submitted",
  "formsubmitted",
  "work_request_submitted",
  "request_submitted",
  "submission_success",
]);

const LEAD_SUCCESS_KEY = "hbg_lead_success_tracked";

function ctaLocation(anchor: Element) {
  if (anchor.closest("footer")) return "footer";
  if (anchor.closest("header")) return "header";
  if (anchor.closest(".mobile-contact-cta")) return "mobile_sticky";
  if (anchor.closest(".estimate-contact") || anchor.closest(".estimate aside")) return "estimate_aside";
  if (anchor.closest(".contact-options") || anchor.closest(".contact")) return "contact";
  if (anchor.closest(".page-hero")) return "page_hero";
  if (anchor.closest(".cta-band") || anchor.closest(".home-cta")) return "cta_band";
  return "other";
}

function protocolFromHref(href: string) {
  try {
    return new URL(href, window.location.origin).protocol;
  } catch {
    return "";
  }
}

function stringSignal(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isJobberSuccessMessage(origin: string, data: unknown) {
  if (!JOBBER_ORIGINS.has(origin)) return false;

  const direct = stringSignal(data);
  if (direct) return JOBBER_SUCCESS_SIGNALS.has(direct);
  if (!data || typeof data !== "object") return false;

  const record = data as Record<string, unknown>;
  const candidates = [record.event, record.type, record.action, record.name, record.message, record.status];
  return candidates.some((value) => JOBBER_SUCCESS_SIGNALS.has(stringSignal(value)));
}

function serviceFromPage() {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("service");
    if (fromQuery) return fromQuery;
  } catch {
    /* ignore */
  }
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const match = path.match(/^\/(metal-roofing|metal-siding|barn-siding|pole-buildings|garages)(?:\/|$)/);
  return match?.[1];
}

function leadEventParams(extra?: Record<string, string | undefined>) {
  const service = serviceFromPage();
  return {
    ...pageContext(),
    ...readAttribution(),
    ...(service ? { service_slug: service } : {}),
    ...extra,
  };
}

function trackGenerateLead(source: "jobber_postmessage" | "thank_you_redirect") {
  try {
    if (sessionStorage.getItem(LEAD_SUCCESS_KEY) === "1") return;
    sessionStorage.setItem(LEAD_SUCCESS_KEY, "1");
  } catch {
    /* still fire once this page load */
  }
  trackEvent("generate_lead", leadEventParams({ location: "estimate_form", lead_source: source }));
}

export function ConversionTracker() {
  useEffect(() => {
    // Verified path: Jobber thank-you / redirect URL with ?lead=success
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("lead") === "success") {
        trackGenerateLead("thank_you_redirect");
      }
    } catch {
      /* ignore */
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.href;
      if (!href) return;
      const protocol = protocolFromHref(href);
      if (protocol !== "tel:" && protocol !== "mailto:") return;

      // click_to_call is the Ads/GA4 conversion name; phone clicks are not tracked calls.
      if (protocol === "tel:") {
        trackEvent("click_to_call", leadEventParams({
          link_url: href,
          location: ctaLocation(anchor),
        }));
      } else {
        trackEvent("email_click", leadEventParams({
          link_url: href,
          location: ctaLocation(anchor),
        }));
      }
    };

    const onMessage = (event: MessageEvent) => {
      // Best-effort only: Jobber does not document a public submit postMessage.
      // Kept so a future documented signal can work without another deploy.
      if (!isJobberSuccessMessage(event.origin, event.data)) return;
      trackGenerateLead("jobber_postmessage");
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMessage);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return null;
}
