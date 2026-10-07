import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AVIF first (smaller), WebP as the fallback the browser negotiates down to.
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
