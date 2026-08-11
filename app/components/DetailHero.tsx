import type { ReactNode } from "react";
import SmartImage from "./ui/SmartImage";

export default function DetailHero({
  badge,
  flag,
  banner,
  title,
  subtitle,
  children,
}: {
  badge?: string | null;
  flag?: string | null;
  banner?: string | null;
  title: string;
  subtitle?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900">
      {banner ? (
        <div className="absolute inset-0">
          <SmartImage
            src={banner}
            alt={title}
            className="h-full w-full object-cover opacity-40"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-slate-900 to-slate-800" />
      )}
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
        {badge && (
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-lg">
            <SmartImage
              src={badge}
              alt={title}
              className="max-h-full max-w-full object-contain"
            />
            {flag && (
              <SmartImage
                src={flag}
                alt={title}
                className="absolute -right-2 -top-2 h-7 w-auto rounded-md shadow ring-2 ring-white"
              />
            )}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-slate-200">{subtitle}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </section>
  );
}
