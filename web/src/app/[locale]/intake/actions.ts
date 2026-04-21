"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { IntakeSubmissionSchema } from "@/lib/intake";
import { saveIntake, IntakeSinkError } from "@/lib/intake-sink";
import { checkRateLimit } from "@/lib/rate-limit";
import { routing } from "@/i18n/routing";

export type IntakeFormState = {
  ok: boolean;
  errors?: Partial<
    Record<
      "name" | "phone" | "email" | "zip" | "issue" | "details" | "form",
      string
    >
  >;
  values?: Record<string, string>;
};

function pickLocale(
  input: FormDataEntryValue | null,
): (typeof routing.locales)[number] {
  const s = typeof input === "string" ? input : "";
  return (routing.locales as readonly string[]).includes(s)
    ? (s as (typeof routing.locales)[number])
    : routing.defaultLocale;
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for") ?? "";
  const first = xff.split(",")[0]?.trim();
  if (first) return first;
  return h.get("x-real-ip") ?? "unknown";
}

export async function submitIntake(
  _prev: IntakeFormState,
  formData: FormData,
): Promise<IntakeFormState> {
  const locale = pickLocale(formData.get("__locale"));
  const t = await getTranslations({ locale, namespace: "Intake" });

  const raw = {
    name: (formData.get("name") ?? "") as string,
    phone: (formData.get("phone") ?? "") as string,
    email: (formData.get("email") ?? "") as string,
    zip: (formData.get("zip") ?? "") as string,
    issue: (formData.get("issue") ?? "") as string,
    details: (formData.get("details") ?? "") as string,
  };

  // Rate limit check BEFORE zod so someone hammering the form with garbage
  // can't bypass the limiter. Key on client IP (best effort; "unknown" is
  // a shared bucket for clients without a detectable IP).
  const ip = await getClientIp();
  const rl = await checkRateLimit(`intake:${ip}`);
  if (rl && !rl.allowed) {
    return {
      ok: false,
      errors: {
        form: t("rateLimitError", {
          minutes: Math.max(1, Math.ceil(rl.retryAfterSeconds / 60)),
        }),
      },
      values: raw,
    };
  }

  const parsed = IntakeSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: IntakeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] ??
        "form") as keyof NonNullable<IntakeFormState["errors"]>;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors, values: raw };
  }

  try {
    await saveIntake({
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      locale,
      ...parsed.data,
    });
  } catch (err) {
    if (err instanceof IntakeSinkError) {
      console.error("intake:", err.message, err.cause);
    } else {
      console.error("intake: unexpected error", err);
    }
    return {
      ok: false,
      errors: { form: t("formError") },
      values: raw,
    };
  }

  redirect({ href: "/intake/thanks", locale });
  // Unreachable — redirect() throws a Next.js internal error. Keeps TS happy
  // because next-intl's redirect() return type is `void`, not `never`.
  return { ok: true };
}
