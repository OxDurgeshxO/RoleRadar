import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { analyses } from "@/db/schema";
import { fallbackStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbRows: {
    id: string;
    createdAt: Date;
    topRole: string;
    topScore: number;
    extractedSkills: string[];
  }[] = [];

  try {
    dbRows = await db
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
  } catch {
    // Database connection failed — fall through to in-memory store
  }

  const fbRows = fallbackStore.getAll().map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    topRole: r.topRole,
    topScore: r.topScore,
    extractedSkills: r.extractedSkills,
  }));

  const seen = new Set<string>();
  const combined = [...dbRows, ...fbRows]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .slice(0, 24);

  return NextResponse.json({
    analyses: combined.map((r) => ({
      id: r.id,
      created_at: new Date(r.createdAt).toISOString(),
      top_role: r.topRole,
      top_score: r.topScore,
      skill_count: r.extractedSkills.length,
    })),
  });
}
