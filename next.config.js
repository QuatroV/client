/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const pwaConfig = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  ...pwaConfig,
};

module.exports = nextConfig;
