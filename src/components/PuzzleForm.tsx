"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Props = {
  slug: string;
  type: string;
};

export function PuzzleForm({ slug, type }: Props) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "wrong" }
    | { kind: "right"; pointsAwarded: number }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const inputMode = useMemo<
    "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url"
  >(() => {
    if (type === "number") return "numeric";
    return "text";
  }, [type]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    setStatus({ kind: "submitting" });
    const res = await fetch(`/api/puzzles/${encodeURIComponent(slug)}/attempt`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answer }),
    }).catch(() => null);

    if (!res) {
      setStatus({ kind: "error", message: "Network error. Try again." });
      return;
    }

    const data = (await res.json().catch(() => null)) as
      | null
      | { ok: true; correct: boolean; pointsAwarded: number }
      | { ok: false; error: string };

    if (!data || ("ok" in data && data.ok === false)) {
      setStatus({
        kind: "error",
        message:
          data && "error" in data ? data.error : "Something went wrong. Try again.",
      });
      return;
    }

    if (data.correct) {
      setStatus({ kind: "right", pointsAwarded: data.pointsAwarded });
      router.refresh();
      return;
    }

    setStatus({ kind: "wrong" });
  }

  return (
    <div className="mt-6">
      {status.kind === "right" ? (
        <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-black/10">
          <div className="font-heading text-xl tracking-tight text-[var(--ink)]">
            Correct!
          </div>
          <div className="mt-1 text-sm text-black/60">
            {status.pointsAwarded > 0
              ? `+${status.pointsAwarded} points` 
              : "You already completed this one."}
          </div>
          <div className="mt-4 flex gap-3">
            <LinkButton href="/play" size="lg">
              Next puzzle
            </LinkButton>
            <LinkButton href="/dashboard" variant="ghost" size="lg">
              Dashboard
            </LinkButton>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={type === "number" ? "Type a number..." : "Type your answer..."}
              inputMode={inputMode}
              autoComplete="off"
            />
            <Button
              type="submit"
              size="lg"
              className="sm:w-40"
              disabled={status.kind === "submitting"}
            >
              Check
            </Button>
          </div>
          {status.kind === "wrong" ? (
            <div className="text-sm font-semibold text-black/60">
              Not quite. Try again.
            </div>
          ) : null}
          {status.kind === "error" ? (
            <div className="text-sm font-semibold text-red-700">
              {status.message}
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}
