import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor's browser preview is not localhost. Without these hosts, Next 16
  // 403s /_next JS and CSS, so the preview stays blank.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "**.cursor.sh",
    "**.cursor.com",
    "**.cursorusercontent.com",
    "**.vscode-cdn.net",
  ],
};

export default nextConfig;
