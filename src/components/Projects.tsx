import { GitHubRepos } from "@/components/GitHubRepos";
import { getPublicRepos } from "@/lib/github";

export async function Projects() {
  const repos = await getPublicRepos(12).catch(() => []);

  return (
    <section
      id="projects"
      className="section-shell scroll-mt-24 border-t border-white/8 bg-background"
    >
      <div className="section-wrap">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Projects
        </p>
        <h2 className="section-title mt-3 font-heading tracking-tight">
          Work that lives at the edge of models and product
        </h2>
        <p className="section-subtitle mt-3 max-w-2xl text-text-muted">
          Live GitHub repositories, sorted by star count.
        </p>
        <div className="mt-12">
          <GitHubRepos repos={repos} />
        </div>
      </div>
    </section>
  );
}
