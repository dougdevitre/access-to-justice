"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginFormState } from "./actions";

const initial: LoginFormState = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-3 max-w-sm">
      <label htmlFor="password" className="block">
        <span className="block text-sm font-medium text-slate-800 mb-1">
          Admin password
        </span>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </label>
      {state.error ? (
        <p
          id="login-error"
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2"
        >
          {state.error}
        </p>
      ) : null}
      <SignInButton />
    </form>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 px-4 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
