# 🎯 RoleFit — AI Resume Analyzer & Career Intelligence Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> An enterprise AI-powered career intelligence and resume optimization engine that evaluates candidate resumes against 11 industry job roles, performs 8-point ATS compatibility audits, simulates career trajectory "what-ifs", and generates personalized week-by-week learning roadmaps.

---

## 🌟 Key Features

* 📄 **Multi-Format Resume Parser:** Robust parsing of `.pdf`, `.docx`, and `.txt` files with automated Unicode sanitization and layout analysis.
* 🎯 **11-Role Compatibility Engine:** High-precision scoring against curated software engineering roles (Full Stack, Frontend, Backend, AI/ML, DevOps/SRE, Data Engineer, Cloud Architect, Mobile, Security, QA Automation, Product Engineering).
* ✅ **8-Point ATS Readiness Audit:** Structural checks for section hierarchy, contact info, measurable impact metrics, skill density, and file parsing integrity.
* 🧪 **What-If Skill Simulator:** Interactive simulation showing real-time score boosts if the candidate masters specific gap technologies.
* 📊 **Skill Gap Intelligence:** Visual matrix highlighting critical missing skills vs. existing proficiencies.
* 🗺️ **Personalized Learning Roadmaps:** Week-by-week structured curriculum with recommended real-world capstone projects.
* 🎓 **Targeted Certifications:** Handpicked industry certifications matching identified career gaps.
* 💬 **AI Interview Prep:** Curated, role-specific technical and behavioral questions tailored to the resume's weak spots.
* 📈 **Progress & Version Tracking:** Track iterative score improvements across uploaded resume iterations.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router with Turbopack) |
| **Language** | TypeScript 5.9 (Strict Mode) |
| **Frontend UI** | React 19.2, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Database & ORM** | PostgreSQL (Neon serverless ready), Drizzle ORM |
| **File Parsing** | `pdf-parse` (with CJS/ESM interop), `mammoth` (DOCX extraction) |
| **Hosting & Deploy** | Vercel / Netlify (`@netlify/plugin-nextjs`) |

---

## 📁 Project Architecture

```text
ROLEFIT/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page & hero
│   │   ├── layout.tsx                  # Global shell & navigation
│   │   ├── analyze/                    # Interactive resume upload & processing
│   │   ├── compare/                    # Version-to-version resume diffing
│   │   ├── history/                    # Historical analysis timeline
│   │   ├── results/[id]/               # Comprehensive match reports
│   │   ├── roles/                      # Curated 11-role catalog & requirements
│   │   └── api/
│   │       ├── analyze/                # AI analysis endpoint
│   │       ├── parse-resume/           # PDF/DOCX file text extractor
│   │       ├── roles/                  # Role definitions API
│   │       └── health/                 # Healthcheck & DB ping
│   │
│   ├── components/                     # Reusable UI cards, tables & badges
│   ├── db/
│   │   ├── schema.ts                   # Drizzle relational schema
│   │   ├── roles-data.ts               # 11 Curated role benchmark definitions
│   │   ├── seed.ts                     # Database seeder
│   │   └── index.ts                    # Resilient PostgreSQL pool connection
│   └── lib/                            # Scoring heuristics, ATS rules & utils
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
git clone https://github.com/OxDurgeshxO/ROLEFIT.git
cd ROLEFIT
npm install
```

### 2. Configure Environment
Copy the sample environment file:
```bash
cp .env.example .env
```
Edit `.env` with your PostgreSQL database URL (e.g. from [Neon](https://neon.tech)):
```ini
DATABASE_URL=postgresql://neondb_owner:your_password@ep-sample-host.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Push Database Schema
```bash
npx drizzle-kit push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Typecheck & Production Build
```bash
# Verify TypeScript
npm run typecheck

# Build for production
npm run build
```

---

## 🚀 One-Click Cloud Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/OxDurgeshxO/ROLEFIT)

1. Click **Deploy with Vercel**.
2. Create a free PostgreSQL database on [Neon.tech](https://neon.tech).
3. Set the `DATABASE_URL` environment variable.
4. Deploy!

---

## 📄 License

MIT © [Durgesh Dutt Sinha](https://github.com/OxDurgeshxO)
