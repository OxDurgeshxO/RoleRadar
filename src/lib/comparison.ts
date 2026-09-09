// Resume version comparison utility
// Compare two resume texts and show skill/score differences

import { cleanResumeText } from "./clean";
import { extractSkillsFromCleaned } from "./extract";
import { scoreAllRoles } from "./match";
import { skillLabel } from "./skills";
import type { RoleInput } from "./types";

export interface SkillChange {
  skill: string;
  status: "added" | "removed" | "unchanged";
}

export interface RoleScoreChange {
  roleName: string;
  oldScore: number;
  newScore: number;
  delta: number;
}

export interface ComparisonResult {
  oldSkillCount: number;
  newSkillCount: number;
  skillChanges: SkillChange[];
  addedSkills: string[];
  removedSkills: string[];
  scoreChanges: RoleScoreChange[];
  overallImprovement: number; // average delta across all roles
  bestImprovedRole: RoleScoreChange | null;
}

export function compareResumes(
  oldText: string,
  newText: string,
  roles: RoleInput[],
): ComparisonResult {
  const oldCleaned = cleanResumeText(oldText);
  const newCleaned = cleanResumeText(newText);

  const oldSkills = extractSkillsFromCleaned(oldCleaned);
  const newSkills = extractSkillsFromCleaned(newCleaned);

  const oldSet = new Set(oldSkills);
  const newSet = new Set(newSkills);

  const addedSkills = newSkills.filter((s) => !oldSet.has(s));
  const removedSkills = oldSkills.filter((s) => !newSet.has(s));
  const unchangedSkills = newSkills.filter((s) => oldSet.has(s));

  const skillChanges: SkillChange[] = [
    ...addedSkills.map((s) => ({ skill: skillLabel(s), status: "added" as const })),
    ...removedSkills.map((s) => ({ skill: skillLabel(s), status: "removed" as const })),
    ...unchangedSkills.map((s) => ({ skill: skillLabel(s), status: "unchanged" as const })),
  ];

  const oldScores = scoreAllRoles(roles, oldSkills);
  const newScores = scoreAllRoles(roles, newSkills);

  const oldScoreMap = new Map(oldScores.map((s) => [s.roleName, s.matchScore]));

  const scoreChanges: RoleScoreChange[] = newScores.map((s) => ({
    roleName: s.roleName,
    oldScore: oldScoreMap.get(s.roleName) ?? 0,
    newScore: s.matchScore,
    delta: s.matchScore - (oldScoreMap.get(s.roleName) ?? 0),
  }));

  const totalDelta = scoreChanges.reduce((sum, c) => sum + c.delta, 0);
  const overallImprovement = Math.round((totalDelta / scoreChanges.length) * 10) / 10;

  const bestImprovedRole = scoreChanges.reduce<RoleScoreChange | null>(
    (best, curr) => (!best || curr.delta > best.delta ? curr : best),
    null,
  );

  return {
    oldSkillCount: oldSkills.length,
    newSkillCount: newSkills.length,
    skillChanges,
    addedSkills: addedSkills.map(skillLabel),
    removedSkills: removedSkills.map(skillLabel),
    scoreChanges,
    overallImprovement,
    bestImprovedRole,
  };
}
