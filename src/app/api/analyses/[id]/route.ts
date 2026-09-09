import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { fallbackStore } from "@/lib/store";
import { skillLabel } from "@/lib/skills";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  try {
    const [row] = await db.select().from(analyses).where(eq(analyses.id, id)).limit(1);
    if (row) {
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
    }
  } catch {
    // Database connection failed — fall through to in-memory store
  }

  const fb = fallbackStore.get(id);
  if (fb) {
    return NextResponse.json({
      id: fb.id,
      created_at: fb.createdAt.toISOString(),
      resume_excerpt: fb.resumeExcerpt,
      extracted_skills: fb.extractedSkills.map(skillLabel),
      target_role: fb.targetRole,
      top_role: fb.topRole,
      top_score: fb.topScore,
      result: fb.result,
    });
  }

  return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let deleted = false;
  try {
    await db.delete(analyses).where(eq(analyses.id, id));
    deleted = true;
  } catch {
    // DB delete failed
  }
  if (fallbackStore.delete(id)) {
    deleted = true;
  }
  return NextResponse.json({ ok: deleted });
}
