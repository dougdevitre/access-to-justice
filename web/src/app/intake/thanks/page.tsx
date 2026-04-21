import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "../../components/Card";

export const metadata: Metadata = {
  title: "Intake received",
  description: "Your intake request has been received.",
};

export default function IntakeThanksPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Thanks — we got your request.</h1>
      <Card>
        <p>
          A legal aid volunteer will reach out using the contact info you
          provided. In the meantime, take a look at our plain-language
          resources.
        </p>
      </Card>
      <div className="grid grid-cols-1 gap-3">
        <Link
          href="/resources"
          className="inline-flex items-center justify-center min-h-12 rounded-xl bg-brand text-white font-semibold"
        >
          Browse resources
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-12 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
