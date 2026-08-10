import { Link } from "react-router";
import SmartImage from "./SmartImage";

export default function PlayerCard({
  id,
  name,
  thumb,
  position,
  team,
  nationality,
}: {
  id: string;
  name: string;
  thumb?: string | null;
  position?: string | null;
  team?: string | null;
  nationality?: string | null;
}) {
  return (
    <Link
      to={`/players/${id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200">
        <SmartImage
          src={thumb}
          alt={name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
          {name}
        </h3>
        {position && (
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-emerald-600">
            {position}
          </p>
        )}
        {(team || nationality) && (
          <p className="mt-1 truncate text-xs text-slate-500">
            {[team, nationality].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
