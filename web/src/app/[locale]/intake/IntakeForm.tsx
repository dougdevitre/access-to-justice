"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ISSUE_TYPES } from "@/lib/intake";
import { submitIntake, type IntakeFormState } from "./actions";

const initialState: IntakeFormState = { ok: false };

/** A11y attributes injected into the wrapped input by `Field`. */
type A11yProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
};

export function IntakeForm() {
  const t = useTranslations("Intake");
  const locale = useLocale();
  const [state, formAction] = useActionState(submitIntake, initialState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="space-y-3" noValidate>
      <input type="hidden" name="__locale" value={locale} />
      {errors.form ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2"
        >
          {errors.form}
        </div>
      ) : null}

      <Field label={t("nameLabel")} htmlFor="name" error={errors.name}>
        {(a11y) => (
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={values.name ?? ""}
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            {...a11y}
          />
        )}
      </Field>

      <Field label={t("phoneLabel")} htmlFor="phone" error={errors.phone}>
        {(a11y) => (
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={values.phone ?? ""}
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            {...a11y}
          />
        )}
      </Field>

      <Field label={t("emailLabel")} htmlFor="email" error={errors.email}>
        {(a11y) => (
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            defaultValue={values.email ?? ""}
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            {...a11y}
          />
        )}
      </Field>

      <Field label={t("zipLabel")} htmlFor="zip" error={errors.zip}>
        {(a11y) => (
          <input
            id="zip"
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            defaultValue={values.zip ?? ""}
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            {...a11y}
          />
        )}
      </Field>

      <Field
        label={t("issueLabel")}
        htmlFor="issue"
        error={errors.issue}
        required
      >
        {(a11y) => (
          <select
            id="issue"
            name="issue"
            defaultValue={values.issue ?? ""}
            required
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            {...a11y}
          >
            <option value="" disabled>
              {t("issuePlaceholder")}
            </option>
            {ISSUE_TYPES.map((key) => (
              <option key={key} value={key}>
                {t(`issues.${key}`)}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field
        label={t("detailsLabel")}
        htmlFor="details"
        error={errors.details}
      >
        {(a11y) => (
          <textarea
            id="details"
            name="details"
            rows={5}
            defaultValue={values.details ?? ""}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            {...a11y}
          />
        )}
      </Field>

      <PrivacyAcknowledgment />
      <SubmitButton />
    </form>
  );
}

function PrivacyAcknowledgment() {
  const t = useTranslations("Intake");
  return (
    <p className="text-xs text-slate-600">
      {t.rich("privacyAck", {
        privacy: (chunks) => (
          <Link href="/privacy" className="underline text-brand">
            {chunks}
          </Link>
        ),
        terms: (chunks) => (
          <Link href="/terms" className="underline text-brand">
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}

function SubmitButton() {
  const t = useTranslations("Intake");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full min-h-12 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: (a11y: A11yProps) => React.ReactNode;
}) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const a11y: A11yProps = {
    ...(errorId ? { "aria-describedby": errorId } : {}),
    ...(error ? { "aria-invalid": true as const } : {}),
    ...(required ? { "aria-required": true as const } : {}),
  };
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-sm font-medium text-slate-800 mb-1">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      {children(a11y)}
      {error ? (
        <span
          id={errorId}
          role="alert"
          className="mt-1 block text-sm text-red-700"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
