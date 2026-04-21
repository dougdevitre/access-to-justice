import type { Metadata } from "next";
import { Card } from "../components/Card";
import { IntakeForm } from "./IntakeForm";

export const metadata: Metadata = {
  title: "Start an Intake",
  description:
    "Share your situation and we'll route your request to the right legal aid organization.",
};

export default function IntakePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Start an Intake</h1>
      <Card>
        <p>
          Answer a few questions so we can route your request to the right
          organization. We&apos;ll need either a phone number or an email to
          follow up.
        </p>
      </Card>

      <IntakeForm />
    </div>
  );
}
