// Edge-runtime Sentry init (middleware). No-ops if SENTRY_DSN is unset.
import * as Sentry from "@sentry/nextjs";
import { SENTRY_DEFAULTS, scrubSentryEvent } from "@/sentry-shared";

if (SENTRY_DEFAULTS.dsn) {
  Sentry.init({
    ...SENTRY_DEFAULTS,
    beforeSend: scrubSentryEvent,
  });
}
