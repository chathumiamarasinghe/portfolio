"use client";

import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-3xl border border-white/8 bg-surface p-8"
      >
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Admin
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold">Sign in</h1>
        </div>
        <label className="block space-y-2">
          <span className="text-sm">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 bg-background"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 bg-background"
            required
          />
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-full bg-gradient-to-r from-accent to-accent-light text-white"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
        </Button>
      </form>
    </main>
  );
}
