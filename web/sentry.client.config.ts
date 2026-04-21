// Client-side Sentry init. No-ops if NEXT_PUBLIC_SENTRY_DSN is unset.
import * as Sentry from "@sentry/nextjs";
import { SENTRY_DEFAULTS, scrubSentryEvent } from "@/sentry-shared";

if (SENTRY_DEFAULTS.dsn) {
  Sentry.init({
    ...SENTRY_DEFAULTS,
    // Browser-side: keep the breadcrumb volume sane.
    integrations: [],
    beforeSend: scrubSentryEvent,
  });
}
