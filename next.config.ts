import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? "/compensation-exam" : undefined,
  assetPrefix: isGithubPages ? "/compensation-exam/" : undefined,
};

export default nextConfig;
