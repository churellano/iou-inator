/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: "/onmi",
  output: "export",
  reactStrictMode: true,
};

export default nextConfig;
