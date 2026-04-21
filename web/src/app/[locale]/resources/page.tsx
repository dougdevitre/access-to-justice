import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card } from "../../components/Card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Resources" });
  return { title: t("title") };
}

type Faq = { q: string; a: string };

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Resources");
  const items = t.raw("items") as Faq[];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{t("title")}</h1>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <Card key={item.q} title={item.q}>
            <p>{item.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
