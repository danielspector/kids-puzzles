import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Prisma engines are included in Vercel function bundles.
  outputFileTracingIncludes: {
    "/*": ["./src/generated/prisma/**"],
  },
};

export default nextConfig;
