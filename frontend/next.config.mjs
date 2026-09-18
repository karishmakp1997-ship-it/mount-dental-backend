/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Django media while developing locally. Safe to keep — only used if a
      // URL actually points here, which won't happen once Cloudinary is set up.
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
    ],
    // Needed because Django runs on 127.0.0.1 during local development.
    dangerouslyAllowLocalIP: true,
  },
  // Lets you open the site from your phone on the same WiFi during local development
  allowedDevOrigins: ["192.168.0.104"],
};

export default nextConfig;