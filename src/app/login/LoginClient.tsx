"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/Logo";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setBusy(false);
    if (!res || res.error) {
      setError("Email or password didn't match.");
      return;
    }

    router.push(res.url || callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen px-5 py-10">
      <header className="mx-auto flex w-full max-w-lg items-center justify-between">
        <Logo />
        <LinkButton href="/" variant="ghost">
          Home
        </LinkButton>
      </header>

      <main className="mx-auto mt-10 w-full max-w-lg">
        <Card>
          <h1 className="font-heading text-3xl tracking-tight text-[var(--ink)]">
            Log in
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Welcome back. Your score is waiting.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-black/55">
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-black/55">
                Password
              </label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <div className="text-sm font-semibold text-red-700">{error}</div>
            ) : null}

            <div className="mt-2 flex gap-3">
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? "Logging in..." : "Log in"}
              </Button>
              <LinkButton href="/signup" variant="ghost" size="lg">
                Create account
              </LinkButton>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
