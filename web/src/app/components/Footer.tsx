import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");
  const linkClass =
    "min-h-11 inline-flex items-center hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded";
  return (
    <footer className="mt-8 border-t border-slate-200 pt-4 pb-2 text-sm text-slate-600">
      <nav
        aria-label={t("siteLinks")}
        className="flex flex-wrap gap-x-4 gap-y-2"
      >
        <Link href="/privacy" className={linkClass}>
          {t("privacy")}
        </Link>
        <Link href="/terms" className={linkClass}>
          {t("terms")}
        </Link>
        <Link href="/accessibility" className={linkClass}>
          {t("accessibility")}
        </Link>
      </nav>
      <p className="mt-2 text-xs">{t("notLegalAdvice")}</p>
    </footer>
  );
}
