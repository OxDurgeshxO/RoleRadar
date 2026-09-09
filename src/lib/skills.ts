// Skill dictionary: canonical skills, the literal patterns used to detect them in
// cleaned resume text, and the "partial signal" relations between skills.
//
// A required skill is:
//  - PRESENT  when one of its own patterns is found in the resume
//  - PARTIAL  when a closely related skill (listed in PARTIAL_SIGNALS) is present
//  - MISSING  otherwise

export interface SkillDef {
  id: string; // canonical id used inside the engine
  label: string; // human-readable label shown in the UI / JSON report
  category: string;
  patterns: string[]; // lowercased literal tokens, matched with symbol-aware boundaries
}

export const SKILL_DEFS: SkillDef[] = [
  // --- Programming languages & core ---
  { id: "python", label: "python", category: "Languages", patterns: ["python"] },
  { id: "java", label: "java", category: "Languages", patterns: ["java"] },
  { id: "javascript", label: "javascript", category: "Languages", patterns: ["javascript", "js", "ecmascript"] },
  { id: "typescript", label: "typescript", category: "Languages", patterns: ["typescript"] },
  { id: "c++", label: "c++", category: "Languages", patterns: ["c++", "cpp"] },
  { id: "c#", label: "c#", category: "Languages", patterns: ["c#", "csharp", "c sharp"] },
  { id: ".net", label: ".net", category: "Languages", patterns: [".net", "dotnet", "asp.net"] },
  { id: "go", label: "go", category: "Languages", patterns: ["golang", "go lang"] },
  { id: "php", label: "php", category: "Languages", patterns: ["php", "laravel"] },
  { id: "r", label: "r", category: "Languages", patterns: ["r programming", "r language", "tidyverse", "ggplot2", "rstudio"] },
  { id: "data structures", label: "data structures & algorithms", category: "Core CS", patterns: ["data structures", "algorithms", "dsa"] },
  { id: "oop", label: "oop", category: "Core CS", patterns: ["oop", "object oriented", "object-oriented"] },

  // --- Web ---
  { id: "html", label: "html", category: "Web", patterns: ["html", "html5"] },
  { id: "css", label: "css", category: "Web", patterns: ["css", "css3"] },
  { id: "react", label: "react", category: "Web", patterns: ["react", "react.js", "reactjs", "react js"] },
  { id: "next.js", label: "next.js", category: "Web", patterns: ["next.js", "nextjs", "next js"] },
  { id: "tailwind", label: "tailwind css", category: "Web", patterns: ["tailwind", "tailwindcss", "tailwind css"] },
  { id: "redux", label: "redux", category: "Web", patterns: ["redux"] },
  { id: "node.js", label: "node.js", category: "Backend", patterns: ["node.js", "nodejs", "node js", "node"] },
  { id: "express", label: "express", category: "Backend", patterns: ["express", "express.js", "expressjs"] },
  { id: "fastapi", label: "fastapi", category: "Backend", patterns: ["fastapi", "fast api"] },
  { id: "flask", label: "flask", category: "Backend", patterns: ["flask"] },
  { id: "django", label: "django", category: "Backend", patterns: ["django"] },
  { id: "spring boot", label: "spring boot", category: "Backend", patterns: ["spring boot", "springboot", "spring framework"] },
  { id: "rest api", label: "rest api", category: "Backend", patterns: ["rest api", "rest apis", "restful", "restful api", "restful apis"] },
  { id: "graphql", label: "graphql", category: "Backend", patterns: ["graphql"] },
  { id: "microservices", label: "microservices", category: "Backend", patterns: ["microservices", "micro services", "micro-service"] },
  { id: "firebase", label: "firebase", category: "Backend", patterns: ["firebase", "firestore"] },

  // --- Databases ---
  { id: "sql", label: "sql", category: "Data", patterns: ["sql", "mysql", "postgresql", "postgres", "sqlite", "sql server", "mssql", "pl/sql", "t-sql"] },
  { id: "mysql", label: "mysql", category: "Data", patterns: ["mysql"] },
  { id: "postgresql", label: "postgresql", category: "Data", patterns: ["postgresql", "postgres"] },
  { id: "mongodb", label: "mongodb", category: "Data", patterns: ["mongodb", "mongo db", "mongoose"] },

  // --- Data analysis & BI ---
  { id: "excel", label: "excel", category: "Data", patterns: ["excel", "ms excel", "microsoft excel", "spreadsheets", "google sheets", "vlookup", "pivot table", "pivot tables"] },
  { id: "power bi", label: "power bi", category: "Data", patterns: ["power bi", "powerbi"] },
  { id: "tableau", label: "tableau", category: "Data", patterns: ["tableau"] },
  { id: "pandas", label: "pandas", category: "Data", patterns: ["pandas"] },
  { id: "numpy", label: "numpy", category: "Data", patterns: ["numpy"] },
  { id: "matplotlib", label: "matplotlib", category: "Data", patterns: ["matplotlib", "seaborn", "plotly"] },
  { id: "data analysis", label: "data analysis", category: "Data", patterns: ["data analysis", "data analytics", "analyzing data", "analysing data", "exploratory data analysis", "eda"] },
  { id: "data cleaning", label: "data cleaning", category: "Data", patterns: ["data cleaning", "data wrangling", "data preprocessing", "data pre-processing", "data preparation"] },
  { id: "data visualization", label: "data visualization", category: "Data", patterns: ["data visualization", "data visualisation", "matplotlib", "seaborn", "plotly", "dashboards", "dashboard"] },
  { id: "statistics", label: "statistics", category: "Data", patterns: ["statistics", "statistical analysis", "statistical modeling", "probability", "hypothesis testing", "a/b testing", "regression analysis"] },

  // --- Machine learning & AI ---
  { id: "ml", label: "machine learning", category: "AI/ML", patterns: ["machine learning"] },
  { id: "deep learning", label: "deep learning", category: "AI/ML", patterns: ["deep learning", "neural network", "neural networks", "cnn", "rnn", "lstm"] },
  { id: "scikit-learn", label: "scikit-learn", category: "AI/ML", patterns: ["scikit-learn", "scikit learn", "sklearn"] },
  { id: "tensorflow", label: "tensorflow", category: "AI/ML", patterns: ["tensorflow"] },
  { id: "keras", label: "keras", category: "AI/ML", patterns: ["keras"] },
  { id: "pytorch", label: "pytorch", category: "AI/ML", patterns: ["pytorch", "torch"] },
  { id: "nlp", label: "nlp", category: "AI/ML", patterns: ["nlp", "natural language processing", "text mining", "sentiment analysis", "spacy", "nltk"] },
  { id: "computer vision", label: "computer vision", category: "AI/ML", patterns: ["computer vision", "opencv", "image classification", "object detection", "yolo"] },
  { id: "transformers", label: "transformers", category: "AI/ML", patterns: ["transformers", "transformer", "hugging face", "huggingface", "bert", "gpt", "llm", "llms", "large language model", "large language models", "fine-tuning", "fine tuning"] },
  { id: "mlflow", label: "mlflow", category: "AI/ML", patterns: ["mlflow"] },

  // --- Data engineering ---
  { id: "etl", label: "etl", category: "Data Eng", patterns: ["etl", "data pipeline", "data pipelines"] },
  { id: "spark", label: "apache spark", category: "Data Eng", patterns: ["spark", "pyspark", "apache spark"] },
  { id: "airflow", label: "airflow", category: "Data Eng", patterns: ["airflow", "apache airflow"] },
  { id: "hadoop", label: "hadoop", category: "Data Eng", patterns: ["hadoop", "hdfs", "hive"] },

  // --- DevOps & cloud ---
  { id: "git", label: "git & github", category: "DevOps", patterns: ["git", "github", "gitlab", "bitbucket", "version control"] },
  { id: "linux", label: "linux", category: "DevOps", patterns: ["linux", "ubuntu", "unix", "bash", "shell scripting"] },
  { id: "docker", label: "docker", category: "DevOps", patterns: ["docker", "dockerfile", "containerized", "containerized application"] },
  { id: "kubernetes", label: "kubernetes", category: "DevOps", patterns: ["kubernetes", "k8s"] },
  { id: "ci/cd", label: "ci/cd", category: "DevOps", patterns: ["ci/cd", "ci cd", "cicd", "continuous integration", "continuous deployment", "github actions", "jenkins", "gitlab ci", "azure devops"] },
  { id: "aws", label: "aws", category: "DevOps", patterns: ["aws", "amazon web services", "ec2", "s3", "lambda", "sagemaker"] },
  { id: "azure", label: "azure", category: "DevOps", patterns: ["azure", "microsoft azure"] },
  { id: "gcp", label: "google cloud", category: "DevOps", patterns: ["gcp", "google cloud", "google cloud platform"] },
  { id: "cloud deployment", label: "cloud deployment", category: "DevOps", patterns: ["cloud deployment", "model deployment", "heroku", "vercel", "netlify", "render", "railway", "cloud run", "app engine", "elastic beanstalk", "deployed to", "deployed on", "deployment"] },

  // --- Quality & ways of working ---
  { id: "testing", label: "testing & qa", category: "Quality", patterns: ["unit testing", "integration testing", "test automation", "automation testing", "pytest", "jest", "junit", "selenium", "cypress", "playwright", "qa", "quality assurance", "test cases"] },
  { id: "agile", label: "agile & scrum", category: "Quality", patterns: ["agile", "scrum", "kanban", "jira", "sprint planning", "stakeholder"] },
];

