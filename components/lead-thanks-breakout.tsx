"use client";

import { useEffect } from "react";

/**
 * If Jobber's custom confirmation loads this page inside an iframe, promote it
 * to the top window so generate_lead runs in the primary browsing context.
 */
export function LeadThanksBreakout() {
  useEffect(() => {
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.replace(`${window.location.origin}/estimate/thanks`);
      }
    } catch {
      /* cross-origin parent — leave in place; generate_lead still queues here */
    }
  }, []);

  return null;
}
