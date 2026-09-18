/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Django media while developing. Replace these with your live API domain before going live.
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
    ],
    // Needed because Django runs on 127.0.0.1. Only the hosts listed above are ever fetched.
    dangerouslyAllowLocalIP: true,
  },
  // Lets you open the site from your phone on the same WiFi
  allowedDevOrigins: ["192.168.0.104"],
};

export default nextConfig;