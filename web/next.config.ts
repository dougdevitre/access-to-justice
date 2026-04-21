import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Content-Security-Policy.
// 'unsafe-inline' on scripts/styles is pragmatic for Next 15 hydration and
// Tailwind's generated styles. Tighten to nonces in a later batch.
// 'unsafe-eval' is only needed in dev for React Refresh.
const isDev = process.env.NODE_ENV !== "production";
const sentryDsnSet = Boolean(
  process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
);
const sentryConnectSrc = sentryDsnSet ? " https://*.sentry.io" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self'${sentryConnectSrc}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS is applied automatically by Vercel; leaving it here so self-hosted
  // deployments get it too. 1 year, no preload (operators can opt in).
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config) => {
    // Shared files (imported from ../shared) use .js suffixes for Node ESM
    // compatibility. Tell webpack to resolve those to .ts sources.
    config.resolve = config.resolve ?? {};
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
};

// Sentry wrap is always present so `instrumentation.ts` and the runtime
// config files link correctly. Source-map upload only kicks in when
// SENTRY_AUTH_TOKEN is present; all other Sentry-specific work is a
// no-op when DSN / auth token are unset.
const sentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.SENTRY_AUTH_TOKEN,
  // Hide source maps from client bundles (Sentry still uploads them).
  hideSourceMaps: true,
  disableLogger: true,
};

export default withSentryConfig(withNextIntl(nextConfig), sentryBuildOptions);
