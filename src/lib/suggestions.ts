// Achievement and resume improvement suggestions based on extracted skills
// and identified gaps. Pure and client-safe.

import { skillLabel } from "./skills";

export interface Suggestion {
  id: string;
  category: "achievement" | "keyword" | "structure" | "project";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "created", "optimized",
  "improved", "automated", "deployed", "launched", "led", "managed",
  "analyzed", "engineered", "architected", "scaled", "reduced", "increased",
];

const QUANTIFIERS = [
  "% ", "users", "customers", "records", "rows", "queries", "requests",
  "reduction", "improvement", "increase", "faster", "accuracy", "revenue",
];

export function generateSuggestions(
  rawText: string,
  extractedSkills: string[],
  missingSkills: string[],
  topRoleName: string,
): Suggestion[] {
  const t = rawText.toLowerCase();
  const suggestions: Suggestion[] = [];

  // Check for action verbs
  const verbCount = ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`).test(t)).length;
  if (verbCount < 3) {
    suggestions.push({
      id: "action-verbs",
      category: "achievement",
      priority: "high",
      title: "Add stronger action verbs",
      description: `Start your bullet points with verbs like "built," "optimized," "deployed," or "led" instead of passive phrases like "was responsible for."`,
    });
  }

  // Check for quantified achievements
  const hasQuantifiers = QUANTIFIERS.some((q) => t.includes(q));
  if (!hasQuantifiers) {
    suggestions.push({
      id: "quantify",
      category: "achievement",
      priority: "high",
      title: "Quantify your achievements",
      description: `Add numbers to your accomplishments: "Processed 50k+ records" or "Improved load time by 40%" makes a stronger impression than vague descriptions.`,
    });
  }

  // Check for technical depth
  if (extractedSkills.length < 8) {
    suggestions.push({
      id: "more-skills",
      category: "keyword",
      priority: "high",
      title: "Add more technical keywords",
      description: `Only ${extractedSkills.length} skills were detected. Name specific tools, frameworks, and technologies you've used to improve ATS matching.`,
    });
  }

  // Suggest adding missing high-impact skills to projects
  const topMissing = missingSkills.slice(0, 3);
  if (topMissing.length > 0) {
    suggestions.push({
      id: "bridge-gaps",
      category: "project",
      priority: "high",
      title: `Learn ${topMissing.map(skillLabel).join(", ")} to boost your ${topRoleName} match`,
      description: `These skills are required for ${topRoleName} but missing from your resume. Add a project using them, even a small portfolio piece counts.`,
    });
  }

  // Check for project section
  if (!/project|portfolio|built|developed|created/.test(t)) {
    suggestions.push({
      id: "add-projects",
      category: "structure",
      priority: "high",
      title: "Add a Projects section",
      description: "A dedicated Projects section showcasing 2-3 technical projects with outcomes helps demonstrate hands-on experience.",
    });
  }

  // Check for GitHub/portfolio link
  if (!/github\.com|gitlab\.com|portfolio|\.dev|\.io/.test(t)) {
    suggestions.push({
      id: "add-links",
      category: "structure",
      priority: "medium",
      title: "Add GitHub or portfolio links",
      description: "Include links to your GitHub profile or portfolio website so recruiters can see your actual code and projects.",
    });
  }

  // Check for certifications mention
  if (extractedSkills.some((s) => ["aws", "azure", "gcp", "docker", "kubernetes"].includes(s))) {
    if (!/certified|certification|certificate/.test(t)) {
      suggestions.push({
        id: "certifications",
        category: "keyword",
        priority: "medium",
        title: "Consider relevant certifications",
        description: "For cloud and DevOps skills, certifications like AWS Certified or Docker Certified can strengthen your credibility.",
      });
    }
  }

  // Check resume length
  const wordCount = t.split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) {
    suggestions.push({
      id: "too-short",
      category: "structure",
      priority: "high",
      title: "Expand your resume content",
      description: "Your resume seems very brief. Add more details about your projects, responsibilities, and achievements to fill at least one full page.",
    });
  } else if (wordCount > 800) {
    suggestions.push({
      id: "too-long",
      category: "structure",
      priority: "medium",
      title: "Consider trimming content",
      description: "Your resume is quite long. Focus on the most relevant and recent experiences — aim for one page as a student, two max for experienced roles.",
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// Keyword density analysis
export interface KeywordDensity {
  skill: string;
  count: number;
  density: number; // percentage of total words
}

export function analyzeKeywordDensity(rawText: string, extractedSkills: string[]): KeywordDensity[] {
  const t = rawText.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  return extractedSkills
    .map((skill) => {
      const label = skillLabel(skill);
      const pattern = new RegExp(`\\b${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = rawText.match(pattern) || [];
      return {
        skill: label,
        count: matches.length,
        density: totalWords > 0 ? Math.round((matches.length / totalWords) * 1000) / 10 : 0,
      };
    })
    .filter((k) => k.count > 0)
    .sort((a, b) => b.count - a.count);
}
