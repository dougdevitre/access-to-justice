import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalReviewBanner } from "../../components/LegalReviewBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });
  return { title: t("title") };
}

const SECTIONS = [
  "acceptance",
  "notLegalAdvice",
  "noAttorneyClient",
  "eligibility",
  "userObligations",
  "ourRole",
  "limitation",
  "warranty",
  "governingLaw",
  "changes",
  "contact",
] as const;

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Terms");

  return (
    <article className="space-y-6">
      <LegalReviewBanner />
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-slate-600">{t("effectiveDate")}</p>
        <p>{t("intro")}</p>
      </header>

      {SECTIONS.map((key) => {
        const paragraphs = t.raw(`sections.${key}.paragraphs`) as string[];
        return (
          <section key={key} className="space-y-2">
            <h2 className="text-lg font-semibold">
              {t(`sections.${key}.heading`)}
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-slate-800">
                {p}
              </p>
            ))}
          </section>
        );
      })}
    </article>
  );
}
