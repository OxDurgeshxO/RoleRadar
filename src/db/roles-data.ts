// The manually verified target-role catalog used by the matching engine.
// `required` lists canonical skill ids from src/lib/skills.ts.

import type { RoleInput } from "@/lib/types";

export const ROLE_SEEDS: RoleInput[] = [
  {
    name: "Data Analyst",
    description: "Turn raw data into insights, reports, and dashboards that guide business decisions.",
    required: ["python", "sql", "excel", "pandas", "power bi", "statistics", "data visualization"],
    accent: "#63e6be",
  },
  {
    name: "Machine Learning Engineer",
    description: "Build, deploy, and maintain machine learning models as reliable production services.",
    required: ["python", "ml", "scikit-learn", "fastapi", "docker", "mlflow", "cloud deployment"],
    accent: "#c8f542",
  },
  {
    name: "Data Scientist",
    description: "Explore data, model uncertainty, and communicate findings that shape product strategy.",
    required: ["python", "sql", "statistics", "ml", "scikit-learn", "pandas", "data visualization", "deep learning"],
    accent: "#8b7cff",
  },
  {
    name: "Data Engineer",
    description: "Design pipelines and infrastructure that move, transform, and store data at scale.",
    required: ["python", "sql", "etl", "spark", "airflow", "docker", "cloud deployment"],
    accent: "#ffb454",
  },
  {
    name: "Frontend Developer",
    description: "Craft fast, accessible, and expressive user interfaces for the web.",
    required: ["html", "css", "javascript", "react", "typescript", "git"],
    accent: "#6ee7ff",
  },
  {
    name: "Backend Developer",
    description: "Design APIs, business logic, and data layers that power applications behind the scenes.",
    required: ["javascript", "node.js", "express", "rest api", "sql", "mongodb", "docker"],
    accent: "#ff8fab",
  },
  {
    name: "Full Stack Developer",
    description: "Ship end-to-end features across the interface, API, and database layers of a product.",
    required: ["javascript", "react", "node.js", "rest api", "sql", "git", "docker"],
    accent: "#b2f7ef",
  },
  {
    name: "DevOps Engineer",
    description: "Automate builds, deployments, and infrastructure so teams ship reliably and often.",
    required: ["linux", "git", "docker", "kubernetes", "ci/cd", "aws", "cloud deployment"],
    accent: "#ffd166",
  },
  {
    name: "Business Analyst",
    description: "Bridge business questions and data, translating needs into reports and requirements.",
    required: ["excel", "sql", "power bi", "statistics", "data visualization", "agile"],
    accent: "#9bf6ff",
  },
  {
    name: "NLP Engineer",
    description: "Build systems that understand and generate human language using modern ML techniques.",
    required: ["python", "ml", "nlp", "transformers", "pytorch", "docker"],
    accent: "#bdb2ff",
  },
  {
    name: "QA / Test Engineer",
    description: "Protect product quality with test plans, automation, and sharp attention to edge cases.",
    required: ["testing", "python", "sql", "git", "ci/cd", "rest api"],
    accent: "#ffc6ff",
  },
];
