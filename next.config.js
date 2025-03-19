/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
    ],
    domains: [
      "your-uploadthing-domain.com",
      "api.astria.ai",
      "7gjsu8414g.ufs.sh",
    ],
  },
  // Add memory allocation for Node.js
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.nodeEnv = "production";
    }
    return config;
  },
};

module.exports = nextConfig;
