// PII scrubbers shared by the client + server + edge Sentry inits.
// An intake form collects name, phone, email, ZIP, practice area, and a
// free-text description of a legal situation — none of it should reach
// an error monitor. We scrub aggressively and rely on Sentry DSN alone
// to toggle the whole integration on/off.

import type { ErrorEvent } from "@sentry/nextjs";

const SENSITIVE_KEYS = new Set([
  "name",
  "phone",
  "email",
  "zip",
  "issue",
  "details",
  "password",
  "__locale",
]);

/** Recursively replace any sensitive field values with "[REDACTED]". */
function scrub(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(scrub);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k)) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = scrub(v);
    }
  }
  return out;
}

export function scrubSentryEvent(event: ErrorEvent): ErrorEvent | null {
  if (event.request) {
    // Never send request bodies — form submissions carry PII.
    delete event.request.data;
    // Strip auth + cookies from headers if Sentry added them.
    if (event.request.headers) {
      const h = event.request.headers as Record<string, string>;
      delete h.cookie;
      delete h.authorization;
      delete h["x-admin-session"];
    }
    // Query strings might contain the ZIP filter; drop wholesale.
    delete event.request.query_string;
  }
  if (event.user) {
    // We never set user PII ourselves, but belt-and-suspenders.
    delete event.user.email;
    delete event.user.ip_address;
    delete event.user.username;
  }
  // Walk extras + contexts for any of the known PII keys.
  if (event.extra) event.extra = scrub(event.extra) as typeof event.extra;
  if (event.contexts) {
    event.contexts = scrub(event.contexts) as typeof event.contexts;
  }
  return event;
}

export const SENTRY_DEFAULTS = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.VERCEL_ENV,
  release: process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA,
  // Low sample rate to start; raise after you see the baseline volume.
  tracesSampleRate: 0.1,
  // Never send default PII (IP, cookies, headers).
  sendDefaultPii: false,
};
