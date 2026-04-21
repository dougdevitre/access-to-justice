import { describe, expect, it } from "vitest";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import {
  buildConfirmationMessage,
  createSesEmailSender,
  EmailSenderError,
  escapeHtml,
  sendIntakeConfirmation,
  type IntakeEmailTranslator,
} from "./intake-email";
import type { StoredIntake } from "./intake-sink";

const baseRecord: StoredIntake = {
  id: "00000000-0000-0000-0000-000000000001",
  submittedAt: "2026-04-21T00:00:00.000Z",
  locale: "en",
  name: "Jane Doe",
  phone: "555-123-4567",
  email: "jane@example.com",
  zip: "10001",
  issue: "housing",
  details: "I received an eviction notice.",
};

/** Simple translator that returns "<namespace>.<key>({vars})" so tests can
 *  inspect exactly what was requested without depending on catalog copy. */
const stubT: IntakeEmailTranslator = (key, vars) => {
  if (!vars) return key;
  const pairs = Object.entries(vars)
    .map(([k, v]) => `${k}=${v}`)
    .join(",");
  return `${key}(${pairs})`;
};

describe("createSesEmailSender", () => {
  it("issues a SendEmailCommand with FromEmailAddress + Destination + multipart body", async () => {
    const sends: SendEmailCommand[] = [];
    const client = {
      async send(cmd: SendEmailCommand) {
        sends.push(cmd);
        return {};
      },
    };
    const sender = createSesEmailSender({
      client: client as unknown as Parameters<
        typeof createSesEmailSender
      >[0]["client"],
      from: "admin@cotrackpro.com",
    });

    await sender.send({
      to: "jane@example.com",
      subject: "Hi",
      textBody: "Text",
      htmlBody: "<p>Html</p>",
    });

    expect(sends).toHaveLength(1);
    expect(sends[0]).toBeInstanceOf(SendEmailCommand);
    const input = sends[0].input;
    expect(input.FromEmailAddress).toBe("admin@cotrackpro.com");
    expect(input.Destination?.ToAddresses).toEqual(["jane@example.com"]);
    expect(input.Content?.Simple?.Subject?.Data).toBe("Hi");
    expect(input.Content?.Simple?.Body?.Text?.Data).toBe("Text");
    expect(input.Content?.Simple?.Body?.Html?.Data).toBe("<p>Html</p>");
  });

  it("wraps send failures in EmailSenderError", async () => {
    const client = {
      async send() {
        throw new Error("MessageRejected");
      },
    };
    const sender = createSesEmailSender({
      client: client as unknown as Parameters<
        typeof createSesEmailSender
      >[0]["client"],
      from: "admin@cotrackpro.com",
    });

    await expect(
      sender.send({
        to: "x@y.z",
        subject: "s",
        textBody: "t",
        htmlBody: "<p>h</p>",
      }),
    ).rejects.toBeInstanceOf(EmailSenderError);
  });
});

describe("buildConfirmationMessage", () => {
  it("uses greeting with {name} when the record has a name", () => {
    const msg = buildConfirmationMessage({
      t: stubT,
      to: "jane@example.com",
      locale: "en",
      record: baseRecord,
    });
    expect(msg.to).toBe("jane@example.com");
    expect(msg.subject).toBe("subject");
    expect(msg.textBody).toContain("greeting(name=Jane Doe)");
    expect(msg.textBody).toContain(
      `bodyIntro(id=${baseRecord.id},at=Apr 21, 2026, 12:00 AM)`,
    );
  });

  it("uses greetingNoName when name is empty", () => {
    const msg = buildConfirmationMessage({
      t: stubT,
      to: "x@y.z",
      locale: "en",
      record: { ...baseRecord, name: "   " },
    });
    expect(msg.textBody).toContain("greetingNoName");
    expect(msg.textBody).not.toContain("greeting(name=");
  });

  it("includes the resources URL when siteUrl is set", () => {
    const msg = buildConfirmationMessage({
      t: stubT,
      to: "x@y.z",
      locale: "es",
      record: baseRecord,
      siteUrl: "https://example.org",
    });
    expect(msg.textBody).toContain("https://example.org/es/resources");
    expect(msg.htmlBody).toContain("https://example.org/es/resources");
  });

  it("HTML-escapes the user-supplied name to prevent injection", () => {
    const msg = buildConfirmationMessage({
      t: (key, vars) =>
        key === "greeting" ? `Hi, ${vars?.name}` : stubT(key, vars),
      to: "x@y.z",
      locale: "en",
      record: { ...baseRecord, name: "<script>alert(1)</script>" },
    });
    expect(msg.htmlBody).not.toContain("<script>alert(1)</script>");
    expect(msg.htmlBody).toContain(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });
});

describe("sendIntakeConfirmation", () => {
  it("is a no-op when `to` is empty (never constructs the message)", async () => {
    let calls = 0;
    const sender = {
      async send() {
        calls += 1;
      },
    };
    await sendIntakeConfirmation({
      to: "",
      locale: "en",
      record: { ...baseRecord, email: "" },
      sender,
    });
    expect(calls).toBe(0);
  });

  it("is a no-op when sender is null (sender not configured)", async () => {
    await expect(
      sendIntakeConfirmation({
        to: "jane@example.com",
        locale: "en",
        record: baseRecord,
        sender: null,
      }),
    ).resolves.toBeUndefined();
  });
});

describe("escapeHtml", () => {
  it("escapes all five special characters", () => {
    expect(escapeHtml(`<a href="x">Tom & "Jerry"'s</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;Tom &amp; &quot;Jerry&quot;&#39;s&lt;/a&gt;",
    );
  });
});
