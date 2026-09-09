import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { loadRoles } from "@/db/seed";
import { matchRole } from "@/lib/match";
import { buildRoadmap } from "@/lib/roadmap";
import { skillLabel } from "@/lib/skills";
import { fallbackStore } from "@/lib/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let body: { role_name?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const roleName = typeof body.role_name === "string" ? body.role_name : null;
  if (!roleName) return NextResponse.json({ error: "role_name is required." }, { status: 400 });

  let extractedSkills: string[] | null = null;
  try {
    const [row] = await db.select().from(analyses).where(eq(analyses.id, id)).limit(1);
    if (row) extractedSkills = row.extractedSkills;
  } catch {
    // Database connection failed
  }

  if (!extractedSkills) {
    const fb = fallbackStore.get(id);
    if (fb) extractedSkills = fb.extractedSkills;
  }

  if (!extractedSkills) {
    return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
  }

  try {
    const catalog = await loadRoles();
    const role = catalog.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
    if (!role) return NextResponse.json({ error: "Unknown role." }, { status: 400 });

    const match = matchRole(role.name, role.required, extractedSkills);
    return NextResponse.json({
      role_name: role.name,
      match_score: match.matchScore,
      skills_missing: match.missing.map(skillLabel),
      skills_partial: match.partial.map(skillLabel),
      learning_roadmap: buildRoadmap(match.roleName, match.missing, match.partial),
    });
  } catch (err) {
    console.error("POST /api/analyses/[id]/roadmap failed", err);
    return NextResponse.json({ error: "Could not rebuild the roadmap." }, { status: 500 });
  }
}
