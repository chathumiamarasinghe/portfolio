"use client";

import { motion } from "framer-motion";
import { GitFork, Star } from "lucide-react";
import type { GithubRepo } from "@/lib/github-types";
import { relativeTime } from "@/lib/time";

export function GitHubRepos({ repos }: { repos: GithubRepo[] }) {
  if (!repos.length) {
    return (
      <p className="text-sm text-text-muted">
        GitHub repos will appear here once the API is configured.
      </p>
    );
  }

  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {repos.map((repo) => (
        <motion.li
          key={repo.url}
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-full rounded-xl border border-white/8 bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/50 hover:shadow-accent-glow"
          >
            <h3 className="font-heading text-lg font-semibold">{repo.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-muted">
              {repo.description ?? "No description yet."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-muted">
              {repo.language ? (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: repo.languageColor ?? "#888" }}
                  />
                  {repo.language}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5" />
                {repo.stars}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="size-3.5" />
                {repo.forks}
              </span>
              <span>{relativeTime(repo.updatedAt)}</span>
            </div>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
