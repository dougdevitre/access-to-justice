"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function TopBar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-brand text-white shadow-sm pt-[env(safe-area-inset-top)]">
      <div className="max-w-screen-sm mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
        >
          {t("brand")}
        </Link>
        <nav
          aria-label={t("switchLanguage")}
          className="flex items-center gap-1 text-sm"
        >
          {routing.locales.map((l) => {
            const active = l === locale;
            return (
              <Link
                key={l}
                href={pathname}
                locale={l}
                aria-current={active ? "true" : undefined}
                className={`min-h-8 min-w-8 px-2 rounded inline-flex items-center justify-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand ${
                  active ? "bg-white text-brand" : "text-white/90 hover:bg-white/10"
                }`}
              >
                {l.toUpperCase()}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
