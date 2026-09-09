import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ROLE_SEEDS } from "@/db/roles-data";
import { fallbackStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbConnected = false;
  try {
    await db.execute(sql`select 1`);
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  return Response.json({
    status: "ok",
    database: {
      connected: dbConnected,
      mode: dbConnected ? "postgresql" : "in-memory-fallback",
    },
    engine: {
      status: "ready",
      roles_count: ROLE_SEEDS.length,
      fallback_analyses_cached: fallbackStore.count(),
    },
  });
}
