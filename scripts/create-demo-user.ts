import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@puzzlepath.local";
const DEMO_NAME = "Demo Kid";
const DEMO_PASSWORD = "puzzle123";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: DEMO_NAME, passwordHash },
    create: { email: DEMO_EMAIL, name: DEMO_NAME, passwordHash },
  });

  console.log("Demo user ready:");
  console.log(`  email: ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
