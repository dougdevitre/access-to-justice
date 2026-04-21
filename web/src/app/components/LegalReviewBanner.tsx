import { getTranslations } from "next-intl/server";

export async function LegalReviewBanner() {
  const t = await getTranslations("LegalReview");
  return (
    <aside
      role="note"
      className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
    >
      <p className="font-semibold">{t("title")}</p>
      <p className="mt-1">{t("body")}</p>
    </aside>
  );
}
