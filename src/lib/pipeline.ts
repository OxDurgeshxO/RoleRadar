// Orchestrator: raw resume text + role catalog -> strict JSON report.

import { cleanResumeText } from "./clean";
import { extractSkillsFromCleaned } from "./extract";
import { explainRole, buildOverallSummary, DISCLAIMER } from "./explain";
import { scoreAllRoles } from "./match";
import { buildRoadmap } from "./roadmap";
import { skillLabel } from "./skills";
import type { AnalysisReport, RoleInput, RoleMatchResult } from "./types";

export interface AnalyzeParams {
  resumeText: string;
  roles: RoleInput[];
  /** Optional explicit target role name; its gaps drive the roadmap. */
  targetRole?: string | null;
}

export interface AnalyzeResult {
  cleanedText: string;
  extractedSkills: string[]; // canonical ids
  roadmapRole: string; // the role the roadmap was built for
  report: AnalysisReport;
}

export function runAnalysis({ resumeText, roles, targetRole }: AnalyzeParams): AnalyzeResult {
  const cleanedText = cleanResumeText(resumeText);
  const extractedSkills = extractSkillsFromCleaned(cleanedText);
  const sorted: RoleMatchResult[] = scoreAllRoles(roles, extractedSkills);

  // Pick which role drives the roadmap: explicit target if it exists, else top scorer.
  const explicit = targetRole
    ? sorted.find((m) => m.roleName.toLowerCase() === targetRole.toLowerCase())
    : undefined;
  const roadmapMatch = explicit ?? sorted[0];

  const report: AnalysisReport = {
    overall_summary: buildOverallSummary(sorted, extractedSkills, roles.length),
    role_analysis: sorted.map((m) => ({
      role_name: m.roleName,
      match_score: m.matchScore,
      skills_present: m.present.map(skillLabel),
      skills_partial: m.partial.map(skillLabel),
      skills_missing: m.missing.map(skillLabel),
      short_explanation: explainRole(m),
    })),
    recommended_roles: sorted.slice(0, 3).map((m) => ({
      role_name: m.roleName,
      match_score: m.matchScore,
    })),
    learning_roadmap: buildRoadmap(roadmapMatch.roleName, roadmapMatch.missing, roadmapMatch.partial),
    disclaimer: DISCLAIMER,
  };

  return { cleanedText, extractedSkills, roadmapRole: roadmapMatch.roleName, report };
}
