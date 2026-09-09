"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Crosshair } from "lucide-react";

const LINKS = [
  { href: "/analyze", label: "Analyzer" },
  { href: "/compare", label: "Compare" },
  { href: "/roles", label: "Roles" },
  { href: "/history", label: "History" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-white transition-transform duration-300 group-hover:rotate-12">
            <Crosshair className="size-4.5" strokeWidth={2.2} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-ink">
            Role<span className="text-brand">Fit</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 sm:px-4 ${
                  active ? "bg-neutral-900/[0.06] text-ink" : "text-ink-soft hover:bg-neutral-900/[0.04] hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/analyze"
            className="ml-1 hidden items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand sm:inline-flex"
          >
            Analyze now
            <ArrowRight className="size-3.5" strokeWidth={2.4} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
