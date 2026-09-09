import { NextResponse } from "next/server";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { loadRoles } from "@/db/seed";
import { runAnalysis } from "@/lib/pipeline";
import { skillLabel } from "@/lib/skills";
import { cleanResumeText } from "@/lib/clean";
import { extractSkillsFromCleaned } from "@/lib/extract";
import { fallbackStore } from "@/lib/store";
import type { RoleInput } from "@/lib/types";

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
  const jobDescription = (body as { job_description?: unknown })?.job_description;

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
  const customJd = typeof jobDescription === "string" && jobDescription.trim().length >= 40 ? jobDescription.trim() : null;

  try {
    let roles: RoleInput[] = await loadRoles();

    // If a custom Job Description was provided, parse its required skills and inject dynamic target role
    let activeTargetRole = targetRole;
    if (customJd) {
      const jdCleaned = cleanResumeText(customJd);
      const jdSkills = extractSkillsFromCleaned(jdCleaned);
      if (jdSkills.length > 0) {
        const customRole: RoleInput = {
          name: "Target Job Posting",
          description: "Custom role extracted dynamically from your pasted job description.",
          required: jdSkills,
          accent: "#ec4899",
        };
        roles = [customRole, ...roles];
        activeTargetRole = "Target Job Posting";
      }
    }

    const validTarget = activeTargetRole && roles.some((r) => r.name.toLowerCase() === activeTargetRole.toLowerCase())
      ? activeTargetRole
      : null;

    const { extractedSkills, report, roadmapRole } = runAnalysis({
      resumeText,
      roles,
      targetRole: validTarget,
    });

    const top = report.recommended_roles[0];
    const resumeExcerpt = resumeText.replace(/\s+/g, " ").trim().slice(0, 280);

    let analysisId: string;
    let createdAtDate: Date;

    try {
      const [row] = await db
        .insert(analyses)
        .values({
          resumeText,
          resumeExcerpt,
          extractedSkills,
          targetRole: roadmapRole,
          result: report,
          topRole: top?.role_name ?? "—",
          topScore: top?.match_score ?? 0,
        })
        .returning({ id: analyses.id, createdAt: analyses.createdAt });
      analysisId = row.id;
      createdAtDate = row.createdAt;
    } catch {
      // Database is offline — store seamlessly in memory store
      analysisId = crypto.randomUUID();
      createdAtDate = new Date();
      fallbackStore.set({
        id: analysisId,
        createdAt: createdAtDate,
        resumeText,
        resumeExcerpt,
        extractedSkills,
        targetRole: roadmapRole,
        result: report,
        topRole: top?.role_name ?? "—",
        topScore: top?.match_score ?? 0,
      });
    }

    return NextResponse.json({
      id: analysisId,
      created_at: createdAtDate.toISOString(),
      roadmap_role: roadmapRole,
      extracted_skills: extractedSkills.map(skillLabel),
      result: report,
    });
  } catch (err) {
    console.error("POST /api/analyze failed", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
