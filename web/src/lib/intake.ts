import { z } from "zod";

export const ISSUE_TYPES = [
  "housing",
  "family",
  "benefits",
  "immigration",
  "employment",
  "consumer",
  "other",
] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_LABELS: Record<IssueType, string> = {
  housing: "Housing / Eviction",
  family: "Family",
  benefits: "Public Benefits",
  immigration: "Immigration",
  employment: "Employment",
  consumer: "Consumer / Debt",
  other: "Other",
};

const emailOrBlank = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /.+@.+\..+/.test(v), "Invalid email");

const zipOrBlank = z
  .string()
  .trim()
  .max(10)
  .refine(
    (v) => v === "" || /^[0-9]{5}(-[0-9]{4})?$/.test(v),
    "Invalid ZIP code"
  );

export const IntakeSubmissionSchema = z
  .object({
    name: z.string().trim().max(200).default(""),
    phone: z.string().trim().max(50).default(""),
    email: emailOrBlank.default(""),
    zip: zipOrBlank.default(""),
    issue: z.enum(ISSUE_TYPES, {
      errorMap: () => ({ message: "Please choose an issue type." }),
    }),
    details: z.string().trim().max(5000).default(""),
  })
  .refine((v) => v.phone !== "" || v.email !== "", {
    message: "Please provide a phone or email so we can reach you.",
    path: ["phone"],
  });

export type IntakeSubmission = z.infer<typeof IntakeSubmissionSchema>;
