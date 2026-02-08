import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

function getFlagValue(name: string) {
  const eq = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(eq));
  if (hit) return hit.slice(eq.length);

  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1) return process.argv[idx + 1];

  return undefined;
}

async function main() {
  const prisma = new PrismaClient();
  const emailRaw = getFlagValue("email");
  const email = emailRaw ? emailRaw.toLowerCase().trim() : undefined;

  try {
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true },
      });

      if (!user) {
        console.error(`No user found for email: ${email}`);
        process.exitCode = 1;
        return;
      }

      const result = await prisma.userPuzzle.deleteMany({
        where: { userId: user.id },
      });
      console.log(
        `Reset progress for ${user.email}: deleted ${result.count} UserPuzzle row(s).`,
      );
      return;
    }

    const result = await prisma.userPuzzle.deleteMany({});
    console.log(`Reset all progress: deleted ${result.count} UserPuzzle row(s).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
