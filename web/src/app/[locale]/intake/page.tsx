import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card } from "../../components/Card";
import { IntakeForm } from "./IntakeForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Intake" });
  return { title: t("title") };
}

export default async function IntakePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Intake");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("title")}</h1>
      <Card>
        <p>{t("intro")}</p>
      </Card>
      <IntakeForm />
    </div>
  );
}
