"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "../components/Card";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("title")}</h1>
      <Card>
        <p>{t("body")}</p>
      </Card>
      <button
        type="button"
        onClick={reset}
        className="w-full min-h-12 rounded-xl bg-brand text-white font-semibold"
      >
        {t("retry")}
      </button>
    </div>
  );
}
