import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createServiceClient, hasSupabaseConfig } from "@/lib/supabase";

const updateSchema = z.object({
  value: z.string().trim().min(1, "Value is required."),
  label: z.string().trim().min(1, "Label is required."),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasSupabaseConfig() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      { error: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const { key } = await context.params;
  const parsed = updateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 },
    );
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("portfolio_stats")
      .update({
        value: parsed.data.value,
        label: parsed.data.label,
        updated_at: new Date().toISOString(),
      })
      .eq("key", key)
      .select("id, key, value, label, icon, updated_at")
      .single();

    if (error || !data) {
      return Response.json(
        { error: error?.message ?? "Stat not found." },
        { status: 404 },
      );
    }

    return Response.json({ stat: data });
  } catch {
    return Response.json({ error: "Failed to update stat." }, { status: 500 });
  }
}
