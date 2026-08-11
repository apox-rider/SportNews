import { Link } from "react-router";

export function SectionHeader({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {title}
      </h2>
      {href && (
        <Link
          to={href}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          View all →
        </Link>
      )}
    </div>
  );
}
