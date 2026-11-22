import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Practice reads the synthetic corpus from disk at runtime; make sure Vercel
  // bundles it with the serverless functions that need it.
  outputFileTracingIncludes: {
    "/api/practice/next": ["./data/**"],
    "/api/practice/answer": ["./data/**"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
