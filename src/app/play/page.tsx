import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function PlayPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const puzzles = await prisma.puzzle.findMany({
    orderBy: [{ difficulty: "asc" }, { slug: "asc" }],
    select: { id: true, slug: true },
  });

  const completed = await prisma.userPuzzle.findMany({
    where: { userId, completedAt: { not: null } },
    select: { puzzleId: true },
  });
  const completedIds = new Set(completed.map((c) => c.puzzleId));

  const next = puzzles.find((p) => !completedIds.has(p.id)) ?? puzzles[0] ?? null;
  if (!next) redirect("/dashboard");

  redirect(`/puzzles/${next.slug}`);
}
