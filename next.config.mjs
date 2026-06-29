/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // Pixabay
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },

      // imgbb
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },

      // Any external image URL (KEEPED as you requested)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;