import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createSession,
  verifyAdminPassword,
  verifySession,
} from "./admin-auth";

const PASSWORD_KEYS = ["ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"];

describe("verifyAdminPassword", () => {
  const snapshot: Record<string, string | undefined> = {};
  beforeEach(() => {
    for (const k of PASSWORD_KEYS) snapshot[k] = process.env[k];
  });
  afterEach(() => {
    for (const [k, v] of Object.entries(snapshot)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("returns false when ADMIN_PASSWORD is unset (fail-closed)", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyAdminPassword("anything")).toBe(false);
  });

  it("returns false for an empty submission", () => {
    process.env.ADMIN_PASSWORD = "correct";
    expect(verifyAdminPassword("")).toBe(false);
  });

  it("returns false for a mismatched password", () => {
    process.env.ADMIN_PASSWORD = "correct";
    expect(verifyAdminPassword("wrong")).toBe(false);
  });

  it("returns false when lengths differ (timing-safe guard)", () => {
    process.env.ADMIN_PASSWORD = "correct";
    expect(verifyAdminPassword("correctly")).toBe(false);
  });

  it("returns true for an exact match", () => {
    process.env.ADMIN_PASSWORD = "correct";
    expect(verifyAdminPassword("correct")).toBe(true);
  });
});

describe("session signing", () => {
  const snapshot: Record<string, string | undefined> = {};
  beforeEach(() => {
    for (const k of PASSWORD_KEYS) snapshot[k] = process.env[k];
    process.env.ADMIN_SESSION_SECRET = "test-secret-please-do-not-ship";
  });
  afterEach(() => {
    for (const [k, v] of Object.entries(snapshot)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("createSession + verifySession round-trip", () => {
    const now = 1_000_000;
    const token = createSession(now, 60);
    expect(verifySession(token, now + 30)).toBe(true);
  });

  it("rejects an expired token", () => {
    const now = 1_000_000;
    const token = createSession(now, 60);
    expect(verifySession(token, now + 61)).toBe(false);
  });

  it("rejects a tampered signature", () => {
    const now = 1_000_000;
    const token = createSession(now, 60);
    const [body, sig] = token.split(".");
    const tampered = `${body}.${sig.slice(0, -2)}ff`;
    expect(verifySession(tampered, now + 1)).toBe(false);
  });

  it("rejects a tampered expiry", () => {
    const now = 1_000_000;
    const token = createSession(now, 60);
    const [, sig] = token.split(".");
    const tampered = `${now + 9999}.${sig}`;
    expect(verifySession(tampered, now + 1)).toBe(false);
  });

  it("rejects an undefined or malformed cookie", () => {
    expect(verifySession(undefined)).toBe(false);
    expect(verifySession("")).toBe(false);
    expect(verifySession("notoken")).toBe(false);
    expect(verifySession(".nosig")).toBe(false);
  });

  it("rejects when ADMIN_SESSION_SECRET is unset at verify time", () => {
    const now = 1_000_000;
    const token = createSession(now, 60);
    delete process.env.ADMIN_SESSION_SECRET;
    expect(verifySession(token, now + 1)).toBe(false);
  });

  it("createSession throws when ADMIN_SESSION_SECRET is unset", () => {
    delete process.env.ADMIN_SESSION_SECRET;
    expect(() => createSession()).toThrow(/ADMIN_SESSION_SECRET/);
  });
});
