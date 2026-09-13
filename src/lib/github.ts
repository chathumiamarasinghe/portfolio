import "server-only";
import type {
  GithubActivity,
  GithubContributions,
  GithubRepo,
  GithubUserStats,
} from "@/lib/github-types";

export type {
  GithubActivity,
  GithubContributions,
  GithubRepo,
  GithubUserStats,
};

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const REVALIDATE = 3600;

interface GithubRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

interface GithubUserResponse {
  public_repos: number;
  followers: number;
}

interface GithubEventResponse {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: Array<{ message?: string }>;
    ref_type?: string;
    ref?: string;
  };
}

interface GraphQLPinnedResponse {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: Array<{
          name?: string;
          description?: string | null;
          url?: string;
          stargazerCount?: number;
          forkCount?: number;
          updatedAt?: string;
          primaryLanguage?: { name: string; color: string } | null;
        }>;
      };
    };
  };
}

interface GraphQLContributionResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              date: string;
              contributionCount: number;
            }>;
          }>;
        };
      };
    };
  };
}

export function getGithubUsername(): string {
  return process.env.GITHUB_USERNAME?.replace(/^@/, "") || "chathumiamarasinghe";
}

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

async function githubGraphQL<T>(query: string, variables: Record<string, string>): Promise<T> {
  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...githubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function toGithubRepo(repo: GithubRepoResponse): GithubRepo {
  return {
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    language: repo.language,
    languageColor: repo.language ? languageColor(repo.language) : null,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
  };
}

export async function getAllPublicRepos(): Promise<GithubRepoResponse[]> {
  const username = getGithubUsername();
  return githubFetch<GithubRepoResponse[]>(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
  );
}

export async function getPublicRepos(limit = 9): Promise<GithubRepo[]> {
  const repos = await getAllPublicRepos();

  return repos
    .filter((repo) => !repo.fork)
    .map(toGithubRepo)
    .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export async function getPinnedRepos(): Promise<GithubRepo[]> {
  const username = getGithubUsername();
  const payload = await githubGraphQL<GraphQLPinnedResponse>(
    `query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              updatedAt
              primaryLanguage { name color }
            }
          }
        }
      }
    }`,
    { login: username },
  );

  return (payload.data?.user?.pinnedItems?.nodes ?? [])
    .filter((node) => Boolean(node?.name && node.url))
    .map((node) => ({
      name: node.name ?? "",
      description: node.description ?? null,
      url: node.url ?? "",
      language: node.primaryLanguage?.name ?? null,
      languageColor: node.primaryLanguage?.color ?? null,
      stars: node.stargazerCount ?? 0,
      forks: node.forkCount ?? 0,
      updatedAt: node.updatedAt ?? new Date().toISOString(),
    }));
}

export async function getUserStats(): Promise<GithubUserStats> {
  const username = getGithubUsername();
  const [user, repos] = await Promise.all([
    githubFetch<GithubUserResponse>(`${GITHUB_API}/users/${username}`),
    getAllPublicRepos(),
  ]);

  const ownRepos = repos.filter((repo) => !repo.fork);
  const stars = ownRepos.reduce((total, repo) => total + repo.stargazers_count, 0);
  const languages = new Set(
    ownRepos
      .map((repo) => repo.language)
      .filter((language): language is string => Boolean(language)),
  );

  return {
    stars,
    publicRepos: user.public_repos,
    followers: user.followers,
    languages: languages.size,
  };
}

export async function getContributions(): Promise<GithubContributions> {
  const username = getGithubUsername();
  const payload = await githubGraphQL<GraphQLContributionResponse>(
    `query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }`,
    { login: username },
  );

  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  const days =
    calendar?.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    ) ?? [];

  return {
    total: calendar?.totalContributions ?? 0,
    days: days.slice(-364),
  };
}

export async function getRecentActivity(): Promise<GithubActivity[]> {
  const username = getGithubUsername();
  const events = await githubFetch<GithubEventResponse[]>(
    `${GITHUB_API}/users/${username}/events/public?per_page=10`,
  );

  const allowed = new Set(["PushEvent", "CreateEvent", "WatchEvent", "ForkEvent"]);

  return events
    .filter((event) => allowed.has(event.type))
    .map((event) => {
      const type = event.type as GithubActivity["type"];
      return {
        type,
        repo: event.repo.name,
        message: activityMessage(type, event),
        date: event.created_at,
      };
    });
}

function activityMessage(type: GithubActivity["type"], event: GithubEventResponse): string {
  if (type === "PushEvent") {
    return event.payload.commits?.[0]?.message ?? "Pushed new commits";
  }
  if (type === "CreateEvent") {
    return `Created ${event.payload.ref_type ?? "repository"} ${event.payload.ref ?? ""}`.trim();
  }
  if (type === "WatchEvent") {
    return "Starred a repository";
  }
  return "Forked a repository";
}

export function languageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Go: "#00ADD8",
    Rust: "#dea584",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Shell: "#89e051",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    R: "#198CE7",
    Jupyter: "#DA5B0B",
  };

  return colors[language] ?? "#888888";
}
