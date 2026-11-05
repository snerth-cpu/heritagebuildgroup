import type { MouseEventHandler, ReactNode } from "react";
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  PHONE_LINK_CLASS,
  PHONE_TRACKING_CLASS,
} from "@/lib/seo";

type PhoneLinkProps = {
  className?: string;
  /** Text before the tracked number (e.g. "CALL ", "Call "). */
  prefix?: ReactNode;
  /** Text after the tracked number (e.g. arrow). */
  suffix?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

/**
 * Single source for on-site tel: links so Google Ads website-call replacement
 * can rewrite the visible number + href consistently.
 */
export function PhoneLink({
  className,
  prefix,
  suffix,
  onClick,
  "aria-label": ariaLabel,
}: PhoneLinkProps) {
  const classes = [PHONE_LINK_CLASS, className].filter(Boolean).join(" ");
  return (
    <a
      className={classes}
      href={BUSINESS_PHONE_HREF}
      onClick={onClick}
      aria-label={ariaLabel || `Call ${BUSINESS_PHONE}`}
    >
      {prefix}
      <span className={PHONE_TRACKING_CLASS}>{BUSINESS_PHONE}</span>
      {suffix}
    </a>
  );
}
