import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <footer className="mt-8 border-t border-slate-200 pt-4 pb-2 text-sm text-slate-600">
      <nav aria-label={t("legal")} className="flex flex-wrap gap-x-4 gap-y-2">
        <Link
          href="/privacy"
          className="min-h-11 inline-flex items-center hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        >
          {t("privacy")}
        </Link>
        <Link
          href="/terms"
          className="min-h-11 inline-flex items-center hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        >
          {t("terms")}
        </Link>
      </nav>
      <p className="mt-2 text-xs">{t("notLegalAdvice")}</p>
    </footer>
  );
}
