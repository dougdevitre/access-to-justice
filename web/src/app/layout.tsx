import type { Metadata, Viewport } from "next";
import "./globals.css";

// Root layout: the `<html>` / `<body>` are rendered by the [locale] layout so
// the `lang` attribute matches the active locale. This root layout just
// forwards children so non-locale routes (the root not-found) still render.

export const metadata: Metadata = {
  title: {
    default: "Access to Justice",
    template: "%s · Access to Justice",
  },
  description:
    "Find free legal help, plain-language resources, and start an intake request — from your phone.",
  applicationName: "Access to Justice",
  appleWebApp: {
    capable: true,
    title: "A2J",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f4e79",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
