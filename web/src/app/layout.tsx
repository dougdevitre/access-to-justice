import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopBar } from "./components/TopBar";
import { BottomNav } from "./components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "Access to Justice",
    template: "%s · Access to Justice",
  },
  description:
    "Find free legal help, plain-language resources, and start an intake request — from your phone.",
  icons: { icon: "/favicon.svg" },
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
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-brand focus:shadow"
        >
          Skip to main content
        </a>
        <TopBar />
        <main
          id="main"
          className="flex-1 w-full max-w-screen-sm mx-auto px-4 pt-4 pb-24"
        >
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
