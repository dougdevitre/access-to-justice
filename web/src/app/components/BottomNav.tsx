"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Search, BookOpen, FileText, type LucideIcon } from "lucide-react";

type ItemKey = "home" | "findHelp" | "resources" | "intake";
type Item = { key: ItemKey; href: string; Icon: LucideIcon };

const items: Item[] = [
  { key: "home", href: "/", Icon: Home },
  { key: "findHelp", href: "/find-help", Icon: Search },
  { key: "resources", href: "/resources", Icon: BookOpen },
  { key: "intake", href: "/intake", Icon: FileText },
];

export function BottomNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-screen-sm mx-auto grid grid-cols-4">
        {items.map(({ key, href, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-14 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                  active ? "text-brand" : "text-slate-600"
                }`}
              >
                <Icon aria-hidden="true" className="w-5 h-5" />
                <span>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
