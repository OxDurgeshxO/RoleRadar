// ATS readiness check — heuristic, resume-writing best practices applied to the
// raw resume text. Pure and client/server safe, computed at report render time.

export interface AtsCheck {
  id: string;
  label: string;
  passed: boolean;
  tip: string; // shown when the check fails
}

export interface AtsReport {
  score: number; // 0-100, weighted
  checks: AtsCheck[];
}

const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "led", "created",
  "optimized", "analyzed", "analysed", "deployed", "improved", "automated",
  "launched", "engineered", "trained", "published", "mentored",
];

export function analyzeAts(rawText: string, extractedSkillCount: number): AtsReport {
  const t = rawText.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean).length;
  const verbHits = ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`).test(t)).length;

  const weighted: (AtsCheck & { weight: number })[] = [
    {
      id: "length",
      label: "Adequate length",
      passed: words >= 120 && words <= 1500,
      tip:
        words < 120
          ? "The resume looks very short — aim for one full page with clear sections."
          : "Very long resumes dilute keywords — keep it to one or two pages.",
      weight: 15,
    },
    {
      id: "contact",
      label: "Contact details present",
      passed: /[\w.+-]+@[\w-]+\.[\w.]+/.test(t) || /linkedin|github\.com\/|\+?\d[\d\s().-]{8,}\d/.test(t),
      tip: "Include an email, phone number, and a LinkedIn or GitHub link near the top.",
      weight: 10,
    },
    {
      id: "skills_section",
      label: "Dedicated skills section",
      passed: /technical skills|skills\s*[:|\n]|key skills|core competencies/.test(t),
      tip: "Add a clearly labeled 'Skills' section — scanners and recruiters look for it first.",
      weight: 15,
    },
    {
      id: "education",
      label: "Education mentioned",
      passed: /education|b\.?\s?tech|b\.?\s?sc|bachelor|master|m\.?\s?sc|degree|university|college|cgpa|gpa/.test(t),
      tip: "List your degree, institution, and graduation year.",
      weight: 10,
    },
    {
      id: "projects",
      label: "Projects or experience",
      passed: /project|internship|intern\b|work experience|freelance|research/.test(t),
      tip: "Add 2–3 projects or internships, each with a one-line impact statement.",
      weight: 15,
    },
    {
      id: "quantified",
      label: "Quantified achievements",
      passed: /\d+\s?%|\d+\s?\+|\b\d+k\b|\d+\s?x\b|\b\d{2,}\s?(users|rows|records|students|downloads|queries)/.test(t),
      tip: "Numbers stand out — for example '40k-row dataset' or 'improved accuracy by 12%'.",
      weight: 15,
    },
    {
      id: "verbs",
      label: "Strong action verbs",
      passed: verbHits >= 3,
      tip: "Start bullets with verbs like built, designed, implemented, or analyzed.",
      weight: 10,
    },
    {
      id: "keywords",
      label: "Skill keyword richness",
      passed: extractedSkillCount >= 6,
      tip: "Name concrete tools and technologies (python, sql, react…) rather than soft phrases.",
      weight: 10,
    },
  ];

  const total = weighted.reduce((a, c) => a + c.weight, 0);
  const earned = weighted.reduce((a, c) => a + (c.passed ? c.weight : 0), 0);
  return {
    score: Math.round((earned / total) * 100),
    checks: weighted.map(({ weight: _w, ...c }) => c),
  };
}
