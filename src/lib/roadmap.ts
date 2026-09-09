// Learning roadmap builder.
//
// The plan is driven by the target role's MISSING and PARTIAL skills, ordered so
// foundations come first. Default 4 weeks; extends up to 8 when many skills are
// missing; pads with a capstone + resume-refresh week when few gaps remain.

import { LEARN_PRIORITY, skillLabel } from "./skills";
import type { RoadmapWeek } from "./types";

interface LearnModule {
  focus: string; // 3-6 words
  details: string; // 1-3 sentences, concrete and beginner friendly
}

const MODULES: Record<string, LearnModule> = {
  python: {
    focus: "Python programming basics",
    details: "Work through an introductory Python tutorial covering variables, loops, functions, and lists. Finish by writing two or three small scripts, such as a simple file organizer or a number-guessing game.",
  },
  java: {
    focus: "Java fundamentals",
    details: "Follow an introductory Java course or the official tutorials, focusing on classes, collections, and exception handling. Build a small console app such as a student grade manager.",
  },
  javascript: {
    focus: "JavaScript essentials",
    details: "Learn modern JavaScript (variables, functions, arrays, DOM events) from an introductory tutorial. Build an interactive page like a to-do list that saves items in the browser.",
  },
  typescript: {
    focus: "TypeScript for JavaScript devs",
    details: "Take one of your existing JavaScript projects and convert it to TypeScript file by file. Practice typing props, function arguments, and API responses using the official handbook.",
  },
  html: {
    focus: "HTML page structure",
    details: "Learn semantic HTML tags and build a personal profile page with headers, lists, tables, and a contact form. Follow any free introductory web tutorial.",
  },
  css: {
    focus: "CSS layout and styling",
    details: "Practice modern CSS: flexbox, grid, spacing, and responsive breakpoints. Recreate a clean landing page design you like, purely for practice.",
  },
  react: {
    focus: "React component foundations",
    details: "Follow the official React tutorial, then build a small multi-component app such as a habit tracker. Focus on props, state, and fetching data from a public API.",
  },
  "next.js": {
    focus: "Full-stack React with Next.js",
    details: "Rebuild your React project using Next.js pages and data fetching. Read the official getting-started docs and deploy the result on a free hosting tier.",
  },
  tailwind: {
    focus: "Utility-first styling with Tailwind",
    details: "Rebuild one of your existing pages with Tailwind utility classes instead of plain CSS. Focus on spacing, responsive variants, and hover states.",
  },
  "node.js": {
    focus: "Node.js server fundamentals",
    details: "Learn how Node.js runs JavaScript on the server using the official intro guides. Write a small server that reads a JSON file and serves it over HTTP.",
  },
  express: {
    focus: "REST APIs with Express",
    details: "Build a small CRUD API with Express: routes for listing, creating, updating, and deleting items. Test every endpoint with a free API client tool.",
  },
  fastapi: {
    focus: "FastAPI REST API basics",
    details: "Follow the official FastAPI tutorial to build a small JSON API in Python. Then wrap one of your existing scripts or models as an endpoint that accepts a request and returns a result.",
  },
  flask: {
    focus: "Flask web API basics",
    details: "Use the official Flask quickstart to build a small app with two or three routes. Return JSON from one endpoint and render a simple template from another.",
  },
  django: {
    focus: "Django web framework basics",
    details: "Work through the official Django tutorial (the polls app). Then adapt it into a tiny app of your own, like a reading list with an admin page.",
  },
  "spring boot": {
    focus: "REST services with Spring Boot",
    details: "Follow an introductory Spring Boot guide to create a small REST controller with GET and POST endpoints. Connect it to an in-memory database.",
  },
  "rest api": {
    focus: "REST API design practice",
    details: "Learn REST conventions: resources, HTTP methods, and status codes. Design and document a tiny API for a library or expenses app, then implement it with any framework you know.",
  },
  graphql: {
    focus: "GraphQL query basics",
    details: "Read the official GraphQL introduction and build a small schema with two or three types. Query it from a simple front-end page or a playground tool.",
  },
  microservices: {
    focus: "Microservices concepts",
    details: "Read an introductory article on microservices versus monoliths. Refactor one feature of an existing app into a separate small service that talks to the main app over HTTP.",
  },
  firebase: {
    focus: "Backend basics with Firebase",
    details: "Follow the official Firebase getting-started guide. Add authentication and a small cloud database to one of your front-end projects, like saving user favorites.",
  },
  sql: {
    focus: "SQL querying practice",
    details: "Practice SELECT, JOIN, GROUP BY, and subqueries on a free sample database using any interactive SQL tutorial. Solve ten to fifteen exercises of increasing difficulty.",
  },
  mysql: {
    focus: "MySQL database practice",
    details: "Install MySQL (or use a free online sandbox), create a small schema for a shop, and practice CRUD queries and joins from the official tutorial.",
  },
  postgresql: {
    focus: "PostgreSQL database practice",
    details: "Set up PostgreSQL locally with the official tutorial, design a small schema, and practice joins, indexes, and basic transactions.",
  },
  mongodb: {
    focus: "NoSQL with MongoDB",
    details: "Use the official MongoDB getting-started guide to store and query JSON documents. Rebuild the data layer of a small project (like notes) on MongoDB.",
  },
  excel: {
    focus: "Spreadsheet data analysis",
    details: "Practice sorting, filtering, pivot tables, and lookup formulas on a public dataset. Build a one-page summary sheet with two or three charts.",
  },
  "power bi": {
    focus: "Dashboards in Power BI",
    details: "Download a free public dataset, load it into Power BI, and build an interactive dashboard with filters and three or four visuals. Follow Microsoft's free guided learning path.",
  },
  tableau: {
    focus: "Visual analytics with Tableau",
    details: "Use the free Tableau Public version to build a dashboard from a public dataset. Practice filters, calculated fields, and telling one clear story with your charts.",
  },
  pandas: {
    focus: "Data wrangling with pandas",
    details: "Work through the official pandas getting-started tutorials. Load a public CSV dataset, clean missing values, and answer five questions with groupby and filtering.",
  },
  numpy: {
    focus: "Numerical computing with NumPy",
    details: "Practice arrays, slicing, broadcasting, and basic statistics with NumPy's official tutorials. Reimplement three pandas operations you already know using raw NumPy.",
  },
  "data cleaning": {
    focus: "Data cleaning workflows",
    details: "Take a messy public dataset and practice handling missing values, duplicates, and inconsistent formats. Write a short, reusable cleaning function for each problem type.",
  },
  "data analysis": {
    focus: "Exploratory data analysis",
    details: "Pick a public dataset you find interesting and perform a full exploratory analysis: summary statistics, distributions, and relationships between columns. Write down three insights in plain English.",
  },
  "data visualization": {
    focus: "Data visualization storytelling",
    details: "Learn when to use bar, line, and scatter charts, then build a small notebook that tells one data story with three clear charts. Focus on labels, titles, and readable scales.",
  },
  matplotlib: {
    focus: "Charting with matplotlib",
    details: "Follow the official matplotlib tutorials and reproduce four chart types from a public dataset. Add proper titles, axis labels, and legends to each.",
  },
  statistics: {
    focus: "Applied statistics for data work",
    details: "Review descriptive statistics, distributions, correlation, and basic hypothesis testing with a free introductory course. Apply each concept once to a real public dataset.",
  },
  ml: {
    focus: "Core machine learning concepts",
    details: "Learn the train/test split, overfitting, and common algorithms (regression, decision trees) through a free introductory ML course. Train your first classifier on a small public dataset.",
  },
  "scikit-learn": {
    focus: "Classical ML with scikit-learn",
    details: "Work through the official scikit-learn getting-started guide. Train, evaluate, and compare two or three models on a public tabular dataset and record their accuracy scores.",
  },
  "deep learning": {
    focus: "Neural network fundamentals",
    details: "Learn how layers, activations, and gradient descent fit together using a free introductory deep-learning course. Train a tiny network on a classic image or tabular dataset.",
  },
  nlp: {
    focus: "NLP fundamentals",
    details: "Practice tokenization, stop-word removal, and word embeddings with an open-source NLP library. Build a small text classifier, such as sentiment analysis on public reviews.",
  },
  transformers: {
    focus: "Transformer models in practice",
    details: "Use an open-source model hub to run and fine-tune a small pre-trained transformer on a public text dataset. Compare its results with a simpler baseline model.",
  },
  "computer vision": {
    focus: "Computer vision basics",
    details: "Learn image loading, filters, and a small pre-trained classifier with an open-source vision library. Build a mini project such as classifying photos from a public dataset.",
  },
  tensorflow: {
    focus: "Deep learning with TensorFlow",
    details: "Follow the official TensorFlow beginner quickstart. Train and evaluate a small model on a classic dataset, then save and reload it.",
  },
  pytorch: {
    focus: "Deep learning with PyTorch",
    details: "Work through the official PyTorch 'learn the basics' tutorials. Train a small classifier on a classic dataset and log the loss curve as it learns.",
  },
  keras: {
    focus: "Neural networks with Keras",
    details: "Use the official Keras guides to build, train, and evaluate a small sequential model. Experiment with changing layer sizes and watch how accuracy changes.",
  },
  mlflow: {
    focus: "MLflow experiment tracking",
    details: "Install MLflow and log parameters, metrics, and models for a small machine-learning experiment. Compare runs in the MLflow UI and register your best model.",
  },
  etl: {
    focus: "Building ETL data pipelines",
    details: "Write a small extract-transform-load script in Python: pull data from a public API or CSV, clean it, and store it in a database table. Keep steps in separate functions.",
  },
  spark: {
    focus: "Distributed data with Spark",
    details: "Follow the official Spark quickstart (PySpark works well) to load a dataset, run transformations, and aggregate results. Compare a Spark job with the same task in pandas.",
  },
  airflow: {
    focus: "Workflow orchestration with Airflow",
    details: "Install Airflow locally using the official quickstart and write a small daily DAG with two or three tasks. Schedule your ETL script from the previous week inside it.",
  },
  hadoop: {
    focus: "Big data storage concepts",
    details: "Read an introduction to HDFS and the Hadoop ecosystem. If you can, run a small word-count example in a local sandbox or Docker-based demo environment.",
  },
  git: {
    focus: "Version control with Git",
    details: "Learn clone, commit, branch, merge, and pull requests through the official Git guides. Move one of your existing projects into a repository with a clean README.",
  },
  linux: {
    focus: "Linux command-line skills",
    details: "Practice navigating directories, file permissions, and pipes in any free Linux sandbox or WSL. Write a small shell script that automates a boring task.",
  },
  docker: {
    focus: "Docker container fundamentals",
    details: "Work through the official Docker getting-started guide. Write a Dockerfile for one of your apps or APIs, build the image, and run it locally until it works end to end.",
  },
  kubernetes: {
    focus: "Kubernetes core concepts",
    details: "Learn pods, deployments, and services from the official Kubernetes tutorials. Deploy your own Docker container to a local cluster such as Minikube or kind.",
  },
  "ci/cd": {
    focus: "CI/CD pipeline setup",
    details: "Add a simple continuous-integration workflow (for example with a Git-based automation service) that installs dependencies and runs your tests on every push.",
  },
  aws: {
    focus: "Cloud fundamentals on AWS",
    details: "Create a free-tier AWS account and explore core compute and storage services by deploying one small app. Practice reading logs and shutting resources down safely.",
  },
  azure: {
    focus: "Cloud fundamentals on Azure",
    details: "Create a free Azure account and deploy a small web app using the beginner quickstart. Explore the portal, resource groups, and basic monitoring.",
  },
  gcp: {
    focus: "Cloud fundamentals on Google Cloud",
    details: "Use the free tier to deploy one small app on Google Cloud following an official quickstart. Practice projects, billing alerts, and viewing logs.",
  },
  "cloud deployment": {
    focus: "Cloud deployment basics",
    details: "Deploy a small app or API on a free tier of any major cloud or hosting platform. Practice environment variables, logs, and adding a simple health-check endpoint.",
  },
  testing: {
    focus: "Automated testing basics",
    details: "Learn the arrange-act-assert pattern and write unit tests for an existing project using its standard test framework. Aim for five to ten meaningful test cases.",
  },
  agile: {
    focus: "Agile ways of working",
    details: "Read an introduction to agile, scrum roles, and sprint planning. Practice by writing user stories with acceptance criteria for one of your own projects.",
  },
  ".net": {
    focus: ".NET web API basics",
    details: "Follow the official .NET tutorial to build a minimal web API with C#. Create GET and POST endpoints and test them with a free API client.",
  },
  "c++": {
    focus: "C++ programming practice",
    details: "Review pointers, references, and the standard library with a free C++ course. Solve five to ten small algorithm problems to build fluency.",
  },
  "c#": {
    focus: "C# language fundamentals",
    details: "Work through the official C# beginner path covering classes, LINQ, and async basics. Build a small console app such as an expense tracker.",
  },
  go: {
    focus: "Go programming basics",
    details: "Take the official Go tour, then write a small CLI tool or HTTP server. Practice structs, interfaces, and error handling along the way.",
  },
  r: {
    focus: "Data analysis with R",
    details: "Learn data frames and tidyverse basics with a free introductory R course. Reproduce one analysis you have done before in another tool.",
  },
  php: {
    focus: "PHP web basics",
    details: "Follow an introductory PHP tutorial and build a small form-handling page. Practice sessions and connecting to a database.",
  },
  "data structures": {
    focus: "Data structures and algorithms",
    details: "Review arrays, hash maps, stacks, queues, and trees with a free DSA course. Solve two to three beginner problems a day on any practice platform.",
  },
  oop: {
    focus: "Object-oriented design",
    details: "Review classes, inheritance, and encapsulation in your main language. Refactor one of your scripts into small, well-named classes.",
  },
};

