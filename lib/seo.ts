import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.heritagebuildgroup.com";
export const SITE_NAME = "Heritage Build Group";
export const LEGAL_NAME = "Heritage Build Group LLC";
export const BUSINESS_PHONE = "(814) 860-4979";
export const BUSINESS_PHONE_HREF = "tel:+18148604979";
export const BUSINESS_EMAIL = "scott@heritagebuildgroup.com";
export const SOCIAL_IMAGE = "/images/metal-exterior-wide.png";
export const ESTIMATE_HREF = "/estimate#estimate-form";
export const HOME_TITLE = "Metal Roofing & Siding Contractor Pittsburgh, PA | Heritage Build Group";
export const HOME_DESCRIPTION = "Heritage Build Group is a Pittsburgh contractor for residential and commercial metal roofing and metal siding across Western Pennsylvania. Request an estimate.";

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
      images: [{ url: imageUrl, width: 1536, height: 1152, alt: "Completed black metal roofing and siding project by Heritage Build Group" }],
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

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "GeneralContractor", "RoofingContractor"],
  "@id": `${SITE_URL}/#business`,
  name: LEGAL_NAME,
  legalName: LEGAL_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  telephone: "+1-814-860-4979",
  email: BUSINESS_EMAIL,
  logo: absoluteUrl("/brand/hbg-primary.png"),
  image: absoluteUrl(SOCIAL_IMAGE),
  description: "Western Pennsylvania contractor specializing in metal roofing, metal siding, and commercial exterior projects.",
  areaServed: [
    { "@type": "City", name: "Pittsburgh", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
    { "@type": "AdministrativeArea", name: "Greater Pittsburgh" },
    { "@type": "City", name: "Cranberry Township", containedInPlace: { "@type": "State", name: "Pennsylvania" } },
    { "@type": "AdministrativeArea", name: "Butler County, Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Mercer County, Pennsylvania" },
    { "@type": "AdministrativeArea", name: "Western Pennsylvania" },
  ],
  knowsAbout: ["Metal roofing", "Standing seam metal roofing", "Metal siding", "Residential metal roofing", "Residential metal siding", "Commercial metal roofing", "Commercial metal siding", "Exterior renovation"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Metal Exterior Services",
    itemListElement: ["Metal Roofing", "Metal Siding", "Residential Exterior Projects", "Commercial Exterior Projects"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};
