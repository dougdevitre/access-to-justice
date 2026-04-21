import Link from "next/link";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-brand text-white shadow-sm pt-[env(safe-area-inset-top)]">
      <div className="max-w-screen-sm mx-auto px-4 h-14 flex items-center">
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
        >
          Access to Justice
        </Link>
      </div>
    </header>
  );
}
