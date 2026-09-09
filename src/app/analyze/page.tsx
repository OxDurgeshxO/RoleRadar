import { Analyzer } from "@/components/analyzer";

export const metadata = {
  title: "Analyzer — RoleFit",
  description: "Upload or paste a resume and score it against curated job roles.",
};

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams: Promise<{ sample?: string }>;
}) {
  const { sample } = await searchParams;
  return <Analyzer initialSampleId={sample ?? null} />;
}
