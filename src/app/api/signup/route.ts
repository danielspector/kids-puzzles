import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(50).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid signup data." },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "That email is already in use." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.create({
      data: {
        email,
        name: parsed.data.name,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const details =
      process.env.NODE_ENV !== "production" ? String(err) : undefined;

    return NextResponse.json(
      { ok: false, error: "Server error during signup.", details },
      { status: 500 },
    );
  }
}