export const SKILL_DEF_MAP: Record<string, SkillDef> = Object.fromEntries(
  SKILL_DEFS.map((d) => [d.id, d]),
);

export function skillLabel(id: string): string {
  return SKILL_DEF_MAP[id]?.label ?? id;
}

/**
 * If the key skill is required but not directly present, the presence of any of
 * the listed skills turns it into a PARTIAL match (half credit) — related but
 * incomplete evidence.
 */
export const PARTIAL_SIGNALS: Record<string, string[]> = {
  typescript: ["javascript"],
  react: ["javascript"],
  "next.js": ["react", "javascript"],
  "node.js": ["javascript"],
  express: ["node.js", "rest api"],
  fastapi: ["flask", "django", "rest api", "python"],
  flask: ["django", "fastapi", "rest api", "python"],
  django: ["flask", "fastapi", "python"],
  "spring boot": ["java"],
  graphql: ["rest api"],
  "rest api": ["express", "fastapi", "flask", "django", "spring boot", "graphql"],
  microservices: ["rest api", "docker"],
  pandas: ["numpy", "python", "excel", "sql"],
  numpy: ["pandas", "python"],
  "power bi": ["tableau", "excel", "data visualization"],
  tableau: ["power bi", "excel", "data visualization"],
  "data visualization": ["matplotlib", "power bi", "tableau", "excel"],
  "data analysis": ["pandas", "excel", "sql", "statistics", "data cleaning"],
  "data cleaning": ["pandas", "excel", "python"],
  statistics: ["data analysis", "excel"],
  excel: ["data analysis"],
  ml: ["scikit-learn", "deep learning", "nlp", "computer vision", "statistics", "data analysis"],
  "scikit-learn": ["ml", "python"],
  "deep learning": ["ml"],
  nlp: ["ml", "deep learning"],
  transformers: ["nlp", "deep learning", "ml"],
  "computer vision": ["ml", "deep learning"],
  tensorflow: ["deep learning", "keras", "pytorch"],
  pytorch: ["deep learning", "tensorflow", "keras"],
  keras: ["deep learning", "tensorflow"],
  mlflow: ["docker"],
  etl: ["sql", "pandas", "data cleaning"],
  spark: ["sql", "etl"],
  airflow: ["etl", "python"],
  hadoop: ["spark"],
  docker: ["kubernetes", "linux", "git"],
  kubernetes: ["docker"],
  "ci/cd": ["git", "docker"],
  aws: ["azure", "gcp"],
  azure: ["aws", "gcp"],
  gcp: ["aws", "azure"],
  "cloud deployment": ["aws", "azure", "gcp", "docker", "ci/cd", "firebase"],
  mongodb: ["sql"],
  mysql: ["sql"],
  postgresql: ["sql"],
  linux: ["git"],
  "nextjs-placeholder-never": [],
};

