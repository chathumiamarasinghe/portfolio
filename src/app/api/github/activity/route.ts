import { getRecentActivity } from "@/lib/github";

export const revalidate = 300;

export async function GET() {
  try {
    const activity = await getRecentActivity();
    return Response.json({ activity });
  } catch {
    return Response.json({ activity: [] });
  }
}
