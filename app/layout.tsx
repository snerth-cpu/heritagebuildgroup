import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import "./globals.css";
import { ConversionTracker } from "@/components/conversion-tracker";
import { Footer, Header, MobileContactCta } from "@/components/site-shell";
import { JsonLd } from "@/components/seo";
import { GA_MEASUREMENT_ID, shouldEnableProductionGa } from "@/lib/analytics";
import { absoluteUrl, HOME_DESCRIPTION, HOME_TITLE, localBusinessSchema, SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME_TITLE, template: `%s | ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "Construction",
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: { type: "website", locale: "en_US", siteName: SITE_NAME, url: SITE_URL, images: [{ url: absoluteUrl(SOCIAL_IMAGE), width: 1536, height: 1152, alt: "Completed black metal roofing and siding project by HBG Construction" }] },
  twitter: { card: "summary_large_image", images: [absoluteUrl(SOCIAL_IMAGE)] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

function requestHostname(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-host");
  const host = (forwarded || headerList.get("host") || "").split(",")[0]?.trim() || "";
  return host.replace(/:\d+$/, "");
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const enableProductionGa = shouldEnableProductionGa({
    hostname: requestHostname(headerList),
    context: process.env.CONTEXT,
    vercelEnv: process.env.VERCEL_ENV,
    nodeEnv: process.env.NODE_ENV,
  });

  return (
    <html lang="en">
      <body>
        <JsonLd data={localBusinessSchema} />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileContactCta />
        {/* Production GA4 only on heritagebuildgroup.com — never on Netlify/Vercel previews. */}
        {enableProductionGa ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
        <ConversionTracker />
      </body>
    </html>
  );
}
