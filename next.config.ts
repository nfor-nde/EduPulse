import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Required by react-pdf / pdfjs-dist to avoid importing canvas on the server
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    // Disable turbopack if needed, or pass webpack: true. Let's configure it explicitly or allow fallback.
  },
};

export default nextConfig;
