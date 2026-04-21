import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "../components/Card";

export const metadata: Metadata = {
  title: "You're offline",
  description:
    "This page isn't available without a connection. Try again when you're back online.",
};

export default function OfflinePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">You&apos;re offline</h1>
      <Card>
        <p>
          This page isn&apos;t cached yet, so we can&apos;t show it without a
          connection. Pages you&apos;ve already visited (Home, Find Legal Help,
          Resources, Intake) will still work offline.
        </p>
      </Card>
      <Link
        href="/"
        className="inline-flex items-center justify-center w-full min-h-12 rounded-xl bg-brand text-white font-semibold"
      >
        Go home
      </Link>
    </div>
  );
}
