// The manually verified target-role catalog used by the matching engine.
// `required` lists canonical skill ids from src/lib/skills.ts.

import type { RoleInput } from "@/lib/types";

export const ROLE_SEEDS: RoleInput[] = [
  {
    name: "AI / LLM Application Engineer",
    description: "Architect generative AI solutions, RAG pipelines, and agentic workflows using modern LLM APIs and vector stores.",
    required: ["python", "transformers", "langchain", "rag", "vector db", "prompt engineering", "fastapi"],
    accent: "#a78bfa",
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
    name: "Cloud Solutions Architect",
    description: "Architect resilient, secure, and scalable multi-cloud infrastructure and microservice topologies.",
    required: ["aws", "terraform", "kubernetes", "docker", "microservices", "system design", "ci/cd"],
    accent: "#38bdf8",
  },
  {
    name: "Full Stack Developer",
    description: "Ship end-to-end features across the interface, API, and database layers of a product.",
    required: ["javascript", "react", "node.js", "rest api", "sql", "git", "docker"],
    accent: "#b2f7ef",
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
    name: "DevOps Engineer",
    description: "Automate builds, deployments, and infrastructure so teams ship reliably and often.",
    required: ["linux", "git", "docker", "kubernetes", "ci/cd", "aws", "cloud deployment"],
    accent: "#ffd166",
  },
  {
    name: "Data Engineer",
    description: "Design pipelines and infrastructure that move, transform, and store data at scale.",
    required: ["python", "sql", "etl", "spark", "airflow", "docker", "cloud deployment"],
    accent: "#ffb454",
  },
  {
    name: "Cybersecurity Analyst",
    description: "Guard infrastructure and applications against threat actors with proactive audits, SIEM, and vulnerability triage.",
    required: ["cybersecurity", "linux", "penetration testing", "siem", "owasp", "git"],
    accent: "#f43f5e",
  },
  {
    name: "Mobile App Developer",
    description: "Craft fluid, cross-platform mobile experiences for iOS and Android with modern frameworks.",
    required: ["javascript", "typescript", "react native", "rest api", "git"],
    accent: "#34d399",
  },
  {
    name: "Technical Product Manager",
    description: "Translate business vision into clear technical roadmaps, PRDs, and high-impact engineering sprints.",
    required: ["product management", "agile", "sql", "data analysis", "rest api", "system design"],
    accent: "#fb923c",
  },
  {
    name: "Data Analyst",
    description: "Turn raw data into insights, reports, and dashboards that guide business decisions.",
    required: ["python", "sql", "excel", "pandas", "power bi", "statistics", "data visualization"],
    accent: "#63e6be",
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
