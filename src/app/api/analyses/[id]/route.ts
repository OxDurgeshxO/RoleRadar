import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { skillLabel } from "@/lib/skills";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const [row] = await db.select().from(analyses).where(eq(analyses.id, id)).limit(1);
    if (!row) return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
    return NextResponse.json({
      id: row.id,
      created_at: row.createdAt.toISOString(),
      resume_excerpt: row.resumeExcerpt,
      extracted_skills: row.extractedSkills.map(skillLabel),
      target_role: row.targetRole,
      top_role: row.topRole,
      top_score: row.topScore,
      result: row.result,
    });
  } catch (err) {
    console.error("GET /api/analyses/[id] failed", err);
    return NextResponse.json({ error: "Could not load analysis." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    await db.delete(analyses).where(eq(analyses.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/analyses/[id] failed", err);
    return NextResponse.json({ error: "Could not delete analysis." }, { status: 500 });
  }
}
