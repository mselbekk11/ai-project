/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["geist"],
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
      {
        protocol: "https",
        hostname: "www.trizzy.ai",
        pathname: "/api/proxy-image**",
      },
      {
        protocol: "https",
        hostname: "trizzy.ai",
        pathname: "/api/proxy-image**",
      },
    ],
    domains: [
      "your-uploadthing-domain.com",
      "api.astria.ai",
      "7gjsu8414g.ufs.sh",
      "mp.astria.ai",
      "www.trizzy.ai",
      "trizzy.ai",
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
