import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getOrgs } from "./orgs-source";
import { ORGS as SEED } from "@shared/orgs";

const validRemote = [
  {
    id: "remote-org",
    name: "Remote Org",
    practiceAreas: ["housing"],
    phone: "(555) 000-0000",
    zip: "90210",
  },
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("getOrgs", () => {
  const originalUrl = process.env.ORGS_SOURCE_URL;
  beforeEach(() => {
    delete process.env.ORGS_SOURCE_URL;
  });
  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.ORGS_SOURCE_URL;
    } else {
      process.env.ORGS_SOURCE_URL = originalUrl;
    }
    vi.restoreAllMocks();
  });

  it("returns the seed when no URL is set", async () => {
    const orgs = await getOrgs();
    expect(orgs).toEqual(SEED);
  });

  it("returns the remote payload when it validates", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(validRemote));
    const orgs = await getOrgs({
      url: "https://example.test/orgs.json",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(orgs.map((o) => o.id)).toEqual(["remote-org"]);
  });

  it("falls back to the seed on non-OK HTTP and logs the error", async () => {
    const logged: unknown[] = [];
    const fetchMock = vi.fn(async () =>
      new Response("nope", { status: 500 }),
    );
    const orgs = await getOrgs({
      url: "https://example.test/orgs.json",
      fetchImpl: fetchMock as unknown as typeof fetch,
      onError: (err) => logged.push(err),
    });
    expect(orgs).toEqual(SEED);
    expect(logged.length).toBe(1);
  });

  it("falls back to the seed on a malformed remote payload", async () => {
    const logged: unknown[] = [];
    const fetchMock = vi.fn(async () =>
      jsonResponse([{ id: "bad" /* missing required fields */ }]),
    );
    const orgs = await getOrgs({
      url: "https://example.test/orgs.json",
      fetchImpl: fetchMock as unknown as typeof fetch,
      onError: (err) => logged.push(err),
    });
    expect(orgs).toEqual(SEED);
    expect(logged.length).toBe(1);
  });

  it("falls back to the seed if fetch throws", async () => {
    const logged: unknown[] = [];
    const fetchMock = vi.fn(async () => {
      throw new Error("network");
    });
    const orgs = await getOrgs({
      url: "https://example.test/orgs.json",
      fetchImpl: fetchMock as unknown as typeof fetch,
      onError: (err) => logged.push(err),
    });
    expect(orgs).toEqual(SEED);
    expect(logged.length).toBe(1);
  });
});
