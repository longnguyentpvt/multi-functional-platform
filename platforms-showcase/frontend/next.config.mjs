/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "2757d7.myshopify.com",
        port: "",
        pathname: "/cdn/shop/files/**"
      }
    ]
  },
  output: "standalone"
};

export default nextConfig;
