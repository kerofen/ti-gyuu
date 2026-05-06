/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? basePath : "",
  assetPrefix: isGitHubPages && basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
