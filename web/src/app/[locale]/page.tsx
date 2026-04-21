import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card } from "../components/Card";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <div className="space-y-4">
      <section className="bg-brand text-white rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-bold leading-tight">{t("title")}</h1>
        <p className="mt-2 text-brand-soft text-sm">{t("subtitle")}</p>
        <Link
          href="/find-help"
          className="mt-4 inline-flex items-center justify-center min-h-11 px-4 rounded-xl bg-white text-brand font-semibold"
        >
          {t("cta")}
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-3">
        <Card title={t("findHelpTitle")}>
          <p>{t("findHelpBody")}</p>
          <Link
            href="/find-help"
            className="inline-flex items-center min-h-11 text-brand font-medium"
          >
            {t("findHelpLink")}
          </Link>
        </Card>
        <Card title={t("resourcesTitle")}>
          <p>{t("resourcesBody")}</p>
          <Link
            href="/resources"
            className="inline-flex items-center min-h-11 text-brand font-medium"
          >
            {t("resourcesLink")}
          </Link>
        </Card>
        <Card title={t("intakeTitle")}>
          <p>{t("intakeBody")}</p>
          <Link
            href="/intake"
            className="inline-flex items-center min-h-11 text-brand font-medium"
          >
            {t("intakeLink")}
          </Link>
        </Card>
      </div>
    </div>
  );
}
