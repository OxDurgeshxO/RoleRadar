import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { loadRoles } from "@/db/seed";
import { Kicker } from "@/components/ui";
import { RolesExplorer } from "@/components/roles-explorer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Job Roles — RoleFit",
  description: "The curated catalog of target roles and their verified required skills.",
};

export default async function RolesPage() {
  const roles = await loadRoles();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <Kicker num="✦">Role catalog</Kicker>
          <h1 className="text-display mt-4 text-4xl font-semibold text-ink sm:text-5xl">
            {roles.length} roles. Every required skill, visible.
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
            Your resume is scored against this curated catalog. Each role lists its expected skills —
            exactly what the matching engine checks for, with no hidden criteria.
          </p>
        </div>
        <Link
          href="/analyze"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand"
        >
          Score my resume
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
        </Link>
      </div>

      <RolesExplorer roles={roles} />
    </div>
  );
}
