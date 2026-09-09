# 🎯 RoleFit — AI Resume Analyzer & Career Intelligence Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> An enterprise AI-powered career intelligence and resume optimization platform that evaluates candidate resumes against 16 industry job roles, performs 8-point ATS compatibility audits, scores resumes against custom job descriptions, optimizes bullets with the Google XYZ formula, and generates week-by-week learning roadmaps.

---

## 🌟 Key Features

* 📄 **Multi-Format Resume Parser:** Robust parsing of `.pdf`, `.docx`, `.txt`, and `.md` files with automated Unicode sanitization and layout analysis.
* 🎯 **16 Curated 2026 Tech Roles:** Benchmarked against the latest industry requirements:
  * **AI & Machine Learning:** AI / LLM Application Engineer, ML Engineer, Data Scientist, NLP Engineer.
  * **Cloud & Infrastructure:** Cloud Solutions Architect, DevOps Engineer, Data Engineer.
  * **Software Engineering:** Full Stack Developer, Frontend Developer, Backend Developer, Mobile App Developer, QA / Test Engineer.
  * **Product & Security:** Cybersecurity Analyst, Technical Product Manager, Data Analyst, Business Analyst.
* 📋 **Custom Job Description (JD) Matching:** Paste any real-world job posting from LinkedIn or Indeed; the engine extracts required skills on the fly and scores your resume directly against that exact posting.
* ✨ **Google XYZ Bullet Point Optimizer:** Interactive tool transforming weak resume bullets into high-impact, metrics-driven statements: *Accomplished [X] as measured by [Y] by doing [Z]*.
* 🛡️ **Zero-Crash Dual-Mode Architecture:** Seamlessly persists to PostgreSQL via Drizzle ORM when connected, and automatically falls back to an in-memory session store when offline.
* 📝 **Multi-Format Export:** 1-click export to Markdown (for Notion/Obsidian/Email) or raw JSON, plus print-ready stylesheets.
* ✅ **8-Point ATS Readiness Audit:** Structural checks for section hierarchy, contact info, measurable impact metrics, skill density, and parsing integrity.
* 🧪 **What-If Skill Simulator:** Interactive simulation showing real-time score boosts if you master specific gap technologies.
* 🗺️ **Personalized Learning Roadmaps:** Week-by-week structured curriculum with recommended real-world capstone projects and interactive re-targeting.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router with Turbopack) |
| **Language** | TypeScript 5.9 (Strict Mode) |
| **Frontend UI** | React 19.2, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Database & ORM** | PostgreSQL (Neon serverless ready), Drizzle ORM |
| **Resilience Layer** | In-Memory Fallback Store (Zero-database operational mode) |
| **File Parsing** | `pdf-parse` (with CJS/ESM interop), `mammoth` (DOCX extraction) |
| **Hosting & Deploy** | Vercel / Netlify (`@netlify/plugin-nextjs`) |

---

## 📁 Project Architecture

```text
ROLEFIT2/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page & hero
│   │   ├── layout.tsx                  # Global shell & navigation
│   │   ├── analyze/                    # Resume upload & custom JD matcher
│   │   ├── compare/                    # Version-to-version resume diffing
│   │   ├── history/                    # Historical analysis timeline
│   │   ├── results/[id]/               # Comprehensive match reports
│   │   ├── roles/                      # Curated 16-role catalog & search
│   │   └── api/
│   │       ├── analyze/                # AI analysis & JD matching endpoint
│   │       ├── analyses/               # List & retrieve past analyses
│   │       ├── parse-resume/           # PDF/DOCX file text extractor
│   │       ├── roles/                  # Role catalog definitions API
│   │       └── health/                 # Healthcheck & engine diagnostics
│   │
│   ├── components/                     # UI components
│   │   ├── analyzer.tsx                # Resume & JD input controller
│   │   ├── bullet-optimizer.tsx        # Google XYZ formula optimizer
│   │   ├── roles-explorer.tsx          # Live searchable role catalog
│   │   ├── results-view.tsx            # Full report & Markdown export
│   │   └── dashboard-widgets.tsx       # ATS cards, radars, simulators
│   │
│   ├── db/
│   │   ├── schema.ts                   # Drizzle relational schema
│   │   ├── roles-data.ts               # 16 Curated role benchmark definitions
│   │   ├── seed.ts                     # Database seeder with resilient fallback
│   │   └── index.ts                    # PostgreSQL pool connection
│   │
│   └── lib/                            # Engine heuristics & utilities
│       ├── store.ts                    # In-memory fallback analysis store
│       ├── skills.ts                   # Canonical skills taxonomy & relations
│       ├── match.ts                    # Role matching & scoring engine
│       ├── ats.ts                      # 8-point ATS scanner
│       └── roadmap.ts                  # Personalized curriculum generator
│
├── drizzle.config.json                 # Drizzle ORM configuration
├── next.config.ts                      # Next.js compiler settings
└── package.json
```

---

## ⚡ Getting Started (Local Development)

### Prerequisites
* **Node.js:** `>= 18.18.0`
* **npm:** `>= 9.0.0`

### 1. Clone & Install
```bash
git clone https://github.com/OxDurgeshxO/ROLEFIT2.git
cd ROLEFIT2
npm install
```

### 2. Environment Configuration (Optional)
RoleFit includes an automatic **Zero-Config In-Memory Mode**—you can run the app immediately without any database!

If you wish to persist analyses to a PostgreSQL database (e.g. Neon):
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
DATABASE_URL=postgresql://user:password@ep-example.neon.tech/rolefit_db?sslmode=require
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Typecheck
```bash
npm run typecheck    # Validate strict TypeScript (0 errors)
npm run build        # Build optimized Next.js Turbopack production bundle
```

---

## 🌐 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/analyze` | `POST` | Scores resume against curated roles or custom `job_description`. |
| `/api/parse-resume` | `POST` | Extracts text from multipart upload (`.pdf`, `.docx`, `.txt`). |
| `/api/roles` | `GET` | Returns list of 16 roles and verified required skills. |
| `/api/analyses` | `GET` | Returns history of recent resume analyses. |
| `/api/analyses/:id` | `GET` | Retrieves stored report by UUID. |
| `/api/analyses/:id/roadmap` | `POST` | Re-targets learning roadmap to another role dynamically. |
| `/api/health` | `GET` | Returns engine status, database mode, and cached records. |

---

## 📄 License
Released under the [MIT License](LICENSE). Built with modern full-stack web technologies.
