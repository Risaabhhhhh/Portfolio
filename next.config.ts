import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Compress all responses with gzip/brotli
  compress: true,

  // Optimize CSS - removes unused Tailwind classes at build time
  experimental: {
    optimizeCss: true,
    // Track Web Vitals attribution for debugging
    webVitalsAttribution: ["LCP", "CLS", "FCP"],
  },

  images: {
    // Serve AVIF first (50% smaller than WebP), WebP as fallback
    formats: ["image/avif", "image/webp"],

    // Device sizes for responsive srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256],

    // Cache optimized images for 30 days
    minimumCacheTTL: 2592000,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod.spline.design",
      },
    ],
  },

  // Reduce bundle size - only ship what's used
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  // Security + caching headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options",   value: "nosniff"          },
          { key: "X-Frame-Options",           value: "DENY"             },
          { key: "X-XSS-Protection",          value: "1; mode=block"    },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Aggressively cache static assets (JS/CSS/fonts are content-hashed)
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache public assets for 30 days
        source: "/(.*)\\.(webp|avif|png|jpg|svg|woff2|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;