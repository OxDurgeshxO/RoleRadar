import { desc } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import type { AnalysisListItem } from "@/lib/types";
import { HistoryView } from "@/components/history-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "History — RoleFit",
  description: "Review past analyses and track your score progress over time.",
};

export default async function HistoryPage() {
  let items: AnalysisListItem[] = [];
  try {
    const rows = await db
      .select({
        id: analyses.id,
        createdAt: analyses.createdAt,
        topRole: analyses.topRole,
        topScore: analyses.topScore,
        extractedSkills: analyses.extractedSkills,
      })
      .from(analyses)
      .orderBy(desc(analyses.createdAt))
      .limit(24);
    items = rows.map((r) => ({
      id: r.id,
      created_at: r.createdAt.toISOString(),
      top_role: r.topRole,
      top_score: r.topScore,
      skill_count: r.extractedSkills.length,
    }));
  } catch (err) {
    console.error("History load failed", err);
  }

  return <HistoryView items={items} />;
}
