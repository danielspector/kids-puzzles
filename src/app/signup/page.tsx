"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/Logo";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name || undefined, email, password }),
    }).catch(() => null);

    if (!res) {
      setBusy(false);
      setError("Network error. Try again.");
      return;
    }

    const data = (await res.json().catch(() => null)) as
      | null
      | { ok: true }
      | { ok: false; error: string };

    if (!data || ("ok" in data && data.ok === false)) {
      setBusy(false);
      setError(data && "error" in data ? data.error : "Signup failed.");
      return;
    }

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setBusy(false);
    if (!login || login.error) {
      router.push("/login");
      return;
    }

    router.push(login.url || "/dashboard");
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Start at the easy puzzles and work your way up.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-black/55">
                Name (optional)
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada"
                autoComplete="nickname"
              />
            </div>

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
                autoComplete="new-password"
                placeholder="at least 6 characters"
              />
            </div>

            {error ? (
              <div className="text-sm font-semibold text-red-700">{error}</div>
            ) : null}

            <div className="mt-2 flex gap-3">
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? "Creating..." : "Create account"}
              </Button>
              <LinkButton href="/login" variant="ghost" size="lg">
                Log in instead
              </LinkButton>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
