"use client";

import { useEffect } from "react";
import { pageContext, trackEvent } from "@/lib/analytics";

const JOBBER_ORIGINS = new Set([
  "https://clienthub.getjobber.com",
  "https://www.getjobber.com",
  "https://getjobber.com",
]);

const JOBBER_SUCCESS_SIGNALS = new Set([
  "generate_lead",
  "form_submitted",
  "formsubmitted",
  "work_request_submitted",
  "request_submitted",
  "submission_success",
]);

function ctaLocation(anchor: Element) {
  if (anchor.closest("footer")) return "footer";
  if (anchor.closest("header")) return "header";
  if (anchor.closest(".estimate-contact") || anchor.closest(".estimate aside")) return "estimate_aside";
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

export function ConversionTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.href;
      if (!href) return;
      const protocol = protocolFromHref(href);
      if (protocol !== "tel:" && protocol !== "mailto:") return;

      trackEvent(protocol === "tel:" ? "phone_click" : "email_click", {
        ...pageContext(),
        link_url: href,
        location: ctaLocation(anchor),
      });
    };

    const onMessage = (event: MessageEvent) => {
      if (!isJobberSuccessMessage(event.origin, event.data)) return;
      trackEvent("generate_lead", {
        ...pageContext(),
        location: "estimate_form",
      });
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
