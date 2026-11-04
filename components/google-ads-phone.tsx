"use client";

import { useEffect } from "react";
import { configureGoogleAdsPhoneConversion } from "@/lib/analytics";
import { BUSINESS_PHONE, PHONE_LINK_CLASS, PHONE_TRACKING_CLASS } from "@/lib/seo";

/**
 * Enables Google Ads “Calls to a phone number on your website” replacement
 * on top of the existing GA4 gtag install (no second gtag.js).
 */
export function GoogleAdsPhoneConversion() {
  useEffect(() => {
    void configureGoogleAdsPhoneConversion({
      phoneDisplay: BUSINESS_PHONE,
      phoneCssClass: PHONE_TRACKING_CLASS,
      phoneLinkClass: PHONE_LINK_CLASS,
    });
  }, []);

  return null;
}
