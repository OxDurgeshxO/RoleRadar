import { NextResponse } from "next/server";
import { loadRoles } from "@/db/seed";
import { skillLabel } from "@/lib/skills";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const roles = await loadRoles();
    return NextResponse.json({
      roles: roles.map((r) => ({
        name: r.name,
        description: r.description,
        accent: r.accent,
        required_skills: r.required.map(skillLabel),
        required_count: r.required.length,
      })),
    });
  } catch (err) {
    console.error("GET /api/roles failed", err);
    return NextResponse.json({ error: "Could not load roles." }, { status: 500 });
  }
}
