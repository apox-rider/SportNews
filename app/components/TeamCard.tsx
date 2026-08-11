import { Link } from "react-router";
import SmartImage from "./ui/SmartImage";

export default function TeamCard({
  id,
  name,
  badge,
  league,
}: {
  id: string;
  name: string;
  badge?: string | null;
  league?: string | null;
}) {
  return (
    <Link
      to={`/teams/${id}`}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 p-2">
        <SmartImage
          src={badge}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
          {name}
        </h3>
        {league && (
          <p className="mt-0.5 truncate text-xs text-slate-500">{league}</p>
        )}
      </div>
    </Link>
  );
}
