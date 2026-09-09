// "Highest-impact skills" analytics: rank gap skills by how much they would
// raise scores across the whole catalog if learned. Pure and client-safe.

import { matchRole } from "./match";
import { skillLabel } from "./skills";
import type { RoleInput } from "./types";

export interface ImpactItem {
  id: string;
  label: string;
  /** Total percentage points this skill would add, summed across all roles. */
  gain: number;
  /** How many roles this skill would improve. */
  rolesLifted: number;
}

export function computeSkillImpact(roles: RoleInput[], extractedIds: string[]): ImpactItem[] {
  const acc = new Map<string, { gain: number; rolesLifted: number }>();

  for (const role of roles) {
    const req = Math.max(role.required.length, 1);
    const match = matchRole(role.name, role.required, extractedIds);
    for (const s of match.missing) {
      const cur = acc.get(s) ?? { gain: 0, rolesLifted: 0 };
      cur.gain += 100 / req; // missing -> present is a full point
      cur.rolesLifted += 1;
      acc.set(s, cur);
    }
    for (const s of match.partial) {
      const cur = acc.get(s) ?? { gain: 0, rolesLifted: 0 };
      cur.gain += 50 / req; // partial -> present adds the remaining half point
      cur.rolesLifted += 1;
      acc.set(s, cur);
    }
  }

  return [...acc.entries()]
    .map(([id, v]) => ({ id, label: skillLabel(id), gain: Math.round(v.gain * 10) / 10, rolesLifted: v.rolesLifted }))
    .sort((a, b) => b.gain - a.gain || b.rolesLifted - a.rolesLifted || a.label.localeCompare(b.label));
}
