"use client";

import { useEffect } from "react";
import { Card } from "./components/Card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <Card>
        <p>
          We couldn&apos;t load this page. This is on us, not you. Try again,
          or come back in a moment.
        </p>
      </Card>
      <button
        type="button"
        onClick={reset}
        className="w-full min-h-12 rounded-xl bg-brand text-white font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
