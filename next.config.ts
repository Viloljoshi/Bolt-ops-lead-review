import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Bolt-ops-lead-review',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
