import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://heritagebuildgroup.com";
export const SITE_NAME = "Heritage Build Group";
export const LEGAL_NAME = "Heritage Build Group LLC";
export const BUSINESS_PHONE = "(814) 860-4979";
export const BUSINESS_PHONE_HREF = "tel:+18148604979";
export const BUSINESS_EMAIL = "scott@heritagebuildgroup.com";
export const SOCIAL_IMAGE = "/images/01_finished_exterior_hero.jpeg";
export const ESTIMATE_HREF = "/estimate#estimate-form";

// Remaining before complete LocalBusiness markup:
// TODO: BUSINESS_STREET_ADDRESS, CITY, STATE, POSTAL_CODE — do not publish until approved
// TODO: VERIFIED_SOCIAL_PROFILE_URLS
// Confirm SITE_URL above or set NEXT_PUBLIC_SITE_URL in the deployment environment.

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      images: [{ url: SOCIAL_IMAGE, width: 1536, height: 1152, alt: "Completed Heritage Build Group metal exterior project" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SOCIAL_IMAGE] },
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
  "@type": ["GeneralContractor", "RoofingContractor"],
  "@id": `${SITE_URL}/#business`,
  name: LEGAL_NAME,
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
  ],
  knowsAbout: ["Metal roofing", "Standing seam metal roofing", "Metal siding", "Commercial metal roofing", "Commercial metal siding", "Exterior renovation"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Metal Exterior Services",
    itemListElement: ["Metal Roofing", "Metal Siding", "Commercial Exterior Projects"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};
