"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { logoutAction, uploadOrgsAction, type UploadFormState } from "./actions";

const initial: UploadFormState = {};

export function UploadForm({ currentJson }: { currentJson: string }) {
  const [state, action] = useActionState(uploadOrgsAction, initial);

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-3">
        <label htmlFor="json" className="block">
          <span className="block text-sm font-medium text-slate-800 mb-1">
            Org directory JSON
          </span>
          <textarea
            id="json"
            name="json"
            rows={18}
            spellCheck={false}
            defaultValue={currentJson}
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "upload-error" : undefined}
            className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </label>

        {state.error ? (
          <p
            id="upload-error"
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2 whitespace-pre-wrap"
          >
            {state.error}
          </p>
        ) : null}

        {state.ok ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm px-3 py-2"
          >
            Uploaded {state.ok.count} orgs to s3://{state.ok.bucket}/
            {state.ok.key} at {state.ok.at}.
          </p>
        ) : null}

        <UploadButton />
      </form>

      <form action={logoutAction}>
        <button
          type="submit"
          className="text-sm text-slate-600 underline hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 px-5 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {pending ? "Uploading…" : "Validate and upload"}
    </button>
  );
}
