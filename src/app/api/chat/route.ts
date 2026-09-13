import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { site } from "@/data/site";

export const runtime = "edge";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the AI assistant on ${site.name}'s portfolio website.
You know everything about her:
- She is an Intern AI Engineer
- Contact email: ${site.email}
- Skills: Python, Machine Learning, TensorFlow, PyTorch, Scikit-learn,
  React, Next.js, TypeScript, Node.js, FastAPI, PostgreSQL, SQL, Docker
- She has built ML projects, full-stack web apps, and data dashboards
- She is open to internships, freelance projects, and full-time roles
- Visitors can contact her via the Contact section
- LinkedIn: ${site.socials.linkedin}
- Medium: ${site.socials.medium}

Rules:
- Keep ALL replies under 3 sentences
- Be warm, smart, and professional
- If asked about hiring/collaboration → encourage using the Contact form
- Never make up projects or details you don't know
- If unsure → say "You can ask ${site.name} directly via the contact form!"`;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid chat payload." }, { status: 400 });
  }

  if (parsed.data.messages.length > 10) {
    return Response.json(
      {
        error:
          "Please use the contact form for longer conversations!",
      },
      { status: 429 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 500 },
    );
  }

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: parsed.data.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.error(new Error("Chat stream failed."));
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
