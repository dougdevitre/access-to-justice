"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, FileText, type LucideIcon } from "lucide-react";

type Item = { href: string; label: string; Icon: LucideIcon };

const items: Item[] = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/find-help", label: "Find Help", Icon: Search },
  { href: "/resources", label: "Resources", Icon: BookOpen },
  { href: "/intake", label: "Intake", Icon: FileText },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-screen-sm mx-auto grid grid-cols-4">
        {items.map(({ href, label, Icon }) => {
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
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
