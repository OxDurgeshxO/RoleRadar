import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { loadRoles } from "@/db/seed";
import { analyzeAts } from "@/lib/ats";
import { skillLabel } from "@/lib/skills";
import { fallbackStore } from "@/lib/store";
import type { AnalysisReport, StoredAnalysis } from "@/lib/types";
import { ResultsView } from "@/components/results-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analysis Report — RoleFit",
  description: "Role match scores, skill gaps, ATS readiness, and a week-by-week learning roadmap.",
};

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let row:
    | {
        id: string;
        createdAt: Date;
        resumeExcerpt: string;
        extractedSkills: string[];
        targetRole: string | null;
        topRole: string;
        topScore: number;
        result: AnalysisReport;
        resumeText: string;
      }
    | undefined;

  try {
    const [dbRow] = await db.select().from(analyses).where(eq(analyses.id, id)).limit(1);
    if (dbRow) {
      row = {
        id: dbRow.id,
        createdAt: dbRow.createdAt,
        resumeExcerpt: dbRow.resumeExcerpt,
        extractedSkills: dbRow.extractedSkills,
        targetRole: dbRow.targetRole,
        topRole: dbRow.topRole,
        topScore: dbRow.topScore,
        result: dbRow.result,
        resumeText: dbRow.resumeText,
      };
    }
  } catch {
    row = undefined;
  }

  if (!row) {
    row = fallbackStore.get(id);
  }

  if (!row) notFound();

  const catalog = await loadRoles();

  const analysis: StoredAnalysis = {
    id: row.id,
    created_at: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString(),
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