/** Deterministic learning priority — lower numbers are learned first. */
export const LEARN_PRIORITY: Record<string, number> = {
  "data structures": 1,
  oop: 2,
  python: 2,
  java: 2,
  javascript: 3,
  html: 3,
  css: 4,
  git: 4,
  linux: 5,
  "c++": 2,
  "c#": 2,
  typescript: 5,
  sql: 6,
  excel: 6,
  mysql: 7,
  postgresql: 7,
  mongodb: 8,
  statistics: 9,
  "data analysis": 9,
  pandas: 10,
  numpy: 10,
  "data cleaning": 10,
  "data visualization": 11,
  matplotlib: 11,
  "power bi": 12,
  tableau: 12,
  "rest api": 13,
  "node.js": 13,
  express: 14,
  fastapi: 14,
  flask: 14,
  django: 14,
  react: 15,
  "next.js": 16,
  tailwind: 16,
  testing: 17,
  ".net": 17,
  "spring boot": 17,
  graphql: 18,
  firebase: 18,
  microservices: 19,
  ml: 20,
  "scikit-learn": 21,
  etl: 22,
  spark: 23,
  airflow: 24,
  hadoop: 25,
  "deep learning": 30,
  nlp: 31,
  "computer vision": 31,
  transformers: 32,
  tensorflow: 33,
  pytorch: 33,
  keras: 33,
  docker: 40,
  "ci/cd": 41,
  kubernetes: 42,
  aws: 43,
  azure: 43,
  gcp: 43,
  "cloud deployment": 44,
  mlflow: 45,
  agile: 46,
};
