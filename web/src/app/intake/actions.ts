"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { redirect } from "next/navigation";
import { IntakeSubmissionSchema } from "@/lib/intake";

export type IntakeFormState = {
  ok: boolean;
  errors?: Partial<Record<"name" | "phone" | "email" | "zip" | "issue" | "details" | "form", string>>;
  values?: Record<string, string>;
};

// Placeholder storage: append a JSON line to .data/intake-submissions.jsonl.
// Swap for a DB/email/queue in production.
const DATA_DIR = path.join(process.cwd(), ".data");
const LOG_FILE = path.join(DATA_DIR, "intake-submissions.jsonl");

export async function submitIntake(
  _prev: IntakeFormState,
  formData: FormData
): Promise<IntakeFormState> {
  const raw = {
    name: (formData.get("name") ?? "") as string,
    phone: (formData.get("phone") ?? "") as string,
    email: (formData.get("email") ?? "") as string,
    zip: (formData.get("zip") ?? "") as string,
    issue: (formData.get("issue") ?? "") as string,
    details: (formData.get("details") ?? "") as string,
  };

  const parsed = IntakeSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: IntakeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] ?? "form") as keyof NonNullable<IntakeFormState["errors"]>;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors, values: raw };
  }

  const record = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ...parsed.data,
  };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(LOG_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.error("intake: failed to persist submission", err);
    return {
      ok: false,
      errors: { form: "We couldn't save your request. Please try again." },
      values: raw,
    };
  }

  redirect("/intake/thanks");
}
