"use client";

import { useEffect } from "react";
import {
  captureAttribution,
  isLeadSuccessLanding,
  pageContext,
  readAttribution,
  trackEvent,
  trackGenerateLeadOnce,
} from "@/lib/analytics";

const JOBBER_ORIGINS = new Set([
  "https://clienthub.getjobber.com",
  "https://www.getjobber.com",
  "https://getjobber.com",
]);

/**
 * Jobber's work_request_embed_snippet.js only handles these parent messages:
 * close | scrolltop | recaptcha-setup | <css height string>.
 * It does not document a submit/success postMessage. Do not invent one.
 */
const JOBBER_CONTROL_MESSAGES = new Set(["close", "scrolltop", "recaptcha-setup"]);

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

function logJobberMessage(data: unknown) {
  const direct = typeof data === "string" ? data : null;
  if (direct && (JOBBER_CONTROL_MESSAGES.has(direct) || /^\d/.test(direct.trim()))) return;
  // Safe diagnostic only — never maps these to generate_lead.
  console.debug("[hbg][jobber-postmessage]", data);
}

export function ConversionTracker() {
  useEffect(() => {
    captureAttribution();

    // Confirmed success path: Jobber custom confirmation URL → /estimate/thanks
    // (or legacy /estimate?lead=success). Embedded forms cannot use this redirect.
    if (isLeadSuccessLanding(window.location.pathname, window.location.search)) {
      const path = window.location.pathname.replace(/\/$/, "") || "/";
      const source = path === "/estimate/thanks" ? "thank_you_page" : "thank_you_redirect";
      const service = serviceFromPage();
      void trackGenerateLeadOnce(source, service ? { service_slug: service } : undefined);
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
      if (!JOBBER_ORIGINS.has(event.origin)) return;
      logJobberMessage(event.data);
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
