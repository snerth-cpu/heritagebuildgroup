import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.heritagebuildgroup.com";
export const SITE_NAME = "HBG Construction";
export const LEGAL_NAME = "Heritage Build Group LLC";
/** Display form — must match Google Ads `phone_conversion_number` exactly. */
export const BUSINESS_PHONE = "(724) 719-7237";
export const BUSINESS_PHONE_E164 = "+17247197237";
export const BUSINESS_PHONE_HREF = `tel:${BUSINESS_PHONE_E164}`;
/** CSS class Google Ads replaces with a forwarding number (text nodes only). */
export const PHONE_TRACKING_CLASS = "hbg-phone";
/** Class on clickable tel: anchors so hrefs can be updated with the forwarding number. */
export const PHONE_LINK_CLASS = "hbg-phone-link";
export const BUSINESS_EMAIL = "scott@heritagebuildgroup.com";
export const BUSINESS_HIC = "PA HIC #PA223621";
/** Canonical service-area statement (footer and standalone lines). */
export const SERVICE_AREA_STATEMENT = "Serving Western Pennsylvania and Northeast Ohio.";
/** Region phrase for use inside sentences (in / across / serve …). */
export const SERVICE_AREA_REGION = "Western Pennsylvania and Northeast Ohio";
/** Compact trust / eyebrow form. */
export const SERVICE_AREA_SHORT = "Western Pennsylvania · Northeast Ohio";
export const BUSINESS_TRUST_LINE =
  `PA registered & fully insured · HIC #PA223621 · ${SERVICE_AREA_SHORT}`;
export const SOCIAL_IMAGE = "/images/metal-exterior-wide.png";
export const ESTIMATE_HREF = "/estimate#estimate-form";
export const CONTACT_HREF = "/contact";
export const HOME_TITLE = "HBG Construction | Roofing, Siding & Contracting";
export const HOME_DESCRIPTION =
  `HBG Construction provides roofing, siding, and exterior contracting—including windows, doors, garages, and pole buildings—in ${SERVICE_AREA_REGION}.`;

// Remaining before complete LocalBusiness markup:
// TODO: BUSINESS_STREET_ADDRESS, CITY, STATE, POSTAL_CODE — do not publish until approved
// TODO: VERIFIED_SOCIAL_PROFILE_URLS
// Confirm SITE_URL above or set NEXT_PUBLIC_SITE_URL in the deployment environment.

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const imageUrl = absoluteUrl(SOCIAL_IMAGE);
  const pageUrl = absoluteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url: pageUrl,
      images: [{ url: imageUrl, width: 1536, height: 1152, alt: "Completed black metal roofing and siding project by HBG Construction" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}

export const serviceAreas = [
  { name: "Pittsburgh", label: "Greater Pittsburgh", href: "/service-areas/pittsburgh-pa" },
  { name: "Cranberry Township", label: "Cranberry Township", href: "/service-areas/cranberry-township-pa" },
  { name: "Butler County", label: "Butler County", href: "/service-areas/butler-county-pa" },
  { name: "Mercer County", label: "Mercer County", href: "/service-areas/mercer-county-pa" },
] as const;

/** Areas we serve, including those without a dedicated landing page. */
export const serviceAreaNames = [
  "Western Pennsylvania",
  "Greater Pittsburgh",
  "Cranberry Township",
  "Butler County",
  "Mercer County",
  "Northeast Ohio",
] as const;

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "GeneralContractor", "RoofingContractor"],
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  alternateName: ["Heritage Build Group"],
  url: SITE_URL,
  telephone: "+1-724-719-7237",
  email: BUSINESS_EMAIL,
  logo: absoluteUrl("/brand/hbg-primary.png"),
  image: absoluteUrl(SOCIAL_IMAGE),
  description:
    `HBG Construction supplies and installs metal roofing and metal siding, and builds pole buildings and detached garages in ${SERVICE_AREA_REGION}.`,
  areaServed: [
    { "@type": "AdministrativeArea", name: "Western Pennsylvania" },
    { "@type": "City", name: "Pittsburgh", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
    { "@type": "AdministrativeArea", name: "Greater Pittsburgh" },
    { "@type": "City", name: "Cranberry Township", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
    { "@type": "AdministrativeArea", name: "Butler County, Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Mercer County, Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Northeast Ohio" },
  ],
  knowsAbout: [
    "Metal roofing",
    "Standing seam metal roofing",
    "Metal siding",
    "Residential board-and-batten metal siding",
    "Barn siding replacement",
    "Pole buildings",
    "Pole building kits",
    "Post-frame construction",
    "Barns",
    "Garage construction",
    "Detached garage construction",
    "Commercial exterior construction",
    "Commercial metal roofing",
    "Commercial metal siding",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Exterior & Building Construction Services",
    itemListElement: [
      "Metal Roofing",
      "Metal Siding",
      "Barn Siding Replacement",
      "Pole Buildings",
      "Pole Building Kits",
      "Garages",
      "Commercial Exterior Construction",
      "Residential Board-and-Batten Metal Siding",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};
