"use client";

import { useMemo, useState } from "react";
import type { GithubContributions } from "@/lib/github-types";

function cellColor(count: number): string {
  if (count <= 0) return "#161616";
  if (count === 1) return "#3d1a12";
  if (count <= 3) return "#7a2e18";
  if (count <= 6) return "#c43c16";
  return "#E8441A";
}

export function GitHubGraph({
  data,
  username,
}: {
  data: GithubContributions;
  username?: string;
}) {
  const handle = username ?? "chathumiamarasinghe";
  const [tip, setTip] = useState<string | null>(null);

  const weeks = useMemo(() => {
    const chunks: GithubContributions["days"][] = [];
    for (let i = 0; i < data.days.length; i += 7) {
      chunks.push(data.days.slice(i, i + 7));
    }
    return chunks.slice(-52);
  }, [data.days]);

  return (
    <div className="space-y-5">
      <div className="w-full overflow-x-auto rounded-2xl border border-white/8 bg-surface p-4">
        <p className="mb-4 text-sm text-text-muted">
          <span className="font-heading text-lg text-text-primary">
            {data.total.toLocaleString()}
          </span>{" "}
          contributions this year
        </p>
        <div className="overflow-x-auto">
          <div className="flex w-max min-w-[600px] gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    aria-label={`${day.count} contributions on ${day.date}`}
                    className="size-3 rounded-[2px]"
                    style={{ backgroundColor: cellColor(day.count) }}
                    onMouseEnter={() =>
                      setTip(`${day.count} contributions on ${day.date}`)
                    }
                    onMouseLeave={() => setTip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 min-h-5 text-xs text-text-muted">{tip ?? "Hover a day for details"}</p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://github-readme-stats.vercel.app/api/wakatime?username=${handle}&theme=dark`}
        alt={`${handle} WakaTime stats`}
        className="w-full max-w-md rounded-2xl border border-white/8"
      />
    </div>
  );
}
