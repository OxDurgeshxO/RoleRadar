// Certification recommendations based on extracted skills and target role
// Pure and client-safe

export interface CertificationRec {
  name: string;
  provider: string;
  relevantSkills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  description: string;
}

const CERTIFICATIONS: CertificationRec[] = [
  // Cloud
  {
    name: "AWS Cloud Practitioner",
    provider: "Amazon Web Services",
    relevantSkills: ["aws", "cloud deployment"],
    difficulty: "beginner",
    estimatedHours: 20,
    description: "Foundation-level certification covering AWS cloud concepts, services, and basic architecture.",
  },
  {
    name: "AWS Solutions Architect Associate",
    provider: "Amazon Web Services",
    relevantSkills: ["aws", "cloud deployment", "docker"],
    difficulty: "intermediate",
    estimatedHours: 80,
    description: "Design and deploy scalable systems on AWS with hands-on architecture experience.",
  },
  {
    name: "Azure Fundamentals (AZ-900)",
    provider: "Microsoft",
    relevantSkills: ["azure", "cloud deployment"],
    difficulty: "beginner",
    estimatedHours: 15,
    description: "Entry-level certification for Azure cloud concepts and services.",
  },
  {
    name: "Google Cloud Associate Cloud Engineer",
    provider: "Google Cloud",
    relevantSkills: ["gcp", "cloud deployment", "kubernetes"],
    difficulty: "intermediate",
    estimatedHours: 60,
    description: "Deploy applications, monitor operations, and manage enterprise solutions on GCP.",
  },

  // Data & ML
  {
    name: "Google Data Analytics Certificate",
    provider: "Google (via Coursera)",
    relevantSkills: ["data analysis", "sql", "excel", "data visualization"],
    difficulty: "beginner",
    estimatedHours: 180,
    description: "Comprehensive program covering data cleaning, analysis, and visualization with real-world projects.",
  },
  {
    name: "IBM Data Science Professional Certificate",
    provider: "IBM (via Coursera)",
    relevantSkills: ["python", "ml", "data analysis", "sql"],
    difficulty: "intermediate",
    estimatedHours: 200,
    description: "Full data science pipeline from data collection to model deployment.",
  },
  {
    name: "TensorFlow Developer Certificate",
    provider: "Google",
    relevantSkills: ["tensorflow", "deep learning", "ml", "python"],
    difficulty: "intermediate",
    estimatedHours: 100,
    description: "Demonstrate proficiency in building TensorFlow models for computer vision, NLP, and time series.",
  },
  {
    name: "AWS Machine Learning Specialty",
    provider: "Amazon Web Services",
    relevantSkills: ["ml", "aws", "python", "deep learning"],
    difficulty: "advanced",
    estimatedHours: 100,
    description: "Advanced certification for designing, implementing, and maintaining ML solutions on AWS.",
  },

  // DevOps
  {
    name: "Docker Certified Associate",
    provider: "Docker",
    relevantSkills: ["docker", "kubernetes", "linux"],
    difficulty: "intermediate",
    estimatedHours: 50,
    description: "Validate container orchestration skills with Docker and Swarm.",
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    provider: "CNCF",
    relevantSkills: ["kubernetes", "docker", "linux", "ci/cd"],
    difficulty: "advanced",
    estimatedHours: 80,
    description: "Hands-on certification for Kubernetes cluster administration.",
  },
  {
    name: "HashiCorp Terraform Associate",
    provider: "HashiCorp",
    relevantSkills: ["cloud deployment", "aws", "azure", "gcp", "ci/cd"],
    difficulty: "intermediate",
    estimatedHours: 40,
    description: "Infrastructure as Code skills with Terraform for multi-cloud environments.",
  },

  // Development
  {
    name: "Meta Front-End Developer Certificate",
    provider: "Meta (via Coursera)",
    relevantSkills: ["react", "javascript", "html", "css"],
    difficulty: "beginner",
    estimatedHours: 150,
    description: "Build responsive websites and prepare for entry-level front-end roles.",
  },
  {
    name: "MongoDB Developer Certification",
    provider: "MongoDB",
    relevantSkills: ["mongodb", "node.js", "python"],
    difficulty: "intermediate",
    estimatedHours: 40,
    description: "Demonstrate expertise in building applications with MongoDB.",
  },

  // Testing & QA
  {
    name: "ISTQB Foundation Level",
    provider: "ISTQB",
    relevantSkills: ["testing", "agile"],
    difficulty: "beginner",
    estimatedHours: 40,
    description: "Internationally recognized certification for software testing fundamentals.",
  },
];

export function recommendCertifications(
  extractedSkills: string[],
  missingSkills: string[],
  limit = 4,
): CertificationRec[] {
  const skillSet = new Set(extractedSkills.map((s) => s.toLowerCase()));
  const missingSet = new Set(missingSkills.map((s) => s.toLowerCase()));

  // Score certifications by relevance
  const scored = CERTIFICATIONS.map((cert) => {
    const relevantPresent = cert.relevantSkills.filter((s) => skillSet.has(s)).length;
    const relevantMissing = cert.relevantSkills.filter((s) => missingSet.has(s)).length;

    // Prioritize certs that build on existing skills AND fill gaps
    const score = relevantPresent * 2 + relevantMissing * 3;

    return { cert, score, relevantPresent, relevantMissing };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.cert.estimatedHours - b.cert.estimatedHours)
    .slice(0, limit)
    .map((s) => s.cert);
}
