"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Wand2, Lightbulb, ArrowRight } from "lucide-react";

interface OptimizedVariation {
  title: string;
  tag: string;
  bullet: string;
  formulaBreakdown: {
    accomplished: string;
    measured: string;
    action: string;
  };
}

const SAMPLE_WEAK_BULLETS = [
  {
    label: "Frontend Web",
    text: "Worked on the customer dashboard using React and Tailwind CSS.",
  },
  {
    label: "Backend & API",
    text: "Built REST APIs with Node.js and connected them to PostgreSQL.",
  },
  {
    label: "Data & Analytics",
    text: "Did data analysis in Python and made charts for weekly meetings.",
  },
  {
    label: "DevOps & Cloud",
    text: "Helped team deploy containerized applications on AWS using Docker.",
  },
];

export function BulletOptimizer() {
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizedVariation[] | null>(null);

  function handleOptimize() {
    if (!input.trim()) return;
    setOptimizing(true);

    setTimeout(() => {
      const text = input.trim();
      // Generate 3 formula-driven variations based on the input text
      const lower = text.toLowerCase();

      let v1: OptimizedVariation;
      let v2: OptimizedVariation;
      let v3: OptimizedVariation;

      if (lower.includes("react") || lower.includes("frontend") || lower.includes("css") || lower.includes("ui") || lower.includes("dashboard")) {
        v1 = {
          title: "Quantitative Impact & Performance",
          tag: "Metrics-Driven",
          bullet: "Architected responsive analytics dashboard using React and Tailwind CSS, reducing initial page render latency by 42% across 25,000+ active monthly users.",
          formulaBreakdown: {
            accomplished: "Architected responsive analytics dashboard",
            measured: "reducing initial render latency by 42% across 25,000+ users",
            action: "by leveraging React component memoization and Tailwind utility pruning.",
          },
        };
        v2 = {
          title: "System Scale & Reusability",
          tag: "Design System",
          bullet: "Spearheaded creation of 30+ reusable React component primitives, cutting frontend sprint delivery turnaround times by 35% for 4 feature teams.",
          formulaBreakdown: {
            accomplished: "Created 30+ reusable design system components",
            measured: "cutting sprint turnaround times by 35%",
            action: "by establishing standardized TypeScript component patterns and automated storybook tests.",
          },
        };
        v3 = {
          title: "Executive & Business Value",
          tag: "Conversion",
          bullet: "Redesigned core user dashboard with accessible React workflows, driving a 28% increase in daily user engagement and achieving 100% WCAG AA compliance.",
          formulaBreakdown: {
            accomplished: "Redesigned core dashboard workflows",
            measured: "driving 28% higher daily user engagement and 100% compliance",
            action: "by refactoring legacy layouts into modular, accessible UI patterns.",
          },
        };
      } else if (lower.includes("api") || lower.includes("node") || lower.includes("backend") || lower.includes("database") || lower.includes("sql")) {
        v1 = {
          title: "High-Throughput & Uptime",
          tag: "System Scale",
          bullet: "Engineered scalable REST microservices using Node.js and PostgreSQL, sustaining 99.98% uptime while handling 1.8M daily transactions at sub-80ms latency.",
          formulaBreakdown: {
            accomplished: "Engineered scalable REST microservices",
            measured: "sustaining 99.98% uptime across 1.8M daily transactions",
            action: "by implementing connection pooling, query indexing, and Redis caching.",
          },
        };
        v2 = {
          title: "Security & Testing Rigor",
          tag: "Engineering Quality",
          bullet: "Hardened backend data pipelines with JWT authentication, role-based access control (RBAC), and automated Jest integration tests, reaching 94% test coverage.",
          formulaBreakdown: {
            accomplished: "Hardened backend data pipelines and API contracts",
            measured: "achieving 94% test coverage and zero security regressions",
            action: "by introducing standardized validation middleware and automated CI suites.",
          },
        };
        v3 = {
          title: "Infrastructure Cost Optimization",
          tag: "Cost Efficiency",
          bullet: "Refactored legacy backend queries and normalized schema structures, lowering database CPU utilization by 45% and reducing cloud hosting costs by $1,200/month.",
          formulaBreakdown: {
            accomplished: "Refactored legacy queries and database schemas",
            measured: "lowering CPU utilization by 45% and saving $1,200/month",
            action: "by profiling query execution plans and introducing compound composite indexes.",
          },
        };
      } else if (lower.includes("data") || lower.includes("python") || lower.includes("chart") || lower.includes("analysis")) {
        v1 = {
          title: "Decision Impact & Revenue",
          tag: "Executive Impact",
          bullet: "Delivered automated Python ETL pipelines and interactive Power BI executive dashboards, surfacing cost-saving anomalies that saved $180,000 annually.",
          formulaBreakdown: {
            accomplished: "Delivered automated ETL pipelines and dashboards",
            measured: "surfacing anomalies that saved $180,000 annually",
            action: "by cleaning raw transactional datasets with Pandas and automated outlier models.",
          },
        };
        v2 = {
          title: "Workflow Automation",
          tag: "Efficiency",
          bullet: "Automated recurring weekly reporting workflows using Python and SQL scripts, slashing manual data preparation time from 14 hours to 15 minutes per cycle.",
          formulaBreakdown: {
            accomplished: "Automated recurring reporting workflows",
            measured: "slashing preparation time from 14 hours to 15 minutes",
            action: "by authoring parameterized SQL queries and scheduled pipeline triggers.",
          },
        };
        v3 = {
          title: "Statistical Rigor & Modeling",
          tag: "Advanced Analytics",
          bullet: "Formulated predictive churn models using Scikit-Learn and logistic regression, empowering retention teams with 84% accuracy 30 days prior to renewal dates.",
          formulaBreakdown: {
            accomplished: "Formulated predictive churn classification models",
            measured: "achieving 84% precision in flagging at-risk accounts",
            action: "by engineering 25+ behavioral engagement features from raw user logs.",
          },
        };
      } else {
        // Universal high-impact tech template
        v1 = {
          title: "Quantitative Impact (Google XYZ)",
          tag: "Metrics",
          bullet: `Spearheaded end-to-end modernization of core technical deliverables, accelerating team delivery velocity by 32% and eliminating critical production bottlenecks.`,
          formulaBreakdown: {
            accomplished: "Modernized core technical deliverables",
            measured: "accelerating delivery velocity by 32%",
            action: "by auditing legacy workflows and implementing automated tooling.",
          },
        };
        v2 = {
          title: "Architecture & Scale",
          tag: "Reliability",
          bullet: `Engineered resilient, modular solution architecture, maintaining 99.9% operational reliability while reducing resource overhead by 28%.`,
          formulaBreakdown: {
            accomplished: "Engineered modular solution architecture",
            measured: "maintaining 99.9% reliability while reducing overhead by 28%",
            action: "by refactoring legacy tightly-coupled components into decoupled services.",
          },
        };
        v3 = {
          title: "Collaboration & Delivery",
          tag: "Ownership",
          bullet: `Collaborated cross-functionally with 5+ stakeholders to launch key feature roadmap on schedule, unlocking high-value workflows for 10,000+ end users.`,
          formulaBreakdown: {
            accomplished: "Led cross-functional feature launch on schedule",
            measured: "unlocking high-value workflows for 10,000+ users",
            action: "by defining clear technical specifications and agile sprint milestones.",
          },
        };
      }

      setResults([v1, v2, v3]);
      setOptimizing(false);
    }, 400);
  }

  function copyBullet(text: string, index: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
    });
  }

  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker text-[10px] text-neutral-400">google xyz formula</p>
          <h3 className="text-display mt-2 text-xl font-semibold text-ink">
            Resume Bullet Point Optimizer
          </h3>
        </div>
        <Wand2 className="size-5 text-brand" strokeWidth={2} />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">
        Transform ordinary duty statements into high-impact, ATS-optimized lines following the formula:{" "}
        <strong className="text-ink">Accomplished [X] as measured by [Y] by doing [Z]</strong>.
      </p>

      {/* Preset Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-neutral-400 font-mono">Try weak sample:</span>
        {SAMPLE_WEAK_BULLETS.map((s) => (
          <button
            key={s.label}
            onClick={() => setInput(s.text)}
            className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] text-ink-soft hover:border-neutral-300 hover:text-ink transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mt-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a bullet point from your resume (e.g. 'Built backend API with Node.js and PostgreSQL')..."
          rows={3}
          className="w-full rounded-xl border border-line bg-surface p-3.5 text-[13.5px] text-ink placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand leading-relaxed"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400 font-mono">
            {input.length} characters
          </span>
          <button
            onClick={handleOptimize}
            disabled={!input.trim() || optimizing}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Sparkles className="size-3.5" />
            {optimizing ? "Optimizing..." : "Optimize with XYZ Formula"}
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-3.5 border-t border-line/60 pt-5"
          >
            <p className="kicker text-[10px] text-brand">3 high-impact variations</p>
            {results.map((r, i) => (
              <div
                key={r.title}
                className="rounded-xl border border-line bg-paper/60 p-4 transition-all hover:border-brand/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand/[0.08] px-2 py-0.5 font-mono text-[9.5px] font-semibold text-brand uppercase">
                      {r.tag}
                    </span>
                    <h4 className="text-[13px] font-semibold text-ink">{r.title}</h4>
                  </div>
                  <button
                    onClick={() => copyBullet(r.bullet, i)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-soft hover:text-ink transition-colors"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check className="size-3 text-brand" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-2.5 text-[13px] leading-relaxed text-ink select-all font-sans bg-surface/70 rounded-lg p-2.5 border border-line/40">
                  {r.bullet}
                </p>

                <div className="mt-2.5 grid grid-cols-3 gap-2 text-[10.5px] text-neutral-500 font-mono pt-2 border-t border-line/40">
                  <div>
                    <span className="font-semibold text-ink">X:</span> {r.formulaBreakdown.accomplished}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Y:</span> {r.formulaBreakdown.measured}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Z:</span> {r.formulaBreakdown.action}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
