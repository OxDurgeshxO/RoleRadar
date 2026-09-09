"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

/* ---------- skill chips (light theme) ---------- */

export type ChipTone = "present" | "partial" | "missing" | "neutral" | "accent";

const TONE_STYLES: Record<ChipTone, string> = {
  present: "border-emerald-200 bg-emerald-50 text-emerald-700",
  partial: "border-amber-200 bg-amber-50 text-amber-700",
  missing: "border-rose-200 bg-rose-50 text-rose-600",
  neutral: "border-line bg-paper text-ink-soft",
  accent: "border-brand/25 bg-brand/[0.06] text-brand-deep",
};

export function SkillChip({ label, tone = "neutral", className = "" }: { label: string; tone?: ChipTone; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-[5px] font-mono text-[11px] tracking-wide ${TONE_STYLES[tone]} ${className}`}
    >
      {label}
    </span>
  );
}

/* ---------- section kicker ---------- */

export function Kicker({ num, children }: { num?: string; children: ReactNode }) {
  return (
    <p className="kicker flex items-center gap-2.5 text-ink-soft">
      {num && <span className="text-brand">{num}</span>}
      <span className="h-px w-6 bg-neutral-300" />
      <span>{children}</span>
    </p>
  );
}

/* ---------- animated score ring ---------- */

export function ScoreRing({
  score,
  size = 148,
  stroke = 10,
  color = "#3e4fe0",
  sublabel,
}: {
  score: number;
  size?: number;
  stroke?: number;
  color?: string;
  sublabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const spring = useSpring(0, { stiffness: 55, damping: 18 });
  useEffect(() => {
    if (inView) spring.set(score);
  }, [inView, score, spring]);

  const rounded = useTransform(spring, (v) => Math.round(v));
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const dashOffset = useTransform(spring, (v) => C - (Math.min(v, 100) / 100) * C);

  return (
    <div ref={ref} className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eeede8" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={C}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-display flex items-baseline justify-center font-semibold text-ink" style={{ fontSize: size * 0.24 }}>
            <motion.span>{rounded}</motion.span>
            <span className="text-[0.45em] text-neutral-400">%</span>
          </div>
          {sublabel && <p className="kicker mt-0.5 text-[9px] text-neutral-400">{sublabel}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- animated score bar ---------- */

export function ScoreBar({ score, color = "#3e4fe0", delay = 0 }: { score: number; color?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <div ref={ref} className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: "0%" }}
        animate={inView ? { width: `${score}%` } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ---------- reveal on scroll ---------- */

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
