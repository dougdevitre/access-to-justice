import { NextResponse } from "next/server";

/** Lightweight health endpoint for uptime monitors (Pingdom, BetterStack,
 *  Vercel's own checks, etc.) and for humans pinning the deployed version.
 *
 *  Intentionally does not touch DynamoDB, SES, or S3 — a health check
 *  shouldn't go red just because a downstream is flaky. Wire a separate
 *  /api/ready (or use Sentry alerting) for dependency checks.
 *
 *  Cache-Control is set to no-store so the response always reflects the
 *  *current* deployment instead of a stale edge-cached one. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

const startedAt = Date.now();

export function GET() {
  const body = {
    ok: true,
    environment:
      process.env.VERCEL_ENV ??
      process.env.SENTRY_ENVIRONMENT ??
      process.env.NODE_ENV ??
      "unknown",
    release:
      process.env.VERCEL_GIT_COMMIT_SHA ??
      process.env.SENTRY_RELEASE ??
      "local",
    time: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
