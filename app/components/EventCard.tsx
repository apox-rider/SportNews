import { Link } from "react-router";
import SmartImage from "./ui/SmartImage";
import type { SportEvent } from "~/api/sportsdb/sportsdb-schema";

export function isFinished(event: SportEvent): boolean {
  const status = (event.strStatus ?? "").trim().toUpperCase();
  return status === "FT" || (event.intHomeScore != null && event.intAwayScore != null);
}

function formatDate(date?: string | null): string {
  if (!date) return "";
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TeamSide({
  name,
  badge,
  id,
}: {
  name?: string | null;
  badge?: string | null;
  id?: string | null;
}) {
  const body = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 p-1">
        <SmartImage src={badge} alt={name ?? "team"} className="max-h-full max-w-full object-contain" />
      </div>
      <span className="truncate text-sm font-semibold text-slate-900">
        {name ?? "TBD"}
      </span>
    </div>
  );

  return id ? (
    <Link to={`/teams/${id}`} className="flex min-w-0 flex-1 items-center gap-3">
      {body}
    </Link>
  ) : (
    body
  );
}

export default function EventCard({
  event,
  showLeague = false,
  compact = false,
}: {
  event: SportEvent;
  showLeague?: boolean;
  compact?: boolean;
}) {
  const finished = isFinished(event);
  const homeScore = event.intHomeScore ?? "–";
  const awayScore = event.intAwayScore ?? "–";

  return (
    <Link
      to={`/events/${event.idEvent}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
    >
      {compact && (event.strThumb || event.strBanner) && (
        <div className="h-28 overflow-hidden">
          <SmartImage
            src={event.strThumb || event.strBanner}
            alt={event.strEvent}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          <span className="truncate">
            {showLeague && event.strLeague ? event.strLeague : event.strSport}
          </span>
          <span className="shrink-0">
            {formatDate(event.dateEvent) || event.strSeason}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TeamSide
            name={event.strHomeTeam}
            badge={event.strHomeTeamBadge}
            id={event.idHomeTeam}
          />
          <div
            className={`shrink-0 rounded-lg px-2.5 py-1 text-center text-sm font-bold tabular-nums ${
              finished
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {homeScore}
          </div>
        </div>

        <div className="my-2 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
          <span className="h-px flex-1 bg-slate-100" />
          {finished ? "FT" : event.strTime ? "Upcoming" : "vs"}
          <span className="h-px flex-1 bg-slate-100" />
        </div>

        <div className="flex items-center gap-2">
          <TeamSide
            name={event.strAwayTeam}
            badge={event.strAwayTeamBadge}
            id={event.idAwayTeam}
          />
          <div
            className={`shrink-0 rounded-lg px-2.5 py-1 text-center text-sm font-bold tabular-nums ${
              finished
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {awayScore}
          </div>
        </div>
      </div>
    </Link>
  );
}
