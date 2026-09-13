"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PortfolioStat } from "@/lib/stats";

interface AdminDashboardProps {
  initialStats: PortfolioStat[];
  email: string;
}

export function AdminDashboard({ initialStats, email }: AdminDashboardProps) {
  const [stats, setStats] = useState(initialStats);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  function updateLocal(key: string, field: "value" | "label", next: string) {
    setStats((current) =>
      current.map((stat) =>
        stat.key === key ? { ...stat, [field]: next } : stat,
      ),
    );
  }

  async function save(stat: PortfolioStat) {
    setToast(null);
    try {
      const response = await fetch(`/api/stats/${stat.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: stat.value, label: stat.label }),
      });
      const payload = (await response.json()) as {
        stat?: PortfolioStat;
        error?: string;
      };

      if (!response.ok) {
        setToast({ ok: false, text: payload.error ?? "Save failed." });
        return;
      }

      if (payload.stat) {
        setStats((current) =>
          current.map((item) => (item.key === payload.stat?.key ? payload.stat : item)),
        );
      }
      setToast({ ok: true, text: `${stat.label} updated.` });
    } catch {
      setToast({ ok: false, text: "Save failed." });
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <header className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Admin
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">
            Portfolio stats
          </h1>
          <p className="mt-1 text-sm text-text-muted">{email}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="rounded-full"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </header>

      {toast ? (
        <p
          className={`mb-6 flex items-center gap-2 text-sm ${
            toast.ok ? "text-emerald-300" : "text-red-400"
          }`}
        >
          {toast.ok ? <CheckCircle2 className="size-4" /> : null}
          {toast.text}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <StatEditor
            key={stat.key}
            stat={stat}
            onChange={updateLocal}
            onSave={save}
          />
        ))}
      </div>
    </main>
  );
}

function StatEditor({
  stat,
  onChange,
  onSave,
}: {
  stat: PortfolioStat;
  onChange: (key: string, field: "value" | "label", next: string) => void;
  onSave: (stat: PortfolioStat) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  return (
    <article className="space-y-4 rounded-2xl border border-white/8 bg-surface p-5">
      <div>
        <p className="font-mono text-xs text-accent uppercase">{stat.key}</p>
        <p className="mt-1 font-heading text-2xl">
          {stat.value}{" "}
          <span className="text-base text-text-muted">{stat.label}</span>
        </p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm">Value</span>
        <Input
          value={stat.value}
          onChange={(event) => onChange(stat.key, "value", event.target.value)}
          className="h-11 bg-background"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm">Label</span>
        <Input
          value={stat.label}
          onChange={(event) => onChange(stat.key, "label", event.target.value)}
          className="h-11 bg-background"
        />
      </label>
      <Button
        type="button"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await onSave(stat);
          setSaving(false);
        }}
        className="h-10 rounded-full bg-gradient-to-r from-accent to-accent-light text-white"
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
      </Button>
    </article>
  );
}
