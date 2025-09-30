import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Blossom",
  description: "Blossom - A beautiful and intuitive app experience",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["blossom", "app", "nextjs", "pwa"],
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#fff" },
    { media: "(prefers-color-scheme: light)", color: "#ED205A" },
  ],
  authors: [
    { name: "Blossom Team" },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "icon-blossom-192.svg" },
    { rel: "icon", url: "icon-blossom-192.svg" },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#fff" },
    { media: "(prefers-color-scheme: light)", color: "#4F46E5" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Blossom" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ED205A" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
