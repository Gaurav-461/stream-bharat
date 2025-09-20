import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {hostname: "image.mux.com"}
    ]
  }
};

export default nextConfig;
