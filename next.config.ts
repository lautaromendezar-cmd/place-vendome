import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Entregar AVIF (y WebP como fallback) cuando el navegador lo soporte
    formats: ["image/avif", "image/webp"],
    // Las fotos que sube el cliente desde el panel se sirven del CDN de Sanity
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
