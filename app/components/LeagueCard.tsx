import { Link } from "react-router";
import SmartImage from "./SmartImage";

export default function LeagueCard({
  id,
  name,
  sport,
  badge,
}: {
  id: string;
  name: string;
  sport?: string | null;
  badge?: string | null;
}) {
  return (
    <Link
      to={`/leagues/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="flex h-24 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 p-4">
        <SmartImage
          src={badge}
          alt={name}
          className="max-h-16 max-w-28 object-contain transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
          {name}
        </h3>
        {sport && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            {sport}
          </p>
        )}
      </div>
    </Link>
  );
}
