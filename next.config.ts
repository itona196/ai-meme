import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allows e.g. http://192.168.x.x:3000 in dev
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((s) => s.trim())
    : undefined,
};

export default nextConfig;
