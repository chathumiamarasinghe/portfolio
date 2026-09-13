import { getMediumArticles } from "@/lib/medium";

export const revalidate = 3600;

export async function GET() {
  try {
    const articles = await getMediumArticles();
    return Response.json({ articles });
  } catch {
    return Response.json({ articles: [] });
  }
}
