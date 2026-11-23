import type { NextConfig } from "next";
import { execSync } from "child_process";

function lastCommit() {
  try {
    const [date, message] = execSync("git log -1 --format=%cI%n%s").toString().trim().split("\n");
    return { date, message };
  } catch {
    return {
      date: new Date().toISOString(),
      message: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "",
    };
  }
}

const commit = lastCommit();

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.19"],

  env: {
    LAST_COMMIT_DATE: commit.date,
    LAST_COMMIT_MESSAGE: commit.message,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
};

export default nextConfig;