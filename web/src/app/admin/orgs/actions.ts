"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  DEFAULT_SESSION_TTL_SECONDS,
  createSession,
  verifyAdminPassword,
  verifySession,
} from "@/lib/admin-auth";
import { OrgValidationError, validateOrgsList } from "@shared/orgs";
import { OrgsS3Error, resolveOrgsWriter } from "@/lib/orgs-s3";

export type LoginFormState = { error?: string };
export type UploadFormState = {
  error?: string;
  ok?: { bucket: string; key: string; count: number; at: string };
};

const secureCookie = process.env.NODE_ENV === "production";

async function assertAuthed() {
  const jar = await cookies();
  const raw = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySession(raw)) {
    redirect("/admin/orgs");
  }
}

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const submitted =
    typeof formData.get("password") === "string"
      ? (formData.get("password") as string)
      : "";
  if (!verifyAdminPassword(submitted)) {
    return { error: "Incorrect password." };
  }
  let token: string;
  try {
    token = createSession();
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Session secret not configured.",
    };
  }
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: DEFAULT_SESSION_TTL_SECONDS,
  });
  redirect("/admin/orgs");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/orgs");
}

export async function uploadOrgsAction(
  _prev: UploadFormState,
  formData: FormData,
): Promise<UploadFormState> {
  await assertAuthed();

  const raw = (formData.get("json") ?? "") as string;
  if (!raw.trim()) {
    return { error: "Paste a JSON array of orgs before uploading." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {
      error: `Could not parse as JSON: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    };
  }

  let validated;
  try {
    validated = validateOrgsList(parsed);
  } catch (err) {
    if (err instanceof OrgValidationError) {
      return { error: err.message };
    }
    throw err;
  }

  const writer = resolveOrgsWriter();
  if (!writer) {
    return {
      error:
        "ORGS_S3_BUCKET is not configured. Set it on the deployment environment.",
    };
  }

  const body = JSON.stringify(validated, null, 2);
  try {
    const result = await writer.put(body);
    // Invalidate the Next fetch cache so /find-help re-fetches from the
    // remote URL on the next request.
    revalidateTag("orgs");
    return {
      ok: {
        bucket: result.bucket,
        key: result.key,
        count: validated.length,
        at: new Date().toISOString(),
      },
    };
  } catch (err) {
    if (err instanceof OrgsS3Error) {
      console.error("orgs-s3:", err.message, err.cause);
      return { error: err.message };
    }
    throw err;
  }
}
