"use client";

import { useEffect } from "react";
import { captureAttribution, pageContext, readAttribution, trackEvent } from "@/lib/analytics";

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

/**
 * Tracks click-to-call / email_click only.
 * generate_lead is owned by the native estimate form after a confirmed API save —
 * never on page visit, thank-you URL, or legacy Jobber postMessage.
 */
export function ConversionTracker() {
  useEffect(() => {
    captureAttribution();

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

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
