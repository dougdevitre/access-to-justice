// Next.js `instrumentation` hook. Loads the right Sentry init for the
// current runtime and exposes the request-error hook.
//
// When SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN are unset, the config files
// skip Sentry.init() and captureRequestError() is a no-op.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
