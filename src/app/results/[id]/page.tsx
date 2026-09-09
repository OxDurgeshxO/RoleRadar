import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { loadRoles } from "@/db/seed";
import { analyzeAts } from "@/lib/ats";
import { skillLabel } from "@/lib/skills";
import type { StoredAnalysis } from "@/lib/types";
import { ResultsView } from "@/components/results-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analysis Report — RoleFit",
  description: "Role match scores, skill gaps, ATS readiness, and a week-by-week learning roadmap.",
};

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let row;
  try {
    [row] = await db.select().from(analyses).where(eq(analyses.id, id)).limit(1);
  } catch {
    row = undefined;
  }
  if (!row) notFound();

  const catalog = await loadRoles();

  const analysis: StoredAnalysis = {
    id: row.id,
    created_at: row.createdAt.toISOString(),
    resume_excerpt: row.resumeExcerpt,
    extracted_skills: row.extractedSkills.map(skillLabel),
    target_role: row.targetRole,
    top_role: row.topRole,
    top_score: row.topScore,
    result: row.result,
  };

  return (
    <ResultsView
      analysis={analysis}
      roles={catalog.map((r) => ({ name: r.name, accent: r.accent, description: r.description }))}
      rolesFull={catalog}
      extractedIds={row.extractedSkills}
      ats={analyzeAts(row.resumeText, row.extractedSkills.length)}
      rawResumeText={row.resumeText}
    />
  );
}
