import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep document parsers outside the server bundle — they use Node APIs and
  // load their internals via require at runtime.
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
