import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { SignOutButton } from "@/components/SignOutButton";
import { PuzzleForm } from "@/components/PuzzleForm";

type PuzzleRow = {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  hint: string | null;
  type: string;
  difficulty: number;
  points: number;
};

type PuzzleIndexRow = {
  id: string;
  slug: string;
  difficulty: number;
};

type CompletedRow = {
  puzzleId: string;
};

export default async function PuzzlePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const { slug } = await props.params;

  const puzzle = (await prisma.puzzle.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      prompt: true,
      hint: true,
      type: true,
      difficulty: true,
      points: true,
    },
  })) as PuzzleRow | null;
  if (!puzzle) redirect("/play");

  const puzzles = (await prisma.puzzle.findMany({
    orderBy: [{ difficulty: "asc" }, { slug: "asc" }],
    select: { id: true, slug: true, difficulty: true },
  })) as PuzzleIndexRow[];
  const idx = puzzles.findIndex((p) => p.id === puzzle.id);
  if (idx === -1) redirect("/play");

  const completed = (await prisma.userPuzzle.findMany({
    where: { userId, completedAt: { not: null } },
    select: { puzzleId: true },
  })) as CompletedRow[];
  const completedIds = new Set(completed.map((c) => c.puzzleId));

  const missingPrereq = puzzles.slice(0, idx).some((p) => !completedIds.has(p.id));
  if (missingPrereq) redirect("/play");

  const alreadyDone = completedIds.has(puzzle.id);

  return (
    <div className="min-h-screen px-5 py-10">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <LinkButton href="/dashboard" variant="ghost">
            Dashboard
          </LinkButton>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto mt-10 w-full max-w-3xl">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-black/55">
                Puzzle #{puzzle.difficulty} • {puzzle.points} pts
              </div>
              <h1 className="mt-2 font-heading text-4xl tracking-tight text-[var(--ink)]">
                {puzzle.title}
              </h1>
            </div>
            {alreadyDone ? (
              <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-900">
                completed
              </div>
            ) : (
              <div className="rounded-full bg-black/5 px-4 py-2 text-xs font-semibold text-black/55">
                not solved yet
              </div>
            )}
          </div>

          <div className="mt-6 rounded-3xl bg-white/60 p-5 text-base leading-7 text-black/75 ring-1 ring-black/10">
            {puzzle.prompt}
          </div>

          <PuzzleForm slug={puzzle.slug} type={puzzle.type} hint={puzzle.hint} />
        </Card>
      </main>
    </div>
  );
}
