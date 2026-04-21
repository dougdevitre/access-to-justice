import Link from "next/link";
import { Card } from "./components/Card";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <section className="bg-brand text-white rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-bold leading-tight">
          Free legal help, made simple.
        </h1>
        <p className="mt-2 text-brand-soft text-sm">
          Find services near you, read plain-language resources, or start an
          intake request.
        </p>
        <Link
          href="/find-help"
          className="mt-4 inline-flex items-center justify-center min-h-11 px-4 rounded-xl bg-white text-brand font-semibold"
        >
          Find help now
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-3">
        <Card title="Find Legal Help">
          <p>Search free and low-cost legal aid organizations near you.</p>
          <Link
            href="/find-help"
            className="inline-flex items-center min-h-11 text-brand font-medium"
          >
            Browse organizations →
          </Link>
        </Card>
        <Card title="Resources">
          <p>Plain-language answers to common legal questions.</p>
          <Link
            href="/resources"
            className="inline-flex items-center min-h-11 text-brand font-medium"
          >
            Read resources →
          </Link>
        </Card>
        <Card title="Start an Intake">
          <p>Share your situation and we&apos;ll route you to the right help.</p>
          <Link
            href="/intake"
            className="inline-flex items-center min-h-11 text-brand font-medium"
          >
            Open intake form →
          </Link>
        </Card>
      </div>
    </div>
  );
}
