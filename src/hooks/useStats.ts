"use client";

import { useEffect, useState } from "react";
import { fallbackStats, type PortfolioStat } from "@/lib/stats";
import { personal } from "@/data/personal";

export interface HeroStats {
  stars: string;
  repos: string;
  comments: string;
  experience: string;
  technologies: string;
  certificates: string;
  articles: string;
}

interface GithubStarsPayload {
  stars?: number;
  repos?: number;
  languages?: number;
}

interface SocialPayload {
  articles?: number;
  certificates?: number;
  comments?: number;
}

interface StatsPayload {
  stats?: PortfolioStat[];
}

function defaultExperience(): string {
  const years = Math.max(1, new Date().getFullYear() - personal.experienceStartYear);
  return `${years}+`;
}

function pickStat(stats: PortfolioStat[], keys: string[], fallback: string): string {
  for (const key of keys) {
    const found = stats.find((stat) => stat.key === key);
    if (found?.value) return found.value;
  }
  return fallback;
}

export function useStats() {
  const [stats, setStats] = useState<HeroStats>({
    stars: "—",
    repos: "—",
    comments: "—",
    experience: defaultExperience(),
    technologies: "—",
    certificates: "—",
    articles: "—",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [ghRes, dbRes, socialRes] = await Promise.all([
          fetch("/api/github-stars"),
          fetch("/api/stats"),
          fetch("/api/social"),
        ]);

        const gh = (await ghRes.json()) as GithubStarsPayload;
        const db = (await dbRes.json()) as StatsPayload;
        const social = (await socialRes.json()) as SocialPayload;
        const rows = db.stats?.length ? db.stats : fallbackStats;

        if (cancelled) return;

        setStats({
          stars: typeof gh.stars === "number" ? String(gh.stars) : "—",
          repos: typeof gh.repos === "number" ? `${gh.repos}+` : "—",
          technologies:
            typeof gh.languages === "number" ? `${gh.languages}+` : "—",
          comments:
            typeof social.comments === "number"
              ? String(social.comments)
              : pickStat(rows, ["linkedin_comments", "comments"], "—"),
          certificates:
            typeof social.certificates === "number"
              ? `${social.certificates}+`
              : "—",
          articles:
            typeof social.articles === "number" ? String(social.articles) : "—",
          experience: pickStat(
            rows,
            ["experience_years", "experience"],
            defaultExperience(),
          ),
        });
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading };
}
