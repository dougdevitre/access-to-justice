import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySession } from "@/lib/admin-auth";
import { getOrgs } from "@/lib/orgs-source";
import { LoginForm } from "./LoginForm";
import { UploadForm } from "./UploadForm";

export const metadata: Metadata = {
  title: "Admin — Orgs",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function AdminOrgsPage() {
  const jar = await cookies();
  const authed = verifySession(jar.get(ADMIN_SESSION_COOKIE)?.value);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased p-6 max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-xl font-bold">Admin — organization directory</h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload a JSON array of orgs. The payload is validated before any
            write; only valid payloads replace the live directory.
          </p>
        </header>

        {authed ? <AuthedView /> : <LoginForm />}

        <footer className="mt-10 text-xs text-slate-500">
          <p>
            See <code>web/docs/ADMIN.md</code> for the schema, IAM policy, and
            operational notes.
          </p>
        </footer>
      </body>
    </html>
  );
}

async function AuthedView() {
  const orgs = await getOrgs();
  const currentJson = JSON.stringify(orgs, null, 2);
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Current directory has <strong>{orgs.length}</strong> entries.
      </p>
      <UploadForm currentJson={currentJson} />
    </div>
  );
}
