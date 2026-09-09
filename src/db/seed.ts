// Idempotent role seeding — safe to call from any server code path.
// Resilient dual-mode: if PostgreSQL is connected, synchronizes and reads from DB;
// if PostgreSQL is offline or unreachable, seamlessly falls back to static verified ROLE_SEEDS.

import { db } from "./index";
import { roles } from "./schema";
import { ROLE_SEEDS } from "./roles-data";
import type { RoleInput } from "@/lib/types";

let seeded = false;

export async function ensureRolesSeeded(): Promise<void> {
  if (seeded) return;
  try {
    const existing = await db.select({ name: roles.name }).from(roles);
    const have = new Set(existing.map((r) => r.name));
    const toInsert = ROLE_SEEDS.filter((s) => !have.has(s.name)).map((s) => ({
      name: s.name,
      description: s.description,
      requiredSkills: s.required,
      accent: s.accent,
    }));
    if (toInsert.length > 0) {
      await db.insert(roles).values(toInsert).onConflictDoNothing();
    }
    seeded = true;
  } catch {
    // Database is unavailable; continue gracefully using static in-memory catalog
  }
}

/** Load the role catalog as engine-ready RoleInput objects (seeds first if empty). */
export async function loadRoles(): Promise<RoleInput[]> {
  try {
    await ensureRolesSeeded();
    const rows = await db.select().from(roles).orderBy(roles.id);
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        name: r.name,
        description: r.description,
        required: r.requiredSkills,
        accent: r.accent,
      }));
    }
  } catch {
    // Database connection failed — return verified static catalog
  }
  return ROLE_SEEDS;
}