const FALLBACK_MODULE = (label: string): LearnModule => ({
  focus: `Learn ${label} fundamentals`,
  details: `Work through the official documentation and an introductory tutorial for ${label}, then apply it in a small project you can show on your resume.`,
});

function moduleFor(skillId: string): LearnModule {
  return MODULES[skillId] ?? FALLBACK_MODULE(skillLabel(skillId));
}

export function orderGapsByPriority(missing: string[], partial: string[]): string[] {
  const all = [...new Set([...missing, ...partial])];
  return all.sort(
    (a, b) =>
      (LEARN_PRIORITY[a] ?? 50) - (LEARN_PRIORITY[b] ?? 50) || skillLabel(a).localeCompare(skillLabel(b)),
  );
}

/**
 * Build a week-by-week learning plan for a role from its gap skills.
 * - <= 4 gaps  -> 4 weeks (gaps first, then capstone + resume refresh)
 * - 5-8 gaps   -> one skill per week
 * - > 8 gaps   -> first 8 weeks (keeps the plan approachable)
 */
export function buildRoadmap(roleName: string, missing: string[], partial: string[]): RoadmapWeek[] {
  const gaps = orderGapsByPriority(missing, partial);
  const partialSet = new Set(partial);
  const weekCount = gaps.length <= 4 ? 4 : Math.min(gaps.length, 8);

  /** Unique closing weeks, so short-gap plans never repeat themselves. */
  const capstone: LearnModule = {
    focus: "Capstone portfolio project",
    details: `Combine what you learned into one small end-to-end project for the ${roleName} role — for example a deployed mini-app or a complete data workflow — and publish it with a clear README.`,
  };
  const closers: LearnModule[] =
    gaps.length > 0
      ? [
          capstone,
          {
            focus: "Resume and keyword refresh",
            details:
              "Add your new skills and project to your resume using clear, standard keywords so they are easy to match. Ask a mentor or teacher to review it once.",
          },
          {
            focus: "Explain your projects clearly",
            details:
              "Practice describing each of your projects in two or three sentences — the problem, your approach, and the result. Do a mock Q&A with a friend or mentor.",
          },
        ]
      : [
          {
            focus: "Deepen your strongest skill",
            details:
              "Your coverage already looks strong. Pick the required skill you know best and go one level deeper with an intermediate guide or the official advanced documentation.",
          },
          capstone,
          {
            focus: "Resume and keyword refresh",
            details:
              "Polish your resume with clear, standard keywords and a standout project section. Ask a mentor, teacher, or recruiter to review it once.",
          },
          {
            focus: "Explain your projects clearly",
            details:
              "Practice describing each of your projects in two or three sentences — the problem, your approach, and the result. Do a mock Q&A with a friend or mentor.",
          },
        ];

  const weeks: RoadmapWeek[] = [];
  let gi = 0;
  let ci = 0;
  for (let w = 1; w <= weekCount; w++) {
    if (gi < gaps.length) {
      const id = gaps[gi++];
      const mod = moduleFor(id);
      const note = partialSet.has(id)
        ? " You already have related foundations, so focus on closing the specific gap rather than starting from zero."
        : "";
      weeks.push({ week: w, focus: mod.focus, details: mod.details + note });
    } else {
      const mod = closers[Math.min(ci++, closers.length - 1)];
      weeks.push({ week: w, focus: mod.focus, details: mod.details });
    }
  }
  return weeks;
}
