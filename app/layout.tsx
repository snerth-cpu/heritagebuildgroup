import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "@/components/site-shell";
import { JsonLd } from "@/components/seo";
import { localBusinessSchema, SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Pittsburgh-Area Metal Roofing & Siding Contractor | Heritage Build Group", template: "%s | Heritage Build Group" },
  description: "Heritage Build Group LLC is a Pittsburgh-area contractor for residential and commercial metal roofing, standing seam roofs, and metal siding across Greater Pittsburgh and Western Pennsylvania.",
  applicationName: SITE_NAME,
  category: "Construction",
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, url: "/", images: [{ url: SOCIAL_IMAGE, width: 1536, height: 1152, alt: "Completed Heritage Build Group metal exterior project" }] },
  twitter: { card: "summary_large_image", images: [SOCIAL_IMAGE] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><JsonLd data={localBusinessSchema} /><Header /><main>{children}</main><Footer /></body></html>;
}
