import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PRACTICE_AREAS, type PracticeArea } from "@shared/types";
import { searchOrgs, findOrgsByZip } from "@shared/types";
import { getOrgs } from "@/lib/orgs-source";
import { Card } from "../../components/Card";

type SearchParams = {
  q?: string;
  zip?: string;
  practiceArea?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FindHelp" });
  return { title: t("title") };
}

function normalizePracticeArea(value: unknown): PracticeArea | undefined {
  if (typeof value !== "string") return undefined;
  return (PRACTICE_AREAS as readonly string[]).includes(value)
    ? (value as PracticeArea)
    : undefined;
}

export default async function FindHelpPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("FindHelp");
  const tPractice = await getTranslations("PracticeAreas");

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const zip = typeof sp.zip === "string" ? sp.zip.trim() : "";
  const practiceArea = normalizePracticeArea(sp.practiceArea);

  const allOrgs = await getOrgs();
  let results = searchOrgs(allOrgs, { query: q, practiceArea });
  if (zip && /^[0-9]{5}(-[0-9]{4})?$/.test(zip)) {
    const byZip = new Set(findOrgsByZip(allOrgs, zip).map((o) => o.id));
    results = results.filter((o) => byZip.has(o.id));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("title")}</h1>

      <form
        role="search"
        method="GET"
        action={`/${locale}/find-help`}
        className="space-y-2"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="zip"
            defaultValue={zip}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder={t("zipPlaceholder")}
            aria-label={t("zipLabel")}
            className="flex-1 min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
          />
          <button
            type="submit"
            className="min-h-11 px-4 rounded-xl bg-brand text-white font-semibold"
          >
            {t("searchButton")}
          </button>
        </div>

        <label className="block">
          <span className="sr-only">{t("filterByPracticeArea")}</span>
          <select
            name="practiceArea"
            defaultValue={practiceArea ?? ""}
            aria-label={t("filterByPracticeArea")}
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
          >
            <option value="">{t("allPracticeAreas")}</option>
            {PRACTICE_AREAS.map((area) => (
              <option key={area} value={area}>
                {tPractice(area)}
              </option>
            ))}
          </select>
        </label>

        {q ? <input type="hidden" name="q" value={q} /> : null}
      </form>

      <p className="text-sm text-slate-600" aria-live="polite">
        {t("resultCount", { count: results.length })}
      </p>

      <div className="grid grid-cols-1 gap-3">
        {results.length === 0 ? (
          <Card>
            <p>{t("noResults")}</p>
          </Card>
        ) : (
          results.map((org) => (
            <Card
              key={org.id}
              title={org.name}
              footer={
                <a
                  href={`tel:${org.phone.replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center justify-center min-h-11 px-4 rounded-xl bg-brand-soft text-brand font-semibold"
                >
                  {t("callButton", { phone: org.phone })}
                </a>
              }
            >
              <p>
                <span className="font-medium text-slate-900">
                  {t("practiceAreasLabel")}
                </span>{" "}
                {org.practiceAreas.map((a) => tPractice(a)).join(", ")}
              </p>
              <p>
                <span className="font-medium text-slate-900">
                  {t("zipListLabel")}
                </span>{" "}
                {org.zip}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
