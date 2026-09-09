"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Database, Search, Sparkles } from "lucide-react";
import { skillLabel } from "@/lib/skills";
import { Reveal, SkillChip } from "@/components/ui";
import type { RoleInput } from "@/lib/types";

export function RolesExplorer({ roles }: { roles: RoleInput[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter((r) => {
      const nameMatch = r.name.toLowerCase().includes(q);
      const descMatch = r.description.toLowerCase().includes(q);
      const skillMatch = r.required.some((s) =>
        skillLabel(s).toLowerCase().includes(q) || s.toLowerCase().includes(q)
      );
      return nameMatch || descMatch || skillMatch;
    });
  }, [roles, query]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles or skills (e.g. Python, AI, Docker, React)..."
            className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-4 text-[13.5px] text-ink placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <p className="font-mono text-[12px] text-neutral-500">
          Showing <span className="font-semibold text-ink">{filtered.length}</span> of {roles.length} roles
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((r, i) => (
          <Reveal key={r.name} delay={Math.min(i * 0.04, 0.3)}>
            <div className="panel panel-hover flex h-full flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="size-2 rounded-full" style={{ background: r.accent }} />
                  <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                    <Database className="size-3" strokeWidth={2} />
                    {r.required.length} required skills
                  </span>
                </div>
                <h2 className="text-display mt-4 text-xl font-semibold text-ink">{r.name}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{r.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {r.required.map((id) => (
                    <SkillChip key={id} label={skillLabel(id)} tone="neutral" />
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-end">
                <Link
                  href={`/analyze?role=${encodeURIComponent(r.name)}`}
                  className="group inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand hover:text-brand-deep transition-colors"
                >
                  Target this role
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="panel mt-8 p-12 text-center">
          <p className="text-display text-lg font-semibold text-ink">No matching roles found</p>
          <p className="mt-2 text-[13px] text-neutral-500">
            Try searching for a different skill like "Python", "SQL", "Cloud", or clear your search.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold text-ink hover:bg-surface"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
