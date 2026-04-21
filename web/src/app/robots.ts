import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Don't let crawlers waste time on private API routes or Next internals.
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
