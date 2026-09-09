// Ready-made sample resumes so students can try the analyzer instantly.

export interface SampleResume {
  id: string;
  title: string;
  tagline: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: "data",
    title: "Aspiring Data Analyst",
    tagline: "Python, SQL, Excel, dashboards",
    text: `EDUCATION
B.Sc. in Statistics, 2022 - 2025. Relevant coursework: statistics, probability, database systems, and spreadsheet modeling.

SKILLS
Python, SQL, MySQL, Excel (pivot tables, vlookup), pandas, numpy, matplotlib, data visualization, basic statistics, Git and GitHub.

PROJECTS
Sales Insights Dashboard — Cleaned a 40k-row retail dataset in Python with pandas and built charts in matplotlib to find top products and seasons.
Excel Budget Tracker — Built a personal finance workbook with pivot tables and automated monthly summaries.
SQL Library Analysis — Wrote join and group by queries on a library database to study borrowing trends.

INTERNSHIP
Data intern (3 months) — Helped the reporting team with data cleaning in Excel, wrote SQL queries for weekly reports, and presented findings with simple dashboards.`,
  },
  {
    id: "web",
    title: "Frontend / Web Developer",
    tagline: "React, JavaScript, UI projects",
    text: `EDUCATION
B.Tech in Computer Science, 2023 - 2027. Coursework: data structures and algorithms, oop, web technologies, and software engineering.

SKILLS
HTML, CSS, JavaScript, React, Tailwind CSS, Git & GitHub, responsive design, consuming REST APIs, basics of Node.js and Express, Firebase for small backends.

PROJECTS
Study Planner App — React + Tailwind app to plan study sessions with drag-and-drop lists and local storage persistence.
Weather Now — Responsive weather dashboard fetching a public REST API with loading and error states.
Portfolio Website — Personal site with animated sections, deployed on Vercel.

EXPERIENCE
Web development volunteer — Built a landing page for a college fest with HTML, CSS and JavaScript; collaborated with designers and shipped on a deadline.`,
  },
  {
    id: "ml",
    title: "Aspiring ML Engineer",
    tagline: "scikit-learn, NLP, notebooks",
    text: `EDUCATION
B.Sc. in Computer Science, 2021 - 2025. Coursework: machine learning, statistics, linear algebra, data structures, and databases.

SKILLS
Python, pandas, numpy, scikit-learn, machine learning, SQL, NLP (nltk, sentiment analysis), data cleaning, matplotlib, Git.

PROJECTS
Movie Recommendation System — Built a content-based recommender with scikit-learn on a public movie dataset; evaluated with precision at k.
Sentiment Analysis of Reviews — Trained a text classification model on 50k product reviews using nlp preprocessing and logistic regression.
House Price Prediction — Performed data cleaning, feature engineering and regression analysis; compared three scikit-learn models.

EXPERIENCE
ML study group lead — Organized weekly paper-reading sessions and built demo notebooks explaining machine learning concepts to juniors.`,
  },
];
