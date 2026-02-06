import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const puzzles = await prisma.puzzle.findMany({
    orderBy: [{ difficulty: "asc" }, { slug: "asc" }],
    select: { id: true, slug: true, title: true, points: true, difficulty: true },
  });

  const completed = await prisma.userPuzzle.findMany({
    where: { userId, completedAt: { not: null } },
    select: { puzzleId: true },
  });
  const completedIds = new Set(completed.map((c) => c.puzzleId));
  const completedCount = completedIds.size;

  const score = puzzles.reduce((sum, p) => {
    if (!completedIds.has(p.id)) return sum;
    return sum + p.points;
  }, 0);

  const nextPuzzle = puzzles.find((p) => !completedIds.has(p.id)) ?? null;

  return (
    <div className="min-h-screen px-5 py-10">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <LinkButton href="/" variant="ghost">
            Home
          </LinkButton>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto mt-10 w-full max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="font-heading text-3xl tracking-tight text-[var(--ink)]">
              Dashboard
            </div>
            <div className="mt-2 text-sm text-black/60">
              Signed in as <span className="font-semibold">{session.user.email}</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/60 p-4 ring-1 ring-black/10">
                <div className="text-xs font-semibold tracking-wide text-black/55">
                  Score
                </div>
                <div className="mt-1 font-heading text-3xl tracking-tight text-[var(--ink)]">
                  {score}
                </div>
              </div>
              <div className="rounded-3xl bg-white/60 p-4 ring-1 ring-black/10">
                <div className="text-xs font-semibold tracking-wide text-black/55">
                  Completed
                </div>
                <div className="mt-1 font-heading text-3xl tracking-tight text-[var(--ink)]">
                  {completedCount}/{puzzles.length}
                </div>
              </div>
              <div className="rounded-3xl bg-white/60 p-4 ring-1 ring-black/10">
                <div className="text-xs font-semibold tracking-wide text-black/55">
                  Next up
                </div>
                <div className="mt-1 text-base font-semibold text-[var(--ink)]">
                  {nextPuzzle ? `#${nextPuzzle.difficulty}` : "All done"}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/play" size="lg">
                {nextPuzzle ? "Continue" : "Replay"}
              </LinkButton>
              {nextPuzzle ? (
                <LinkButton href={`/puzzles/${nextPuzzle.slug}`} variant="ghost" size="lg">
                  Peek at next
                </LinkButton>
              ) : null}
            </div>
          </Card>

          <Card>
            <div className="font-heading text-xl tracking-tight text-[var(--ink)]">
              Puzzle path
            </div>
            <div className="mt-1 text-sm text-black/60">
              One-at-a-time unlocking.
            </div>
            <div className="mt-4 space-y-2">
              {puzzles.slice(0, 8).map((p) => {
                const done = completedIds.has(p.id);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 ring-1 ring-black/10"
                  >
                    <div>
                      <div className="text-xs font-semibold tracking-wide text-black/55">
                        #{p.difficulty}
                      </div>
                      <div className="text-sm font-semibold text-[var(--ink)]">
                        {p.title}
                      </div>
                    </div>
                    <div
                      className={
                        done
                          ? "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-900"
                          : "rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/50"
                      }
                    >
                      {done ? "done" : "locked"}
                    </div>
                  </div>
                );
              })}
            </div>
            {puzzles.length > 8 ? (
              <div className="mt-3 text-xs font-semibold text-black/45">
                …and {puzzles.length - 8} more
              </div>
            ) : null}
          </Card>
        </div>
      </main>
    </div>
  );
}
