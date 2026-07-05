import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Entregar AVIF (y WebP como fallback) cuando el navegador lo soporte
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
