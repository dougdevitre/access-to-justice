import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "../components/Card";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("title")}</h1>
      <Card>
        <p>{t("body")}</p>
      </Card>
      <Link
        href="/"
        className="inline-flex items-center justify-center w-full min-h-12 rounded-xl bg-brand text-white font-semibold"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
