import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
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

    return NextResponse.json({
      analyses: rows.map((r) => ({
        id: r.id,
        created_at: r.createdAt.toISOString(),
        top_role: r.topRole,
        top_score: r.topScore,
        skill_count: r.extractedSkills.length,
      })),
    });
  } catch (err) {
    console.error("GET /api/analyses failed", err);
    return NextResponse.json({ error: "Could not load history." }, { status: 500 });
  }
}
