import { PrismaClient } from "@/generated/prisma/client";
import path from "node:path";
import { existsSync } from "node:fs";

function normalizeSqliteUrl(url: string | undefined) {
  if (!url) return url;

  if (url.startsWith("file:./") || url.startsWith("file:../")) {
    const rel = url.slice("file:".length);
    const attempt = path.resolve(process.cwd(), rel);
    if (existsSync(attempt)) {
      return `file:${attempt.replaceAll("\\\\", "/")}`;
    }

    // In some runtimes the process CWD can be higher than the app root.
    // Walk upwards a few levels to find the referenced file.
    let dir = process.cwd();
    for (let i = 0; i < 6; i++) {
      const candidate = path.resolve(dir, rel);
      if (existsSync(candidate)) {
        return `file:${candidate.replaceAll("\\\\", "/")}`;
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }

    // Fall back to the first attempt (Prisma will error with details).
    return `file:${attempt.replaceAll("\\\\", "/")}`;
  }

  return url;
}

const normalizedUrl = normalizeSqliteUrl(process.env.DATABASE_URL);
process.env.DATABASE_URL = normalizedUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: normalizedUrl });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
