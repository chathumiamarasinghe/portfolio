import {
  getLinkedInCertificateCount,
  getLinkedInCommentCount,
} from "@/data/linkedin";
import { getMediumArticles } from "@/lib/medium";

export const revalidate = 3600;

export async function GET() {
  const articles = await getMediumArticles().catch(() => []);

  return Response.json({
    articles: articles.length,
    certificates: getLinkedInCertificateCount(),
    comments: getLinkedInCommentCount(),
  });
}
