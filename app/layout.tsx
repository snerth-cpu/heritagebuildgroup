import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Footer, Header } from "@/components/site-shell";
import { JsonLd } from "@/components/seo";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { absoluteUrl, HOME_DESCRIPTION, HOME_TITLE, localBusinessSchema, SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: "%s | Heritage Build Group" },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "Construction",
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, url: SITE_URL, images: [{ url: absoluteUrl(SOCIAL_IMAGE), width: 1536, height: 1152, alt: "Completed black metal roofing and siding project by Heritage Build Group" }] },
  twitter: { card: "summary_large_image", images: [absoluteUrl(SOCIAL_IMAGE)] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={localBusinessSchema} />
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
