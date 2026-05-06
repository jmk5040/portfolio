/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/works",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
