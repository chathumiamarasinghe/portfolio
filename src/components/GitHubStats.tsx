"use client";

import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import type { GithubUserStats } from "@/lib/github-types";

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

export function GitHubStats({ stats }: { stats: GithubUserStats }) {
  const cards = [
    { label: "Total Stars", value: stats.stars },
    { label: "Public Repos", value: stats.publicRepos },
    { label: "Languages", value: stats.languages },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <motion.article
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08, duration: 0.45 }}
          className="rounded-2xl border border-white/8 bg-surface p-5"
        >
          <p className="font-heading text-3xl font-semibold text-accent">
            <CountUp value={card.value} />
          </p>
          <p className="mt-1 text-sm text-text-muted">{card.label}</p>
        </motion.article>
      ))}
    </div>
  );
}
