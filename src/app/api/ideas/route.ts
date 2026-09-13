import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export const revalidate = 86400;

const ideaSchema = z.object({
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  impact: z.string(),
  estimatedTime: z.string(),
});

const ideasSchema = z.array(ideaSchema).min(1).max(8);

const fallbackIdeas = [
  {
    title: "Drift Watch",
    description:
      "A monitoring dashboard that compares live model predictions against a baseline dataset. Flag silent drift before it hits production.",
    techStack: ["Python", "FastAPI", "Next.js", "PostgreSQL"],
    difficulty: "Medium" as const,
    impact: "Gives teams an early warning when models stop matching reality.",
    estimatedTime: "2–3 weeks",
  },
  {
    title: "Resume Signal",
    description:
      "Parse job descriptions and score a candidate profile with an explainable ranking. Show which skills are missing and why.",
    techStack: ["Python", "scikit-learn", "Next.js", "Tailwind CSS"],
    difficulty: "Easy" as const,
    impact: "Turns a messy job search into a ranked, honest gap analysis.",
    estimatedTime: "1 week",
  },
  {
    title: "Civic Pulse",
    description:
      "Ingest public city datasets and surface weekly anomalies on a map. Let residents subscribe to neighborhood alerts.",
    techStack: ["Python", "Pandas", "Mapbox", "Node.js"],
    difficulty: "Hard" as const,
    impact: "Makes open data useful to people who do not speak SQL.",
    estimatedTime: "4 weeks",
  },
  {
    title: "Notebook to API",
    description:
      "Convert a Jupyter notebook into a versioned FastAPI endpoint with tests and a tiny Next.js playground.",
    techStack: ["Jupyter", "FastAPI", "Docker", "Next.js"],
    difficulty: "Medium" as const,
    impact: "Shortens the path from experiment to something a teammate can call.",
    estimatedTime: "2 weeks",
  },
  {
    title: "Caption Lab",
    description:
      "Fine-tune a small vision-language model for product photos, then ship a review UI for human corrections.",
    techStack: ["PyTorch", "Hugging Face", "React", "AWS"],
    difficulty: "Hard" as const,
    impact: "Builds a real human-in-the-loop labeling loop, not just a demo.",
    estimatedTime: "3–4 weeks",
  },
  {
    title: "Query Garden",
    description:
      "A SQL learning tool that generates practice questions from a schema and checks answers with a sandboxed Postgres.",
    techStack: ["PostgreSQL", "Node.js", "Next.js", "TypeScript"],
    difficulty: "Easy" as const,
    impact: "Helps juniors practice realistic queries without breaking a live database.",
    estimatedTime: "10 days",
  },
];

function parseIdeas(text: string) {
  const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
  const json: unknown = JSON.parse(cleaned);
  return ideasSchema.parse(json);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("fresh") === "1";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ ideas: fallbackIdeas, source: "fallback" });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1400,
      messages: [
        {
          role: "user",
          content:
            "You are a senior tech advisor. Suggest 6 innovative project ideas for a junior Data Science Engineer and Full Stack Developer skilled in Python, ML, React, Next.js, and Node.js. For each idea return JSON: { title, description (2 sentences), techStack: string[], difficulty: 'Easy'|'Medium'|'Hard', impact: string, estimatedTime: string } Return ONLY a valid JSON array, no markdown.",
        },
      ],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const ideas = parseIdeas(text);
    return Response.json(
      { ideas, source: fresh ? "fresh" : "generated" },
      { headers: fresh ? { "Cache-Control": "no-store" } : undefined },
    );
  } catch {
    return Response.json({ ideas: fallbackIdeas, source: "fallback" });
  }
}
