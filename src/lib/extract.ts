// Keyword-based skill extraction over cleaned resume text.

import { cleanResumeText, tokenRegex } from "./clean";
import { SKILL_DEFS } from "./skills";

/** Extract canonical skill ids from already-cleaned text (stable dictionary order). */
export function extractSkillsFromCleaned(cleanedText: string): string[] {
  const found: string[] = [];
  for (const def of SKILL_DEFS) {
    if (def.patterns.some((p) => tokenRegex(p).test(cleanedText))) {
      found.push(def.id);
    }
  }
  return found;
}

/** Convenience: clean raw text and extract canonical skill ids. */
export function extractSkills(rawText: string): { cleanedText: string; skills: string[] } {
  const cleanedText = cleanResumeText(rawText);
  return { cleanedText, skills: extractSkillsFromCleaned(cleanedText) };
}
