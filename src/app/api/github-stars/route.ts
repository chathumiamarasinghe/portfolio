export const revalidate = 3600;

interface GithubRepo {
  stargazers_count?: number;
  language?: string | null;
  fork?: boolean;
}

function isGithubRepo(value: unknown): value is GithubRepo {
  return typeof value === "object" && value !== null;
}

export async function GET() {
  const username =
    process.env.GITHUB_USERNAME?.replace(/^@/, "") || "chathumiamarasinghe";
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "portfolio",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return Response.json({ stars: 0, repos: 0, languages: 0 });
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      return Response.json({ stars: 0, repos: 0, languages: 0 });
    }

    const repos = payload.filter(isGithubRepo).filter((repo) => !repo.fork);
    const stars = repos.reduce((sum, repo) => {
      return sum + (typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0);
    }, 0);
    const languages = new Set(
      repos
        .map((repo) => repo.language)
        .filter((language): language is string => Boolean(language)),
    );

    return Response.json({
      stars,
      repos: repos.length,
      languages: languages.size,
    });
  } catch {
    return Response.json({ stars: 0, repos: 0, languages: 0 });
  }
}
