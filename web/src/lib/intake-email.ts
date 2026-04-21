// Intake confirmation email. Swappable sender interface (mirrors
// IntakeSink) so provider swaps are low-blast-radius.
//
// Env vars (read lazily at first resolveEmailSender() call):
//   INTAKE_EMAIL_SENDER   "ses" | "none"   (default: "none")
//   INTAKE_EMAIL_FROM     sender identity  (default: "admin@cotrackpro.com")
//   SES_REGION            override for the SES client region
//   AWS_REGION            fallback when SES_REGION is unset
//
// See web/docs/INTAKE_EMAIL.md for the SES identity verification,
// sandbox → production flow, and IAM policy.

import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { getTranslations } from "next-intl/server";
import type { StoredIntake } from "./intake-sink";

export type EmailMessage = {
  to: string;
  subject: string;
  textBody: string;
  htmlBody: string;
};

export type EmailSender = {
  send(msg: EmailMessage): Promise<void>;
};

export class EmailSenderError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "EmailSenderError";
  }
}

const DEFAULT_FROM = "admin@cotrackpro.com";

type SesClient = Pick<SESv2Client, "send">;

export function createSesEmailSender(options: {
  client: SesClient;
  from: string;
}): EmailSender {
  const { client, from } = options;
  return {
    async send(msg) {
      try {
        await client.send(
          new SendEmailCommand({
            FromEmailAddress: from,
            Destination: { ToAddresses: [msg.to] },
            Content: {
              Simple: {
                Subject: { Data: msg.subject, Charset: "UTF-8" },
                Body: {
                  Text: { Data: msg.textBody, Charset: "UTF-8" },
                  Html: { Data: msg.htmlBody, Charset: "UTF-8" },
                },
              },
            },
          }),
        );
      } catch (cause) {
        throw new EmailSenderError(
          `SES send failed to ${msg.to} from ${from}`,
          { cause },
        );
      }
    },
  };
}

export function createNoopSender(): EmailSender {
  return { async send() {} };
}

let cached: EmailSender | null | undefined;

export function resolveEmailSender(): EmailSender | null {
  if (cached !== undefined) return cached;
  const kind = process.env.INTAKE_EMAIL_SENDER ?? "none";
  if (kind !== "ses") {
    cached = null;
    return null;
  }
  const from = process.env.INTAKE_EMAIL_FROM ?? DEFAULT_FROM;
  const region =
    process.env.SES_REGION ?? process.env.AWS_REGION ?? "us-east-1";
  cached = createSesEmailSender({
    client: new SESv2Client({ region }),
    from,
  });
  return cached;
}

const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch] ?? ch);
}

/** Minimal shape of the `t` function we need — exposed so tests can stub
 *  it without pulling in next-intl runtime. Matches the subset of the real
 *  next-intl translator returned by `getTranslations`. */
export type IntakeEmailTranslator = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

/** Pure builder: given a translator + record, produce the full email
 *  payload. Doesn't touch SES or next-intl runtime. Safe to unit-test. */
export function buildConfirmationMessage(args: {
  t: IntakeEmailTranslator;
  to: string;
  locale: "en" | "es";
  record: StoredIntake;
  siteUrl?: string;
}): EmailMessage {
  const { t, record, locale } = args;
  const nameRaw = record.name.trim();
  const siteUrl = args.siteUrl ?? "";
  const resourcesUrl = siteUrl ? `${siteUrl}/${locale}/resources` : "";

  const submittedAt = new Date(record.submittedAt);
  const dateLocale = locale === "es" ? "es-ES" : "en-US";
  const at = new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(submittedAt);

  const greeting = nameRaw
    ? t("greeting", { name: nameRaw })
    : t("greetingNoName");
  const bodyIntro = t("bodyIntro", { id: record.id, at });
  const nextSteps = t("nextSteps");
  const resourcesLabel = t("resourcesLabel");
  const disclaimer = t("disclaimer");
  const footerAddress = t("footerAddress");
  const subject = t("subject");

  const textBody = [
    greeting,
    "",
    bodyIntro,
    "",
    nextSteps,
    resourcesUrl
      ? `  ${resourcesLabel}: ${resourcesUrl}`
      : `  ${resourcesLabel}`,
    "",
    disclaimer,
    "",
    footerAddress,
  ].join("\n");

  const htmlBody = renderHtmlBody({
    greeting,
    bodyIntro,
    nextSteps,
    resourcesLabel,
    resourcesUrl,
    disclaimer,
    footerAddress,
  });

  return { to: args.to, subject, textBody, htmlBody };
}

/** Build the full confirmation payload and send it. No-ops when:
 *    - `to` is empty (user didn't provide an email)
 *    - resolveEmailSender() returns null (sender not configured)
 *  The caller in actions.ts additionally wraps this in try/catch so an
 *  SES hiccup never blocks the intake /thanks redirect. */
export async function sendIntakeConfirmation(args: {
  to: string;
  locale: "en" | "es";
  record: StoredIntake;
  sender?: EmailSender | null;
  siteUrl?: string;
}): Promise<void> {
  if (!args.to) return;
  const sender =
    args.sender === undefined ? resolveEmailSender() : args.sender;
  if (!sender) return;

  const t = await getTranslations({
    locale: args.locale,
    namespace: "IntakeEmail",
  });
  const msg = buildConfirmationMessage({
    t,
    to: args.to,
    locale: args.locale,
    record: args.record,
    siteUrl: args.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "",
  });
  await sender.send(msg);
}

function renderHtmlBody(parts: {
  greeting: string;
  bodyIntro: string;
  nextSteps: string;
  resourcesLabel: string;
  resourcesUrl: string;
  disclaimer: string;
  footerAddress: string;
}): string {
  const link = parts.resourcesUrl
    ? `<p><a href="${escapeHtml(parts.resourcesUrl)}">${escapeHtml(parts.resourcesLabel)}</a></p>`
    : `<p>${escapeHtml(parts.resourcesLabel)}</p>`;
  return `<!doctype html>
<html><body style="font-family: -apple-system, system-ui, sans-serif; color: #1e293b; line-height: 1.5;">
  <p>${escapeHtml(parts.greeting)}</p>
  <p>${escapeHtml(parts.bodyIntro)}</p>
  <p>${escapeHtml(parts.nextSteps)}</p>
  ${link}
  <p style="color: #475569; font-size: 0.9em;">${escapeHtml(parts.disclaimer)}</p>
  <p style="color: #475569; font-size: 0.85em;">${escapeHtml(parts.footerAddress)}</p>
</body></html>`;
}
