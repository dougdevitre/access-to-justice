import { z } from "zod";
import { ISSUE_TYPES, type IntakeSubmission } from "@shared/types";

// Re-export the shared types/constants so existing `@/lib/intake` imports keep
// working and new callers don't need to know about @shared.
export * from "@shared/types";

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
    "Invalid ZIP code",
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

// Ensure the zod-parsed shape matches the shared IntakeSubmission type.
// If someone drifts one, TypeScript flags it here.
export type ParsedIntake = z.infer<typeof IntakeSubmissionSchema>;
const _typeCheck: IntakeSubmission = {} as ParsedIntake;
void _typeCheck;
