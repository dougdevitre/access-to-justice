import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";
import { RegisterSW } from "../components/RegisterSW";
import { Footer } from "../components/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale as Locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <html lang={locale}>
      <body className="min-h-dvh flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-brand focus:shadow"
          >
            {t("skipToMain")}
          </a>
          <TopBar />
          <main
            id="main"
            className="flex-1 w-full max-w-screen-sm mx-auto px-4 pt-4 pb-24"
          >
            {children}
            <Footer />
          </main>
          <BottomNav />
          <RegisterSW />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
