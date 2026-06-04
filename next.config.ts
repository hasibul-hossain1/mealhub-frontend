import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:"**",
        pathname:"**"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://tyme2eat-backend.vercel.app"}/api/v1/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
