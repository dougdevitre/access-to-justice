import Link from "next/link";

// Fallback not-found for requests that don't match a locale-prefixed route.
// Locale-specific 404s live under /src/app/[locale]/not-found.tsx.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: "2rem" }}>
        <main>
          <h1>Page not found</h1>
          <p>
            <Link href="/">Go home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
