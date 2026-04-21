import Link from "next/link";
import { Card } from "./components/Card";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Page not found</h1>
      <Card>
        <p>
          The page you were looking for doesn&apos;t exist. Head back to the
          home screen to continue.
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
