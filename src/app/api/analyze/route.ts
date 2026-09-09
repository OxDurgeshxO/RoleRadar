import { NextResponse } from "next/server";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { loadRoles } from "@/db/seed";
import { runAnalysis } from "@/lib/pipeline";
import { skillLabel } from "@/lib/skills";

export const dynamic = "force-dynamic";

const MIN_CHARS = 40;
const MAX_CHARS = 25_000;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const resumeText = (body as { resume_text?: unknown })?.resume_text;
  const targetRoleRaw = (body as { target_role?: unknown })?.target_role;

  if (typeof resumeText !== "string" || resumeText.trim().length < MIN_CHARS) {
    return NextResponse.json(
      { error: `resume_text must be a string of at least ${MIN_CHARS} characters.` },
      { status: 400 },
    );
  }
  if (resumeText.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `resume_text is too long (max ${MAX_CHARS} characters).` },
      { status: 400 },
    );
  }
  const targetRole = typeof targetRoleRaw === "string" && targetRoleRaw.trim() ? targetRoleRaw.trim() : null;

  try {
    const roles = await loadRoles();
    const validTarget = targetRole && roles.some((r) => r.name.toLowerCase() === targetRole.toLowerCase())
      ? targetRole
      : null;

    const { extractedSkills, report, roadmapRole } = runAnalysis({
      resumeText,
      roles,
      targetRole: validTarget,
    });

    const top = report.recommended_roles[0];
    const [row] = await db
      .insert(analyses)
      .values({
        resumeText,
        resumeExcerpt: resumeText.replace(/\s+/g, " ").trim().slice(0, 280),
        extractedSkills,
        targetRole: roadmapRole,
        result: report,
        topRole: top?.role_name ?? "—",
        topScore: top?.match_score ?? 0,
      })
      .returning({ id: analyses.id, createdAt: analyses.createdAt });

    return NextResponse.json({
      id: row.id,
      created_at: row.createdAt.toISOString(),
      roadmap_role: roadmapRole,
      extracted_skills: extractedSkills.map(skillLabel),
      result: report,
    });
  } catch (err) {
    console.error("POST /api/analyze failed", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
