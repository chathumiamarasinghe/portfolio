"use client";

import { useEffect, useState } from "react";
import { GitBranch, GitCommit, GitFork, Star } from "lucide-react";
import type { GithubActivity } from "@/lib/github-types";
import { relativeTime } from "@/lib/time";

const icons = {
  PushEvent: GitCommit,
  CreateEvent: GitBranch,
  WatchEvent: Star,
  ForkEvent: GitFork,
} as const;

export function ActivityFeed() {
  const [events, setEvents] = useState<GithubActivity[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/github/activity");
        const payload = (await response.json()) as { activity?: GithubActivity[] };
        if (!cancelled) setEvents(payload.activity ?? []);
      } catch {
        if (!cancelled) setEvents([]);
      }
    }

    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!events.length) return null;

  return (
    <ol className="relative mt-10 space-y-5 border-l border-white/8 pl-6">
      {events.map((event, index) => {
        const Icon = icons[event.type];
        return (
          <li key={`${event.repo}-${event.date}-${index}`} className="relative">
            <span className="absolute top-1 -left-[31px] inline-flex size-6 items-center justify-center rounded-full border border-white/8 bg-background">
              <Icon className="size-3 text-accent-light" />
            </span>
            <p className="text-sm text-text-primary">{event.message}</p>
            <p className="mt-1 text-xs text-text-muted">
              {event.repo} · {relativeTime(event.date)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
