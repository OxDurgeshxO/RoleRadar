// Idempotent role seeding — safe to call from any server code path.

import { db } from "./index";
import { roles } from "./schema";
import { ROLE_SEEDS } from "./roles-data";

let seeded = false;

export async function ensureRolesSeeded(): Promise<void> {
  if (seeded) return;
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
}

/** Load the role catalog as engine-ready RoleInput objects (seeds first if empty). */
export async function loadRoles() {
  await ensureRolesSeeded();
  const rows = await db.select().from(roles).orderBy(roles.id);
  return rows.map((r) => ({
    name: r.name,
    description: r.description,
    required: r.requiredSkills,
    accent: r.accent,
  }));
}
