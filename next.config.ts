import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // Keep the Blobs client external so Netlify's injected runtime context is visible.
  serverExternalPackages: ["@netlify/blobs"],
};

export default nextConfig;
