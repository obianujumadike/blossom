import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
};

const isDev = process.env.NODE_ENV === "development";
const disablePWA = isDev && process.env.DISABLE_PWA !== "false";

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // PWA disabled in development by default, but can be enabled with DISABLE_PWA=false
  disable: disablePWA,
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig);
