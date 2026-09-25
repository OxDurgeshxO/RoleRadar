import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const body = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "RoleFit — Resume Analyzer & Job Match Platform",
  description:
    "RoleFit scores your resume against curated job roles, shows which skills are present, partial, or missing, checks ATS readiness, and builds a week-by-week learning roadmap.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">
        {/* ambient scene */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-grid-faint" />
          <div className="absolute -top-48 left-1/2 h-[560px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(62,79,224,0.08),transparent)]" />
          <div className="absolute top-[42%] -left-56 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(245,166,35,0.06),transparent)]" />
          <div className="absolute right-[-14%] bottom-[-10%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(62,79,224,0.05),transparent)]" />
        </div>
        <div className="noise-overlay" aria-hidden />
        <Nav />
        {/* Visual Beta Audit Marker */}
        <div
          id="beta-audit-badge"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/50 text-blue-300 text-xs font-mono shadow-lg shadow-blue-950/50 backdrop-blur-md pointer-events-auto"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-semibold tracking-wide">BETA AUDIT PREVIEW</span>
        </div>
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
