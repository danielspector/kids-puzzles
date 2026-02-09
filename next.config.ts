import type { NextConfig } from "next";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],

  // Ensure Prisma engines are included in Vercel function bundles.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**"],
    "/api/**": ["./node_modules/.prisma/client/**"],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
