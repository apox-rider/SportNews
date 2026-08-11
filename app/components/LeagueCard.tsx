import { Link } from "react-router";
import SmartImage from "./ui/SmartImage";

export default function LeagueCard({
  id,
  name,
  sport,
  badge,
  country,
  flagUrl,
  continent,
  division,
  currentSeason,
  formedYear,
  gender,
}: {
  id: string;
  name: string;
  sport?: string | null;
  badge?: string | null;
  country?: string | null;
  flagUrl?: string | null;
  continent?: string | null;
  division?: string | null;
  currentSeason?: string | null;
  formedYear?: string | null;
  gender?: string | null;
}) {
  const meta: Array<[string, string | null | undefined]> = [
    ["Season", currentSeason],
    ["Founded", formedYear],
  ].filter(([, v]) => Boolean(v)) as Array<[string, string]>;

  return (
    <Link
      to={`/leagues/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 p-4">
        <SmartImage
          src={badge}
          alt={name}
          className="max-h-16 max-w-28 object-contain transition group-hover:scale-105"
        />
        {flagUrl && (
          <SmartImage
            src={flagUrl}
            alt={country ?? "flag"}
            className="absolute right-2.5 top-2.5 h-5 w-auto rounded-sm shadow-sm ring-1 ring-slate-200"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
          {name}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
            {sport}
            {gender ? ` · ${gender}` : ""}
          </p>
          {continent && (
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {continent}
            </span>
          )}
        </div>

        {country && (
          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
            {flagUrl && (
              <img
                src={flagUrl}
                alt=""
                className="h-3.5 w-auto rounded-[2px]"
              />
            )}
            <span className="truncate">
              {country}
              {division ? ` · Division ${division}` : ""}
            </span>
          </p>
        )}

        {meta.length > 0 && (
          <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            {meta.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {label}
                </dt>
                <dd className="truncate text-xs font-medium text-slate-700">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Link>
  );
}
