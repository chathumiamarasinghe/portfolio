import { Articles } from "@/components/Articles";
import { getMediumArticles } from "@/lib/medium";

export async function ArticlesSection() {
  const articles = await getMediumArticles().catch(() => []);
  return <Articles articles={articles} />;
}
