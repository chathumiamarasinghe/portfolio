import "server-only";
import Parser from "rss-parser";
import { personal } from "@/data/personal";
import type { MediumArticle } from "@/lib/medium-types";

export type { MediumArticle };

const parser = new Parser({
  customFields: {
    item: ["content:encoded", "content"],
  },
});

export function getMediumUsername(): string {
  return (process.env.MEDIUM_USERNAME ?? personal.mediumUsername).replace(/^@/, "");
}

function extractThumbnail(html: string | undefined): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1] ?? null;
}

const FALLBACK_ARTICLES: MediumArticle[] = [
  {
    title:
      "From SQL Server to Cloud ETL: My Beginner Journey with Medallion Architecture, Snowflake & Airflow",
    link: "https://medium.com/@chathumiamarasinghe/from-sql-server-to-cloud-etl-my-beginner-journey-with-medallion-architecture-snowflake-airflow-7c705987d090",
    pubDate: "2025-12-04T16:47:56.000Z",
    thumbnail: "https://cdn-images-1.medium.com/max/1024/1*zjlqmuj87Pv9cQWygRrnEA.png",
    categories: ["Data Engineering", "Snowflake", "Airflow"],
  },
];

export async function getMediumArticles(): Promise<MediumArticle[]> {
  const username = getMediumUsername();

  try {
    const response = await fetch(`https://medium.com/feed/@${username}`, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; portfolio-bot/1.0; +https://chathumi.dev)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      return FALLBACK_ARTICLES;
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);
    const articles = (feed.items ?? []).map((item) => {
      const extras = item as { "content:encoded"?: string; content?: string };
      const encoded = extras["content:encoded"];
      return {
        title: item.title ?? "Untitled",
        link: item.link ?? `https://medium.com/@${username}`,
        pubDate: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        thumbnail: extractThumbnail(encoded ?? item.content),
        categories: item.categories ?? [],
      };
    });

    return articles.length ? articles : FALLBACK_ARTICLES;
  } catch {
    return FALLBACK_ARTICLES;
  }
}
