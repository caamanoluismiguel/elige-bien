import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prefer AVIF (smaller) then WebP for any optimized images
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Compress responses (brotli in production)
  compress: true,

  // Security & caching headers
  headers: async () => [
    {
      // Cache immutable static assets aggressively (fonts, JS chunks, images)
      source: "/:path*.(js|css|woff2|woff|ttf|avif|webp|png|jpg|svg|ico)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  // Strict React mode for catching issues early
  reactStrictMode: true,

  // Enable powered-by header removal (minor security best practice)
  poweredByHeader: false,
};

export default nextConfig;
