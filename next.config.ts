import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // attachments.ts enforces a 10MB per-file cap; give the raw request a
      // little headroom above that for multipart overhead.
      bodySizeLimit: "11mb",
    },
  },
  images: {
    // Cloudflare Workers can't run sharp (native binary) for the built-in
    // image optimizer, and this app doesn't use next/image for any images
    // it actually serves — disable optimization rather than bundle sharp.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
