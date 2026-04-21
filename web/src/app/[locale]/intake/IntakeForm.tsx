"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ISSUE_TYPES } from "@/lib/intake";
import { submitIntake, type IntakeFormState } from "./actions";

const initialState: IntakeFormState = { ok: false };

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
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm px-3 py-2"
        >
          {t("formError")}
        </p>
      ) : null}

      <Field label={t("nameLabel")} htmlFor="name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={values.name ?? ""}
          className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </Field>

      <Field label={t("phoneLabel")} htmlFor="phone" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={values.phone ?? ""}
          className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </Field>

      <Field label={t("emailLabel")} htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          defaultValue={values.email ?? ""}
          className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </Field>

      <Field label={t("zipLabel")} htmlFor="zip" error={errors.zip}>
        <input
          id="zip"
          name="zip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={10}
          defaultValue={values.zip ?? ""}
          className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </Field>

      <Field label={t("issueLabel")} htmlFor="issue" error={errors.issue} required>
        <select
          id="issue"
          name="issue"
          defaultValue={values.issue ?? ""}
          required
          className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
      </Field>

      <Field
        label={t("detailsLabel")}
        htmlFor="details"
        error={errors.details}
      >
        <textarea
          id="details"
          name="details"
          rows={5}
          defaultValue={values.details ?? ""}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
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
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-sm font-medium text-slate-800 mb-1">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span role="alert" className="mt-1 block text-sm text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}
