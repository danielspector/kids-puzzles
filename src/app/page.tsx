import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen px-5 py-10">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2">
          {session?.user?.id ? (
            <LinkButton href="/dashboard" variant="ghost">
              Dashboard
            </LinkButton>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost">
                Log in
              </LinkButton>
              <LinkButton href="/signup">Sign up</LinkButton>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto mt-10 w-full max-w-5xl">
        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pt-2">
            <h1 className="font-heading text-5xl leading-[0.95] tracking-tight text-[var(--ink)] sm:text-6xl">
              A trail of puzzles.
              <br />
              <span className="text-black/55">Easy to tricky.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-black/65">
              Kids solve one puzzle at a time. Each win unlocks the next.
              Track points and progress on your dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {session?.user?.id ? (
                <>
                  <LinkButton href="/play" size="lg">
                    Continue
                  </LinkButton>
                  <LinkButton href="/dashboard" variant="ghost" size="lg">
                    View score
                  </LinkButton>
                </>
              ) : (
                <>
                  <LinkButton href="/signup" size="lg">
                    Start free
                  </LinkButton>
                  <LinkButton href="/login" variant="ghost" size="lg">
                    I already have an account
                  </LinkButton>
                </>
              )}
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm font-semibold text-black/55">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                gentle start
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-sky-500" />
                short puzzles
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-orange-500" />
                score tracking
              </div>
            </div>
          </div>

          <Card className="relative overflow-hidden">
            <div className="absolute -right-24 -top-24 size-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,233,0.45),transparent_60%)]" />
            <div className="absolute -left-24 -bottom-24 size-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.35),transparent_60%)]" />
            <div className="relative">
              <div className="font-heading text-2xl tracking-tight text-[var(--ink)]">
                How it works
              </div>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-black/65">
                <li>
                  <span className="font-semibold text-[var(--ink)]">1.</span> Solve the
                  current puzzle.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">2.</span> Earn points
                  for first-time solves.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">3.</span> Unlock the
                  next puzzle in the path.
                </li>
              </ol>
              <div className="mt-5 text-xs font-semibold text-black/50">
                Tip: keep answers short (one word or one number).
              </div>
              <div className="mt-6 text-xs text-black/45">
                Built with Next.js + NextAuth + Prisma.
              </div>
              <div className="mt-3">
                <Link
                  href="/play"
                  className="text-xs font-semibold text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black/70"
                >
                  {session?.user?.id ? "Jump back in" : "See the first puzzle"}
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
