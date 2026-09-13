import { ActivityFeed } from "@/components/ActivityFeed";
import { GitHubGraph } from "@/components/GitHubGraph";
import { GitHubStats } from "@/components/GitHubStats";
import { getContributions, getGithubUsername, getUserStats } from "@/lib/github";

export async function OpenSource() {
  const username = getGithubUsername();
  const [stats, contributions] = await Promise.all([
    getUserStats().catch(() => null),
    getContributions().catch(() => null),
  ]);

  return (
    <section
      id="github"
      className="section-shell scroll-mt-24 border-t border-white/8 bg-surface"
    >
      <div className="section-wrap">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          GitHub
        </p>
        <h2 className="section-title mt-3 font-heading tracking-tight">
          GitHub Activity
        </h2>
        <div className="mt-10 space-y-10">
          {stats ? <GitHubStats stats={stats} /> : null}
          {contributions ? (
            <GitHubGraph data={contributions} username={username} />
          ) : null}
          <ActivityFeed />
        </div>
      </div>
    </section>
  );
}
