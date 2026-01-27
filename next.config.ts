import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/sign-up",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
