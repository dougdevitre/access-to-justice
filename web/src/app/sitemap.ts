import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const PATHS = [
  "",
  "/find-help",
  "/resources",
  "/intake",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!base) return [];
  const now = new Date();
  return routing.locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
  );
}
