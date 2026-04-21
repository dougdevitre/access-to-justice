import { getTranslations } from "next-intl/server";

export async function LegalReviewBanner() {
  const t = await getTranslations("LegalReview");
  return (
    <aside
      role="note"
      aria-labelledby="legal-review-heading"
      className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
    >
      <h2 id="legal-review-heading" className="font-semibold text-base">
        {t("title")}
      </h2>
      <p className="mt-1">{t("body")}</p>
    </aside>
  );
}
