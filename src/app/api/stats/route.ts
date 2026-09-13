import { fallbackStats } from "@/lib/stats";
import { createAnonClient, hasSupabaseConfig } from "@/lib/supabase";

export async function GET() {
  if (!hasSupabaseConfig()) {
    return Response.json({ stats: fallbackStats });
  }

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("portfolio_stats")
      .select("id, key, value, label, icon, updated_at")
      .order("key");

    if (error || !data?.length) {
      return Response.json({ stats: fallbackStats });
    }

    return Response.json({ stats: data });
  } catch {
    return Response.json({ stats: fallbackStats });
  }
}
