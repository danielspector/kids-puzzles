import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const bodySchema = z.object({
  answer: z.string().min(1).max(200),
});

function normalizeText(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function isCorrectAnswer(params: {
  type: string;
  expected: string;
  received: string;
}) {
  const { type, expected, received } = params;

  if (type === "number") {
    const a = Number.parseFloat(expected);
    const b = Number.parseFloat(received);
    return Number.isFinite(a) && Number.isFinite(b) && a === b;
  }

  return normalizeText(expected) === normalizeText(received);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Not signed in." },
        { status: 401 },
      );
    }

    const { slug } = await ctx.params;
    const puzzle = await prisma.puzzle.findUnique({ where: { slug } });
    if (!puzzle) {
      return NextResponse.json(
        { ok: false, error: "Puzzle not found." },
        { status: 404 },
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Please type an answer." },
        { status: 400 },
      );
    }

    const userId = session.user.id;
    const now = new Date();
    const correct = isCorrectAnswer({
      type: puzzle.type,
      expected: puzzle.solution,
      received: parsed.data.answer,
    });

    const existing = await prisma.userPuzzle.findUnique({
      where: { userId_puzzleId: { userId, puzzleId: puzzle.id } },
    });

    const firstTimeCompletion = correct && !existing?.completedAt;
    const pointsAwarded = firstTimeCompletion ? puzzle.points : 0;

    if (!existing) {
      await prisma.userPuzzle.create({
        data: {
          userId,
          puzzleId: puzzle.id,
          attemptsCount: 1,
          lastAttemptAt: now,
          completedAt: correct ? now : null,
        },
      });
    } else {
      await prisma.userPuzzle.update({
        where: { id: existing.id },
        data: {
          attemptsCount: { increment: 1 },
          lastAttemptAt: now,
          ...(firstTimeCompletion ? { completedAt: now } : {}),
        },
      });
    }

    return NextResponse.json({ ok: true, correct, pointsAwarded });
  } catch (err) {
    const details =
      process.env.NODE_ENV !== "production" ? String(err) : undefined;

    return NextResponse.json(
      { ok: false, error: "Server error recording attempt.", details },
      { status: 500 },
    );
  }
}
