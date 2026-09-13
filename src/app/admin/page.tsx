import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { fallbackStats, type PortfolioStat } from "@/lib/stats";
import { createAnonClient, hasSupabaseConfig } from "@/lib/supabase";
import { AdminDashboard } from "./dashboard";

async function loadStats(): Promise<PortfolioStat[]> {
  if (!hasSupabaseConfig()) return fallbackStats;

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("portfolio_stats")
      .select("id, key, value, label, icon, updated_at")
      .order("key");

    if (error || !data?.length) return fallbackStats;
    return data as PortfolioStat[];
  } catch {
    return fallbackStats;
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const stats = await loadStats();

  return <AdminDashboard initialStats={stats} email={session.user?.email ?? ""} />;
}
