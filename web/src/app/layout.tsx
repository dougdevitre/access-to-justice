import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopBar } from "./components/TopBar";
import { BottomNav } from "./components/BottomNav";

export const metadata: Metadata = {
  title: "Access to Justice",
  description: "Mobile-first legal-aid companion.",
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
        <TopBar />
        <main className="flex-1 w-full max-w-screen-sm mx-auto px-4 pt-4 pb-24">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
