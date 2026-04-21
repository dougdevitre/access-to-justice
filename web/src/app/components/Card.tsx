import type { ReactNode } from "react";

export function Card({
  title,
  children,
  footer,
}: {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      {title ? (
        <h2 className="text-base font-semibold text-slate-900 mb-2">{title}</h2>
      ) : null}
      <div className="text-sm text-slate-700 space-y-2">{children}</div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </section>
  );
}
