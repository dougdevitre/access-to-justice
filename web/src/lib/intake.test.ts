import { describe, expect, it } from "vitest";
import { IntakeSubmissionSchema } from "./intake";

describe("IntakeSubmissionSchema", () => {
  const baseValid = {
    name: "Jane Doe",
    phone: "555-123-4567",
    email: "",
    zip: "10001",
    issue: "housing",
    details: "I received an eviction notice last week.",
  };

  it("accepts a valid submission with phone only", () => {
    const result = IntakeSubmissionSchema.safeParse(baseValid);
    expect(result.success).toBe(true);
  });

  it("accepts a valid submission with email only", () => {
    const result = IntakeSubmissionSchema.safeParse({
      ...baseValid,
      phone: "",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = IntakeSubmissionSchema.safeParse({
      ...baseValid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("email");
    }
  });

  it("rejects a malformed ZIP", () => {
    const result = IntakeSubmissionSchema.safeParse({
      ...baseValid,
      zip: "abc",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("zip");
    }
  });

  it("accepts ZIP+4 format", () => {
    const result = IntakeSubmissionSchema.safeParse({
      ...baseValid,
      zip: "10001-1234",
    });
    expect(result.success).toBe(true);
  });

  it("requires at least one of phone or email", () => {
    const result = IntakeSubmissionSchema.safeParse({
      ...baseValid,
      phone: "",
      email: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues[0];
      expect(issue.path).toEqual(["phone"]);
      expect(issue.message).toBe(
        "Please provide a phone or email so we can reach you.",
      );
    }
  });

  it("rejects a missing issue type", () => {
    const { issue: _issue, ...withoutIssue } = baseValid;
    void _issue;
    const result = IntakeSubmissionSchema.safeParse(withoutIssue);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("issue");
    }
  });

  it("rejects an unknown issue type", () => {
    const result = IntakeSubmissionSchema.safeParse({
      ...baseValid,
      issue: "nonexistent",
    });
    expect(result.success).toBe(false);
  });
});
