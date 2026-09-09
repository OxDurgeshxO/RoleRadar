// Rule-based resume -> role scorer.
//
// score = round( (present + 0.5 * partial) / required * 100 )
//
// This expresses a TF-IDF + cosine-similarity style idea — measuring how much two
// skill profiles overlap — through an explicit, explainable skill-overlap rule.

import { PARTIAL_SIGNALS } from "./skills";
import type { RoleInput, RoleMatchResult } from "./types";

/** Classify a role's required skills and compute the 0-100 match score. */
export function matchRole(roleName: string, required: string[], extracted: string[]): RoleMatchResult {
  const have = new Set(extracted);
  const present: string[] = [];
  const partial: string[] = [];
  const missing: string[] = [];

  for (const skill of required) {
    if (have.has(skill)) {
      present.push(skill);
      continue;
    }
    const signals = PARTIAL_SIGNALS[skill] ?? [];
    if (signals.some((s) => have.has(s))) {
      partial.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const total = required.length;
  const score = total === 0 ? 0 : Math.round(((present.length + 0.5 * partial.length) / total) * 100);
  return { roleName, present, partial, missing, matchScore: Math.min(100, Math.max(0, score)) };
}

/** Score every role and sort from highest to lowest match (ties broken by name for determinism). */
export function scoreAllRoles(roles: RoleInput[], extracted: string[]): RoleMatchResult[] {
  return roles
    .map((r) => matchRole(r.name, r.required, extracted))
    .sort((a, b) => b.matchScore - a.matchScore || a.roleName.localeCompare(b.roleName));
}

/** Score tier used for tone in generated explanations. */
export function scoreTier(score: number): "strong" | "solid" | "partial" | "early" {
  if (score >= 75) return "strong";
  if (score >= 55) return "solid";
  if (score >= 35) return "partial";
  return "early";
}
