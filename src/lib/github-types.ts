export interface GithubRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface GithubUserStats {
  stars: number;
  publicRepos: number;
  followers: number;
  languages: number;
}

export interface ContributionDay {
  date: string;
  count: number;
}

export interface GithubContributions {
  total: number;
  days: ContributionDay[];
}

export interface GithubActivity {
  type: "PushEvent" | "CreateEvent" | "WatchEvent" | "ForkEvent";
  repo: string;
  message: string;
  date: string;
}
