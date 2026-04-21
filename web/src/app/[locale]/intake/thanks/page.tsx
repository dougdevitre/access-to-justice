import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "../../../components/Card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IntakeThanks" });
  return { title: t("title") };
}

export default async function IntakeThanksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("IntakeThanks");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("title")}</h1>
      <Card>
        <p>{t("body")}</p>
      </Card>
      <div className="grid grid-cols-1 gap-3">
        <Link
          href="/resources"
          className="inline-flex items-center justify-center min-h-12 rounded-xl bg-brand text-white font-semibold"
        >
          {t("resourcesCta")}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-12 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold"
        >
          {t("homeCta")}
        </Link>
      </div>
    </div>
  );
}
