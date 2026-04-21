// Lightweight shared-password authentication for the /admin/orgs panel.
//
// One admin per deployment. Password lives in ADMIN_PASSWORD. Sessions are
// self-contained signed cookies (HMAC-SHA256) — no server-side store. That's
// enough for a single-operator ops UI; upgrade to SSO when you have > 1
// admin or need per-user audit.
//
// Fail-closed: if ADMIN_PASSWORD or ADMIN_SESSION_SECRET is unset, auth
// always fails. There is no default password.

import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "a2j_admin";
export const DEFAULT_SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

/** Check a submitted password against ADMIN_PASSWORD in a timing-safe way.
 *  Returns false if either side is unset or mismatched. */
export function verifyAdminPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !submitted) return false;
  const a = Buffer.from(submitted, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Build a signed session value of the form `<expSeconds>.<hmacHex>`.
 *  Expiry is embedded + signed so the cookie itself is the session. */
export function createSession(
  nowSeconds: number = Math.floor(Date.now() / 1000),
  ttlSeconds: number = DEFAULT_SESSION_TTL_SECONDS,
): string {
  const secret = requireSecret();
  const exp = nowSeconds + ttlSeconds;
  const body = String(exp);
  const sig = createHmac("sha256", secret).update(body).digest("hex");
  return `${body}.${sig}`;
}

/** Verify a session value. Returns true only if the signature is valid and
 *  the embedded expiry is in the future. */
export function verifySession(
  raw: string | undefined,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): boolean {
  if (!raw) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const dot = raw.indexOf(".");
  if (dot <= 0) return false;
  const body = raw.slice(0, dot);
  const providedSig = raw.slice(dot + 1);

  const expectedSig = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(providedSig, "hex");
  const b = Buffer.from(expectedSig, "hex");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  const exp = Number.parseInt(body, 10);
  if (!Number.isFinite(exp)) return false;
  return exp > nowSeconds;
}

function requireSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is unset. Generate one (e.g. `openssl rand -hex 32`) and add it to the deployment environment before using the admin panel.",
    );
  }
  return secret;
}
