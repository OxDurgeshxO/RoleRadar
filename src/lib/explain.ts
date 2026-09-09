// Narrative generation: short, student-friendly explanations produced
// deterministically from the scoring results.

import { scoreTier } from "./match";
import { skillLabel } from "./skills";
import type { RoleMatchResult } from "./types";

export const DISCLAIMER =
  "This tool is for guidance and learning only. Match scores are estimates based on keyword overlap, not hiring decisions, and a missing keyword does not necessarily mean a missing ability. Please combine these results with human review by mentors, teachers, or recruiters.";

export function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function labels(ids: string[]): string[] {
  return ids.map(skillLabel);
}

/** 2-3 sentence explanation of why a role scored the way it did. */
export function explainRole(match: RoleMatchResult): string {
  const tier = scoreTier(match.matchScore);
  const present = labels(match.present).slice(0, 4);
  const missing = labels(match.missing).slice(0, 3);
  const partial = labels(match.partial).slice(0, 3);

  const s1 =
    present.length > 0
      ? `Your strongest signals here are ${joinList(present)}.`
      : "There is little direct evidence for this role's core skills on the resume yet.";

  const gapBits: string[] = [];
  if (missing.length > 0) gapBits.push(`main gaps are ${joinList(missing)}`);
  if (partial.length > 0) gapBits.push(`${joinList(partial)} ${partial.length > 1 ? "are" : "is"} only partially covered`);

  const closing: Record<typeof tier, string> = {
    strong: "a short, focused effort could close them quickly.",
    solid: "these are learnable in a few focused weeks.",
    partial: "start with the fundamentals and practice on small projects.",
    early: "focus on the fundamentals first and build up from there.",
  };

  if (gapBits.length === 0) {
    return `${s1} All required skills show clear evidence — this is ${tier === "strong" ? "an excellent" : "a"} match on paper.`;
  }
  return `${s1} The ${gapBits.join(", while the ")} — ${closing[tier]}`;
}

/** 2-4 sentence big-picture summary across all roles. */
export function buildOverallSummary(
  sortedMatches: RoleMatchResult[],
  extracted: string[],
  roleCount: number,
): string {
  const top = sortedMatches[0];
  const strengths = labels(top.present).slice(0, 3);

  // Recurring gaps: skills missing across the most roles.
  const gapCounts = new Map<string, number>();
  for (const m of sortedMatches) {
    for (const s of m.missing) gapCounts.set(s, (gapCounts.get(s) ?? 0) + 1);
    for (const s of m.partial) gapCounts.set(s, (gapCounts.get(s) ?? 0) + 0.5);
  }
  const recurring = [...gapCounts.entries()]
    .sort((a, b) => b[1] - a[1] || skillLabel(a[0]).localeCompare(skillLabel(b[0])))
    .slice(0, 3)
    .map(([id]) => skillLabel(id));

  const s1 =
    strengths.length > 0
      ? `Your resume aligns best with ${top.roleName} (${top.matchScore}%), supported by clear evidence of ${joinList(strengths)}.`
      : `Across the ${roleCount} roles analyzed, ${top.roleName} (${top.matchScore}%) is currently the closest fit.`;

  const s2 =
    extracted.length >= 12
      ? `With ${extracted.length} skills detected, you have a broad technical base to build on.`
      : extracted.length >= 6
        ? `With ${extracted.length} skills detected, you have a solid starting base to grow from.`
        : `Only ${extracted.length} distinct skills were detected — adding concrete project keywords usually reveals more.`;

  const s3 =
    recurring.length > 0
      ? `The most common gaps across roles are ${joinList(recurring)} — improving these lifts several of your scores at once.`
      : "No recurring gaps were found across roles, which is a great sign.";

  return `${s1} ${s2} ${s3}`;
}
