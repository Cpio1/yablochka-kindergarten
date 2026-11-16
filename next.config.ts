import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Русская версия — в корне сайта.
    return [{ source: "/ru", destination: "/", permanent: true }];
  },
  async rewrites() {
    return [{ source: "/", destination: "/ru" }];
  },
};

export default nextConfig;
